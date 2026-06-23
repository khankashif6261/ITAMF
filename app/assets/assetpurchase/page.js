"use client";

import React, { useEffect, useState } from "react";
import SideBar from "../../../Components/SideBar";
import Link from "next/link";
import { useUser } from "../../Context/userContext";
import { Search, Bell, Eye, Trash2, Pencil } from "lucide-react";

export default function AssetPurchasePage() {
  const { user } = useUser();
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/delete-asset-purchase/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      alert(data.alert);
      setPurchases((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const query = new URLSearchParams({
      search,
      page: String(page),
      limit: "10000",
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/asset-purchases?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setPurchases(data.data || []));
  }, [search, page]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="Asset Purchased" />

      <main className="flex-1 p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Asset Purchases</h1>
            <p className="text-sm text-gray-400 mt-0.5">Track and manage all purchased assets</p>
          </div>
          <div className="flex items-center gap-3">
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total Purchases" value={purchases.length} color="blue" />
          <StatCard title="Vendors" value={new Set(purchases.map((p) => p.vendorName)).size} color="green" />
          <StatCard title="Departments" value={new Set(purchases.map((p) => p.department)).size} color="purple" />
          <StatCard title="Invoices" value={new Set(purchases.map((p) => p.invoiceNo).filter(Boolean)).size} color="orange" />
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
          <div className="flex items-center border border-gray-200 px-3 py-2 rounded-lg w-1/3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Search size={15} className="mr-2 text-gray-400" />
            <input
              placeholder="Search by tag, serial, invoice..."
              className="outline-none w-full bg-transparent text-sm"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            />
          </div>
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm transition"
            onClick={() => { setSearch(""); setPage(1); }}
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Asset Tag</th>
                <th className="px-4 py-3 text-left">Asset Code</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Brand / Model</th>
                <th className="px-4 py-3 text-left">Serial Number</th>
                <th className="px-4 py-3 text-left">Vendor</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-10">
                    No purchases found
                  </td>
                </tr>
              )}

              {purchases.map((p, i) => (
                <React.Fragment key={p._id}>
                  <tr className="hover:bg-blue-50/30 transition">
                    <td className="px-4 py-3 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{p.assetTag || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{p.assetCode || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 font-medium">
                        {p.category || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.brand} / {p.model}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.serialNumber}</td>
                    <td className="px-4 py-3 text-gray-500">{p.vendorName || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setExpandedRow((prev) => prev === p._id ? null : p._id)}
                          className="text-gray-400 hover:text-blue-600 transition"
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                        
                        {user?.[0]?.role === "admin" && (
                          <>
                          <Link
                          href={`/editAsset/${p._id}?type=purchase`}
                          className="text-gray-400 hover:text-green-600 transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="text-gray-400 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedRow === p._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                          <Detail label="Invoice" value={p.invoiceNo} />
                          <Detail label="Assigned To" value={p.assignedTo} />
                          <Detail label="Department" value={p.department} />
                          <Detail label="Purchase Date" value={p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : null} />
                          <Detail label="Warranty Start" value={p.warranty?.startDate ? new Date(p.warranty.startDate).toLocaleDateString() : null} />
                          <Detail label="Warranty End" value={p.warranty?.endDate ? new Date(p.warranty.endDate).toLocaleDateString() : null} />
                          <Detail label="RAM" value={p.specs?.ram} />
                          <Detail label="CPU" value={p.specs?.cpu} />
                          <Detail label="Storage" value={p.specs?.storage} />
                          <div className="col-span-4">
                            <Detail label="Remarks" value={p.remarks} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-4 py-3 flex justify-between items-center border-t border-gray-100 text-sm text-gray-500">
            <p>Showing {purchases.length} results</p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <button
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p className="text-gray-400 text-xs uppercase tracking-wide">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${colors[color]?.split(" ")[1]}`}>{value}</h2>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-gray-700 mt-0.5">{value || "-"}</p>
    </div>
  );
}