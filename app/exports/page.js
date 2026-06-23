"use client";

import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import SideBar from "../../Components/SideBar";

export default function ExportPage() {
  const [loading, setLoading] = useState(false);

  const exportExcel = async () => {
    try {
      setLoading(true);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/export-all`);

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      const today = new Date().toISOString().split("T")[0];

      link.href = url;
      link.download = `ITAM_Export_${today}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="Export Report" />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl">

          <div className="rounded-2xl bg-white p-10 shadow">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-green-100 p-4">
                <FileSpreadsheet
                  size={45}
                  className="text-green-700"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Export ITAM Data
                </h1>

                <p className="mt-2 text-gray-500">
                  Download all ITAM records into one Excel workbook.
                </p>
              </div>

            </div>

            <div className="mt-10 rounded-xl border bg-gray-50 p-6">

              <h2 className="mb-4 text-xl font-semibold">
                The exported workbook includes
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-lg border bg-white p-4">
                  📦 Retail Assets
                </div>

                <div className="rounded-lg border bg-white p-4">
                  👨‍💼 Employee Assets
                </div>

                <div className="rounded-lg border bg-white p-4">
                  📥 Instock Assets
                </div>

                <div className="rounded-lg border bg-white p-4">
                  🧾 Asset Purchase
                </div>

              </div>

            </div>

            <div className="mt-10">

              <button
                onClick={exportExcel}
                disabled={loading}
                className={`flex items-center gap-3 rounded-xl px-6 py-4 text-white transition ${
                  loading
                    ? "cursor-not-allowed bg-gray-500"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Download size={22} />

                {loading
                  ? "Preparing Excel..."
                  : "Export Complete Workbook"}
              </button>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}