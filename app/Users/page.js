"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import SideBar from "../../Components/SideBar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
const [editingUser, setEditingUser] = useState(null);
const openAddModal = () => {
  setEditingUser(null);

  setFormData({
    name: "",
    email: "",
    password: "",
    role: "viewer",
  });

  setShowModal(true);
};

const openEditModal = (user) => {
  setEditingUser(user);

  setFormData({
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
  });

  setShowModal(true);
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    if (editingUser) {
      await fetch(`${apiUrl}/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(`${apiUrl}/api/user/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    setShowModal(false);
    fetchUsers();
  } catch (err) {
    console.log(err);
  }
};

const handleDelete = async (id) => {
  if (!confirm("Delete this user?")) return;

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  await fetch(`${apiUrl}/api/users/${id}`, {
    method: "DELETE",
  });

  fetchUsers();
};
const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: "viewer",
});

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/users`);

      if (!response.ok) {
        throw new Error("Unable to load users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (fetchError) {
      console.error("Error fetching users:", fetchError);
      setError("We couldn't load the users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const query = search.toLowerCase().trim();

  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.role].some((value) =>
      value?.toLowerCase().includes(query)
    )
  );

  const adminCount = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  ).length;

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-red-50 text-red-700 ring-red-600/20",
      viewer: "bg-blue-50 text-blue-700 ring-blue-600/20",
      pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    };

    return (
      badges[role?.toLowerCase()] ||
      "bg-gray-50 text-gray-700 ring-gray-600/20"
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="Users" />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Users</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage team access and user roles.
              </p>
            </div>

            <button  onClick={openAddModal}  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto">
              <Plus size={18} />
              Add User
            </button>
          </header>

          <section className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Total users"
              value={users.length}
              icon={UserRound}
              iconClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              label="Administrators"
              value={adminCount}
              icon={ShieldCheck}
              iconClass="bg-violet-50 text-violet-600"  
            />
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-4">
              <label className="flex w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:max-w-sm">
                <Search
                  size={17}
                  className="mr-2 shrink-0 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search users..."
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-3.5">Actions</th>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Joined</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <LoadingRow key={index} />
                    ))  
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center">
                        <AlertCircle
                          size={28}
                          className="mx-auto text-red-400"
                        />

                        <p className="mt-2 font-medium text-gray-700">
                          {error}
                        </p>

                        <button
                          onClick={fetchUsers}
                          className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Try again
                        </button>
                      </td>
                      
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-14 text-center text-gray-500"
                      >
                        <UserRound
                          size={30}
                          className="mx-auto mb-2 text-gray-300"
                        />

                        {search
                          ? "No users match your search."
                          : "No users found."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
  <tr
    key={user._id}
    className="transition-colors hover:bg-blue-50/30"
  >
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
          {getInitials(user.name)}
        </div>

        <span className="font-semibold text-gray-800">
          {user.name || "Unnamed user"}
        </span>
      </div>
    </td>

    <td className="px-6 py-4 text-gray-600">
      {user.email || "-"}
    </td>

    <td className="px-6 py-4">
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getRoleBadge(
          user.role
        )}`}
      >
        {user.role || "User"}
      </span>
    </td>

    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
      {user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-"}
    </td>

    <td className="px-6 py-4">
      <div className="flex justify-center gap-2">

        <button
          onClick={() => openEditModal(user)}
          className="rounded-lg p-2 text-blue-600 hover:bg-blue-100"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => handleDelete(user._id)}
          className="rounded-lg p-2 text-red-600 hover:bg-red-100"
        >
          <Trash2 size={18} />
        </button>

      </div>
    </td>
  </tr>
))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && !error && (
              <div className="border-t border-gray-100 px-6 py-3 text-xs text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            )}
          </section>
        </div>
        {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {editingUser ? "Edit User" : "Add User"}
        </h2>

        <button onClick={() => setShowModal(false)}>
          <X size={20}/>
        </button>
      </div>

      <div className="space-y-4">

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <select
          className="w-full rounded-lg border p-3"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
          <option value="pending">Pending</option>
        </select>

      </div>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => setShowModal(false)}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          {editingUser ? "Update User" : "Create User"}
        </button>

      </div>

    </div>

  </div>
)}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
        </div>

        <div className={`rounded-lg p-3 ${iconClass}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function LoadingRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-10 w-40 rounded bg-gray-100" />
      </td>

      <td className="px-6 py-4">
        <div className="h-4 w-44 rounded bg-gray-100" />
      </td>

      <td className="px-6 py-4">
        <div className="h-6 w-16 rounded-full bg-gray-100" />
      </td>

      <td className="px-6 py-4">
        <div className="h-4 w-24 rounded bg-gray-100" />
      </td>

      <td className="px-6 py-4">
        <div className="mx-auto h-8 w-20 rounded bg-gray-100" />
      </td>
    </tr>
  );
}