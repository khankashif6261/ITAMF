"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ASSET_CONFIGS } from "../../../config/assetConfigs.js";
import SideBar from "../../../Components/SideBar.js";

// Handles nested keys like "specs.ram" → { specs: { ram: value } }
function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, k) => acc?.[k], obj) ?? "";
}

function setNestedValue(obj, key, value) {
  const keys = key.split(".");
  const updated = { ...obj };
  let ref = updated;
  for (let i = 0; i < keys.length - 1; i++) {
    ref[keys[i]] = { ...(ref[keys[i]] || {}) };
    ref = ref[keys[i]];
  }
  ref[keys[keys.length - 1]] = value;
  return updated;
}

export default function EditAssetPage() {
  const { id } = useParams();
  const type = useSearchParams().get("type");
  const router = useRouter();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const config = ASSET_CONFIGS[type];

  useEffect(() => {
    if (!config) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${config.apiEndpoint}/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setFormData(data.data || {});
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load asset.");
        setLoading(false);
      });
  }, [id, type]);

  const handleChange = (key, value) => {
    setFormData((prev) => setNestedValue(prev, key, value));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${config.apiEndpoint}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      setSuccess(true);
      setTimeout(() => router.back(), 1000);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!config)
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <main className="flex-1 p-6">
          <p className="text-red-500">Invalid asset type: "{type}"</p>
        </main>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />

      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-500 hover:text-gray-700 mb-1 flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-semibold">Edit {config.title}</h2>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-6 text-gray-400 text-sm">
            Loading asset...
          </div>
        )}

        {/* Form */}
        {!loading && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {config.fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {field.label}
                  </label>

                  {field.type === "select" ? (
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={getNestedValue(formData, field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={getNestedValue(formData, field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            Saved! Redirecting...
          </p>
        )}

        {/* Actions */}
        {!loading && (
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => router.back()}
              className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
    