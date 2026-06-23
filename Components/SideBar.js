"use client";
import Link from "next/link";
import { useUser } from "../app/Context/userContext";
import {
  LayoutDashboard,
  Laptop,
  Users,
  FileText,
  BarChart3,
  ClipboardList,
  Settings,
} from "lucide-react";

export default function Sidebar({ active = "Dashboard" }) {
  const { user } = useUser();
 const menu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Retail Assets", icon: Laptop, href: "/assets" },
  { label: "Emp Assets", icon: Users, href: "/assets/empassets" },
  { label: "Instock Assets", icon: Laptop, href: "/assets/instockassets" },
  { label: "Asset Purchased", icon: FileText, href: "/assets/assetpurchase" },

  { label: "Users", icon: Users, href: "/Users", adminOnly: true },
  { label: "Export Report", icon: BarChart3, href: "/exports", adminOnly: true },
  { label: "Notifications", icon: FileText, href: "/Notifications", adminOnly: true },
  { label: "Logs", icon: ClipboardList, href: "/Logs", adminOnly: true }
];

  return (
      <aside className="w-64 bg-slate-950 text-white flex flex-col min-h-screen border-r border-slate-800">
      {/* Top */}
      <div className="p-5">
        <h1 className="text-2xl font-bold tracking-wide mb-8">
          ITAM
        </h1>

        <nav className="space-y-2">
          {menu
  .filter((item) => !item.adminOnly || user?.[0]?.role === "admin")
  .map((item, i) => {
    const Icon = item.icon;
    const isActive = active === item.label;

    return (
      <Link key={i} href={item.href}>
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer
          ${
            isActive
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Icon size={18} />
          <span className="text-sm">{item.label}</span>
        </div>
      </Link>
    );
  })}
        </nav>
      </div>

      

    </aside>
  );
}
