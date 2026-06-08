"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore();

  useEffect(() => {
    const stored = localStorage.getItem("opencodeLingo_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, [setUser]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LocalAuthProvider>
        {mounted ? children : <div className="min-h-screen bg-background" />}
      </LocalAuthProvider>
    </ThemeProvider>
  );
}
