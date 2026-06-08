"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, CheckCircle, XCircle } from "lucide-react";

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const runSetup = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/setup");
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to connect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-bouncy p-8 max-w-md w-full text-center"
      >
        <Database className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Database Setup</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Initialize the Neon database tables for OpenCodeLingo.
        </p>

        {status === "idle" && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={runSetup}
            className="btn-3d-primary w-full"
          >
            Initialize Database
          </motion.button>
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Setting up database...
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 text-accent justify-center">
            <CheckCircle className="w-5 h-5" />
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-destructive justify-center">
            <XCircle className="w-5 h-5" />
            <span className="text-sm">{message}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
