"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, Eye, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { useUser } from "../../Context/userContext";
import SideBar from "../../../Components/SideBar";

export default function EmployeeAssetsPage() {
  const { user } = useUser();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/delete-emp-asset/${id}`,
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
      limit: "10",
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emp-assets?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setAssets(data.data || []));
  }, [search, page]);

  const activeCount = assets.filter((a) => a["Status"]?.toLowerCase() === "active").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="Emp Assets" />

      <main className="flex-1 p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Assets</h1>
            <p className="text-sm text-gray-400 mt-0.5">Assets assigned to employees</p>
          </div>
          <div className="flex items-center gap-3">
            
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total Assets"  value={assets.length}                  color="blue"   />
          <StatCard title="Active"        value={activeCount}                     color="green"  />
          <StatCard title="Inactive"      value={assets.length - activeCount}     color="red"    />
          <StatCard title="Departments"   value={new Set(assets.map((a) => a["Dept"]).filter(Boolean)).size} color="purple" />
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
          <div className="flex items-center border border-gray-200 px-3 py-2 rounded-lg w-1/3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Search size={15} className="mr-2 text-gray-400" />
            <input
              placeholder="Search by serial, employee, tag..."
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
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-left">Dept</th>
                <th className="px-4 py-3 text-left">Asset Tag</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Serial</th>
                <th className="px-4 py-3 text-left">Status</th>
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
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-700">{a["Username"] || "-"}</p>
                      <p className="text-xs text-gray-400">{a["Employees Id"] || ""}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{a["Dept"] || "-"}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{a["Current Asset TAG"] || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{a["Asset Type"] || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{a["Serial Number"] || "-"}</td>
                    <td className="px-4 py-3">
                      {a["Status"]?.toLowerCase() === "active" ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-50 text-red-500 font-medium">{a["Status"] || "Inactive"}</span>
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
                          href={`/editAsset/${a._id}?type=empAsset`}
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
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <Detail label="Designation"    value={a["Designation"]}           />
                          <Detail label="Date of Joining" value={a["Date of Joining"]}      />
                          <Detail label="Make"           value={a["Make"]}                  />
                          <Detail label="Model"          value={a["Model"]}                 />
                          <Detail label="RAM"            value={a["RAM"]}                   />
                          <Detail label="CPU"            value={a["Processor"]}             />
                          <Detail label="Storage"        value={a["HDD/SSD"]}               />
                          <Detail label="Primary Tag"    value={a["Primary Asset Tag no"]}  />
                          <Detail label="Location"       value={a["Asset location"]}        />
                          <Detail label="Old Tag"        value={a["Old Asset TAG"]}         />
                          <Detail label="Common Asset"   value={a["Common Asset"]}          />
                          <Detail label="Accessories"    value={a["Additional Accessories"]}/>
                          <div className="col-span-2">
                            <Detail label="Remarks" value={a["Remark"]} />
                          </div>
                          <div className="col-span-2">
                            <Detail label="Additional Remarks" value={a["Additional Remarks"]} />
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
            <p>Page {page}</p>
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
    purple: "text-purple-600",
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