"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../utils/helper";

export default function PendingPage() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = await getCurrentUser();

      // 🔥 when approved → redirect
      if (user && user.role !== "pending") {
        router.push("/");
      }
    }, 3000); // check every 3 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">
        Waiting for admin approval...
      </h1>
    </div>
  );
}