"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../Components/SideBar";
const userId = typeof window !== "undefined" 
  ? localStorage.getItem("userId") 
  : null;
export default function Notifications() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/access-requests`, {
  headers: {
    userid: userId,
  },
});
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id, role) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/approve-access`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    userid: userId,
  },
  body: JSON.stringify({ userId: id, role }),
});

    fetchRequests(); // refresh list
  };

  const reject = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reject-access`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    userid: userId,
  },
  body: JSON.stringify({ userId: id }),
});

    fetchRequests(); // refresh list
  };

  if (loading) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="Notifications" />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading access requests...</p>
        </div>
      </main>
    </div>
  );
}

  return (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar active="Notifications" />

    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Access Requests
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review and manage user access requests.
            </p>
          </div>

          <button
            onClick={fetchRequests}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Pending Requests
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {requests.length}
          </h2>
        </div>

        {/* Requests */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {requests.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                🔔
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                No Pending Requests
              </h3>

              <p className="mt-2 text-gray-500">
                All access requests have been processed.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {requests.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {user.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => approve(user._id, "viewer")}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => approve(user._id, "admin")}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                    >
                      Make Admin
                    </button>

                    <button
                      onClick={() => reject(user._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  </div>
);
}