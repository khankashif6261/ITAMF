"use client";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  TrendingUp,
  Package,
  Users,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "./Context/userContext";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, XAxis, YAxis, Bar, ResponsiveContainer, CartesianGrid,
} from "recharts";
import SideBar from "../Components/SideBar";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#e11d48"];

// Custom pie label
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DashboardPage() {
    const router = useRouter();

  const [stats, setStats] = useState([
    { title: "Total Assets",      value: 0, icon: Package,    color: "blue"   },
    { title: "In Use",            value: 0, icon: Users,      color: "green"  },
    { title: "Available",         value: 0, icon: TrendingUp, color: "purple" },
    { title: "Under Maintenance", value: 0, icon: Wrench,     color: "orange" },
  ]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, setuser } = useUser();
  const currentUser = user?.[0];

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setuser([]);
    router.replace("/requestAccess");
    router.refresh();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emp-assets`);
        const data = await res.json();
        const assets = data.data || [];

        const total       = assets.length;
        const inUse       = assets.filter((a) => a["Status"]?.toLowerCase() === "active").length;
        const maintenance = assets.filter((a) => a["Repair Status"] && a["Repair Status"].trim() !== "").length;
        const available   = total - inUse;

        setStats([
          { title: "Total Assets",      value: total,       icon: Package,    color: "blue"   },
          { title: "In Use",            value: inUse,       icon: Users,      color: "green"  },
          { title: "Available",         value: available,   icon: TrendingUp, color: "purple" },
          { title: "Under Maintenance", value: maintenance, icon: Wrench,     color: "orange" },
        ]);

        // Pie — by department
        const deptCount = {};
        assets.forEach((a) => {
          const dept = a["Dept"]?.trim() || "Unknown";
          deptCount[dept] = (deptCount[dept] || 0) + 1;
        });
        setPieData(Object.entries(deptCount).map(([name, value]) => ({ name, value })));

        // Bar — by asset type
        const typeCount = {};
        assets.forEach((a) => {
          const type = a["Asset Type"]?.trim() || "Unknown";
          typeCount[type] = (typeCount[type] || 0) + 1;
        });
        setBarData(Object.entries(typeCount).map(([name, value]) => ({ name, value })));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statColors = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   icon: "bg-blue-100"   },
    green:  { bg: "bg-green-50",  text: "text-green-600",  icon: "bg-green-100"  },
    purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-500", icon: "bg-orange-100" },
  };

  const quickActions = [
    { label: "Retail Asset",    sub: "Create retail assets →",   path: "/createRetail"        },
    { label: "Employee Asset",  sub: "Assign to employees →",    path: "/createEmpAsset"      },
    { label: "Instock Asset",   sub: "Add to inventory →",       path: "/createInstock"       },
    { label: "Asset Purchase",  sub: "Record asset purchase →",  path: "/createAssetPurchase" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar active="Dashboard" />

      <main className="flex-1 p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-400 mt-0.5">Welcome back, {currentUser?.name || "Admin"}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-lg gap-2 shadow-sm">
              <Search size={15} className="text-gray-400" />
              <input placeholder="Search assets..." className="outline-none text-sm bg-transparent w-48" />
            </div>
            <div className="p-2 rounded-full hover:bg-white shadow-sm cursor-pointer transition">
              <Bell size={20} className="text-gray-500" />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                className="flex items-center gap-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm shadow">
                  {currentUser?.name?.[0]?.toUpperCase() || "A"}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-gray-500 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    onClick={() => setProfileMenuOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
                  >
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {currentUser?.name || "Admin"}
                      </p>
                      <p className="mt-0.5 truncate text-xs capitalize text-gray-500">
                        {currentUser?.role || "User"}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const c = statColors[s.color];
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                <div className={`${c.icon} p-3 rounded-xl`}>
                  <Icon size={20} className={c.text} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{s.title}</p>
                  <h3 className={`text-2xl font-bold mt-0.5 ${c.text}`}>
                    {loading ? "—" : s.value}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions — admin only */}
        {user?.[0]?.role === "admin" && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">Create Assets</h3>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map((a) => (
                <div
                  key={a.path}
                  onClick={() => router.push(a.path)}
                  className="cursor-pointer border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] transition"
                >
                  <p className="font-medium text-gray-700">{a.label}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{a.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">

          {/* Pie chart */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-1">Assets by Department</h3>
            <p className="text-xs text-gray-400 mb-4">Distribution across departments</p>
            {pieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-300 text-sm">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar chart */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-1">Assets by Category</h3>
            <p className="text-xs text-gray-400 mb-4">Count per asset type</p>
            {barData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-300 text-sm">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "#f0f7ff" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}