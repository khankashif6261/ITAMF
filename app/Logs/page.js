"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ClipboardList, RefreshCw, Search } from "lucide-react";
import SideBar from "../../Components/SideBar";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/logs`);

      if (!response.ok) {
        throw new Error("Unable to load logs");
      }

      const data = await response.json();
      setLogs(data.logs || []);
    } catch (fetchError) {
      console.error("Error fetching logs:", fetchError);
      setError("We couldn't load the audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const query = search.toLowerCase().trim();
  const filteredLogs = logs.filter((log) =>
    [log.userName, log.action, log.itemType, log.itemName, log.message].some(
      (value) => value?.toLowerCase().includes(query)
    )
  );

  const getActionBadge = (action) => {
    const badges = {
      CREATE: "bg-green-50 text-green-700 ring-green-600/20",
      UPDATE: "bg-blue-50 text-blue-700 ring-blue-600/20",
      DELETE: "bg-red-50 text-red-700 ring-red-600/20",
    };

    return badges[action] || "bg-gray-50 text-gray-700 ring-gray-600/20";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="Logs" />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Logs</h1>
              <p className="mt-1 text-sm text-gray-500">
                View all create, update, and delete activity.
              </p>
            </div>

            <button
              onClick={fetchLogs}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </header>

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Total logs
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {logs.length}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <ClipboardList size={22} />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-4">
              <label className="flex w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:max-w-sm">
                <Search size={17} className="mr-2 shrink-0 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search logs..."
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-3.5">Time</th>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Action</th>
                    <th className="px-6 py-3.5">Type</th>
                    <th className="px-6 py-3.5">Item</th>
                    <th className="px-6 py-3.5">Message</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <LoadingRow key={index} />
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center">
                        <AlertCircle size={28} className="mx-auto text-red-400" />
                        <p className="mt-2 font-medium text-gray-700">{error}</p>
                        <button
                          onClick={fetchLogs}
                          className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Try again
                        </button>
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center text-gray-500">
                        <ClipboardList size={30} className="mx-auto mb-2 text-gray-300" />
                        {search ? "No logs match your search." : "No logs found."}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log._id} className="transition-colors hover:bg-blue-50/30">
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {log.userName || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getActionBadge(
                              log.action
                            )}`}
                          >
                            {log.action || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{log.itemType || "-"}</td>
                        <td className="px-6 py-4 text-gray-600">{log.itemName || "-"}</td>
                        <td className="px-6 py-4 text-gray-600">{log.message || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && !error && (
              <div className="border-t border-gray-100 px-6 py-3 text-xs text-gray-500">
                Showing {filteredLogs.length} of {logs.length} logs
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function LoadingRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <div className="h-4 rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  );
}
