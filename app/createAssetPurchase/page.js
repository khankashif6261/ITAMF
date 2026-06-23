"use client";
import { useState } from "react";
import SideBar from "../../Components/SideBar";

export default function CreateAssetPurchasePage() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const fields = [
    { key: "invoiceNo",          label: "Invoice No",       type: "text" },
    { key: "category",           label: "Category",         type: "text" },
    { key: "assetCode",          label: "Asset Code",       type: "text" },
    { key: "assetTag",           label: "Asset Tag",        type: "text" },
    { key: "assignedTo",         label: "Assigned To",      type: "text" },
    { key: "brand",              label: "Brand",            type: "text" },
    { key: "model",              label: "Model",            type: "text" },
    { key: "serialNumber",       label: "Serial Number",    type: "text" },
    { key: "specs.ram",          label: "RAM",              type: "text" },
    { key: "specs.cpu",          label: "CPU",              type: "text" },
    { key: "specs.storage",      label: "Storage",          type: "text" },
    { key: "purchaseDate",       label: "Purchase Date",    type: "date" },
    { key: "department",         label: "Department",       type: "text" },
    { key: "vendorName",         label: "Vendor Name",      type: "text" },
    { key: "warranty.startDate", label: "Warranty Start",   type: "date" },
    { key: "warranty.endDate",   label: "Warranty End",     type: "date" },
    { key: "remarks",            label: "Remarks",          type: "text" },
  ];

  const handleChange = (key, value) => {
    const keys = key.split(".");
    if (keys.length === 1) {
      setForm((prev) => ({ ...prev, [key]: value }));
    } else {
      setForm((prev) => ({
        ...prev,
        [keys[0]]: {
          ...(prev[keys[0]] || {}),
          [keys[1]]: value,
        },
      }));
    }
  };

  const getValue = (key) => {
    const keys = key.split(".");
    if (keys.length === 1) return form[key] || "";
    return form[keys[0]]?.[keys[1]] || "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-asset-purchase`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      alert(data.alert || "Done");

      if (res.ok) setForm({});
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar active="Asset Purchased" />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Create Asset Purchase</h1>

        <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={getValue(field.key)}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${field.label}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </main>
    </div>
  );
}