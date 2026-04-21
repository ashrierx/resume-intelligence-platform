"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import LoginCard from "@/components/layout/LoginCard";

export default function SettingsForm() {
  const router = useRouter();
  const { user, setAuth, isAuthLoading } = useAuth();
  const supabase = createClient();
  const [fullname, setFullname] = useState(user?.name ?? "");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/");
      return;
    }

    setFullname(user?.name ?? "");
  }, [isAuthLoading, router, user]);

  async function updateProfile(name: string | undefined) {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      const nextName = (name ?? "").trim();
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: nextName,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      setFullname(nextName);
      setAuth({ ...user, name: nextName });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setError("Error updating profile.");
    } finally {
      setLoading(false);
    }
  }

  if (isAuthLoading || !user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-slate-400">Loading account...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 mb-4"
        >
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-slate-100">Account Settings</h1>
        <p className="text-slate-400 mt-2">Manage your profile information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LoginCard
          initialMode="settings"
          initialValues={{ name: fullname, email: user.email }}
          onSubmit={({ name }) => updateProfile(name)}
        />
      </motion.div>

      {isSaved && (
        <p className="text-emerald-400 text-sm">Profile saved.</p>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {loading && <p className="text-slate-400 text-sm">Saving changes...</p>}
    </div>
  );
}
