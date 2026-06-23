"use client";
import { useState } from "react";
import SideBar from "../../Components/SideBar";

export default function CreateRetailAssetPage() {
  const [form, setForm] = useState({
    type: "",
    assetTag: "",
    brand: "",
    model: "",
    serialNumber: "",
    ram: "",
    cpu: "",
    storage: "",
    locationName: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      type: "",
      assetTag: "",
      brand: "",
      model: "",
      serialNumber: "",
      ram: "",
      cpu: "",
      storage: "",
      locationName: "",
      remarks: "",
    });
  };

  const handleSubmit = async () => {
    // 🔴 Basic validation
    if (!form.type || !form.assetTag) {
      alert("Asset Type and Asset Tag are required");
      return;
    }
    
    setLoading(true);

    // ✅ Transform to backend schema
    const payload = {
      type: form.type,
      assetTag: form.assetTag,
      brand: form.brand,
      model: form.model,
      serialNumber: form.serialNumber,
      specs: {
        ram: form.ram,
        cpu: form.cpu,
        storage: form.storage,
      },
      location: {
        name: form.locationName,
      },
      remarks: form.remarks,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-retail-asset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create asset");
      }

      alert("✅ Asset created successfully");
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar active="Assets" />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Create Retail Asset
        </h1>

        <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">

          <Input label="Asset Type" value={form.type} onChange={(v) => handleChange("type", v)} />
          <Input label="Asset Tag" value={form.assetTag} onChange={(v) => handleChange("assetTag", v)} />
          <Input label="Brand" value={form.brand} onChange={(v) => handleChange("brand", v)} />
          <Input label="Model" value={form.model} onChange={(v) => handleChange("model", v)} />
          <Input label="Serial Number" value={form.serialNumber} onChange={(v) => handleChange("serialNumber", v)} />

          <Input label="RAM" value={form.ram} onChange={(v) => handleChange("ram", v)} />
          <Input label="CPU" value={form.cpu} onChange={(v) => handleChange("cpu", v)} />
          <Input label="Storage" value={form.storage} onChange={(v) => handleChange("storage", v)} />

          <Input label="Location" value={form.locationName} onChange={(v) => handleChange("locationName", v)} />
          <Input label="Remarks" value={form.remarks} onChange={(v) => handleChange("remarks", v)} />

        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <button
            onClick={resetForm}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
          >
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}

// 🔹 Reusable Input Component
function Input({ label, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}