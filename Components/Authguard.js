"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "../app/utils/helper";

export default function AuthGuard({ children, adminOnly = false }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
useEffect(()=> {
console.log("the AuthGuard is getting mounted!!!");
}, [])
  useEffect(() => {
  const checkAccess = async () => {
    try {
      if (pathname === "/requestAccess" || pathname === "/pending") {
        setLoading(false);
        return;
      }

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setLoading(false);
        router.push("/requestAccess");
        return;
      }

      const data = await getCurrentUser();
      const user = Array.isArray(data) ? data[0] : data;
      console.log("data from getCurrentuser: ",data);

      if (!user) {
        setLoading(false);
        router.push("/requestAccess");
        return;
      }

      if (user.role === "pending") {
        setLoading(false);
        router.push("/pending");
        return;
      }

      if (adminOnly && user.role !== "admin") {
        setLoading(false);
        router.push("/");
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error("AuthGuard error:", err);
      setLoading(false);
      router.push("/requestAccess");
    }
  };

  checkAccess();
}, [pathname, adminOnly, router]);
  if (loading) return <p className="p-6">Checking access...</p>;

  return children;
}