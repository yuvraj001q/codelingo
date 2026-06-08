"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("opencodeLingo_user");
    if (!user && !stored) {
      router.push("/login");
    } else if (!user && stored) {
      useStore.getState().setUser(JSON.parse(stored));
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
