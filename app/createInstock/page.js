"use client";
import { useState } from "react";
import SideBar from "../../Components/SideBar";

export default function CreateInStockPage() {
const [form, setForm] = useState({});
const [loading, setLoading] = useState(false);

const fields = [
"Asset Type",
"Scrap",
"Username",
"Asset Tag No",
"Make",
"Model",
"Serial Number",
"RAM",
"Processor",
"HDD/SSD",
"Remarks",
"Repair Status",
];

const handleChange = (key, value) => {
setForm((prev) => ({
...prev,
[key]: value,
}));
};

const handleSubmit = async () => {
setLoading(true);


try {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/create-instock`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }
  );

  const data = await res.json();

  alert(data.alert || "Done");

  if (res.ok) {
    setForm({});
  }
} catch (err) {
  console.error(err);
  alert("Something went wrong ❌", err);
}

setLoading(false);


};

return ( <div className="flex min-h-screen bg-gray-100"> <SideBar active="Assets" />


  <main className="flex-1 p-6">
    <h1 className="text-2xl font-semibold mb-6">
      Add InStock Asset
    </h1>

    <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">
      {fields.map((field) => (
        <div key={field} className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            {field}
          </label>

          <input
            type="text"
            value={form[field] || ""}
            onChange={(e) =>
              handleChange(field, e.target.value)
            }
            className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${field}`}
          />
        </div>
      ))}
    </div>

    <div className="mt-6">
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Submitting..." : "Create Asset"}
      </button>
    </div>
  </main>
</div>


);
}
