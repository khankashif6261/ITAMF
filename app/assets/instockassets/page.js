"use client";
import React, { useEffect, useState } from "react";
import SideBar from "../../../Components/SideBar";
import { useUser } from "../../Context/userContext";
import Link from "next/link";
import { Search, Bell, Eye, Trash2, Pencil } from "lucide-react";

export default function InstockPage() {
  const { user } = useUser();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/delete-instock-asset/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      alert(data.alert);
      setAssets((prev) => prev.filter((item) => item._id !== id));
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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/instock-assets?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setAssets(data.data || []));
  }, [search, page]);

  const scrapCount = assets.filter((a) => a["Scrap"]?.toLowerCase() === "yes").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="Instock Assets" />

      <main className="flex-1 p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Instock Assets</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage all inventory assets</p>
          </div>
          <div className="flex items-center gap-3">
            
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total Assets"  value={assets.length}           color="blue"   />
          <StatCard title="Available"     value={assets.length - scrapCount} color="green"  />
          <StatCard title="Scrap"         value={scrapCount}               color="red"    />
          <StatCard title="Under Repair"  value={assets.filter((a) => a["Repair Status"]).length} color="orange" />
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
          <div className="flex items-center border border-gray-200 px-3 py-2 rounded-lg w-1/3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Search size={15} className="mr-2 text-gray-400" />
            <input
              placeholder="Search serial, tag, make..."
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
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Make / Model</th>
                <th className="px-4 py-3 text-left">Serial</th>
                <th className="px-4 py-3 text-left">Repair Status</th>
                <th className="px-4 py-3 text-left">Scrap</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {assets.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-10">
                    No assets found
                  </td>
                </tr>
              )}

              {assets.map((a, i) => (
                <React.Fragment key={a._id}>
                  <tr className="hover:bg-blue-50/30 transition">
                    <td className="px-4 py-3 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{a["Asset Tag No"] || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{a["Asset Type"] || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{a["Make"]} / {a["Model"]}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{a["Serial Number"] || "-"}</td>
                    <td className="px-4 py-3">
                      {a["Repair Status"] ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-600 font-medium">
                          {a["Repair Status"]}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {a["Scrap"]?.toLowerCase() === "yes" ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-50 text-red-500 font-medium">Scrap</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600 font-medium">OK</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setExpandedRow((prev) => prev === a._id ? null : a._id)}
                          className="text-gray-400 hover:text-blue-600 transition"
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                        
                        {user?.[0]?.role === "admin" && (
                          <>
                          <Link
                          href={`/editAsset/${a._id}?type=instock`}
                          className="text-gray-400 hover:text-green-600 transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                          <button
                            onClick={() => handleDelete(a._id)}
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
                  {expandedRow === a._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                          <Detail label="Username"      value={a["Username"]}       />
                          <Detail label="RAM"           value={a["RAM"]}            />
                          <Detail label="CPU"           value={a["Processor"]}      />
                          <Detail label="Storage"       value={a["HDD/SSD"]}        />
                          <Detail label="Repair Status" value={a["Repair Status"]}  />
                          <Detail label="Scrap"         value={a["Scrap"]}          />
                          <div className="col-span-4">
                            <Detail label="Remarks" value={a["Remarks"]} />
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
            <p>Showing {assets.length} results</p>
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
    blue:   "text-blue-600",
    green:  "text-green-600",
    red:    "text-red-500",
    orange: "text-orange-500",
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p className="text-gray-400 text-xs uppercase tracking-wide">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${colors[color]}`}>{value}</h2>
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