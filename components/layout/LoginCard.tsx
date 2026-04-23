import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface LoginPageProps {
  initialMode?: "login" | "signup" | "settings";
  initialValues?: { name?: string; email?: string };
  onSubmit?: (data: {
    name?: string;
    email: string;
    password: string;
    mode: string;
  }) => Promise<void> | void;
}

export default function LoginCard({
  initialMode = "login",
  initialValues = {},
  onSubmit,
}: LoginPageProps) {
  const { closeLogin, login, signup } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState(initialValues.name ?? "");
  const [email, setEmail] = useState(initialValues.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "settings") {
        await onSubmit?.({ name, email, password, mode });
        return;
      }

      if (mode === "login") {
        const authError = await login(email, password);
        if (authError) {
          setError(authError);
          return;
        }
      }

      if (mode === "signup") {
        const authError = await signup(name, email, password);
        if (authError) {
          setError(authError);
          return;
        }
      }

      closeLogin();
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-8"
    >
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-100">
            {mode === "login"
              ? "Welcome Back"
              : mode === "signup"
                ? "Create an Account"
                : "Update Profile"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {mode === "login"
              ? "Enter your credentials to access your account"
              : "Sign up to start creating AI-powered resumes"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === "signup" || mode === "settings") && (
            // NAME (SIGNUP ONLY)
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-slate-900/50 border-slate-600 text-slate-100"
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-900/50 border-slate-600 text-slate-100"
            />
          </div>

          {mode !== "settings" && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-900/50 border-slate-600 text-slate-100"
              />
              <p className="text-xs text-slate-500">Minimum 6 characters</p>
            </div>
          )}

          {/* Submission Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/30 border border-red-800/50 rounded text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "settings"
                ? "Save Changes"
                : mode === "login"
                  ? "Log In"
                  : "Sign Up"}
          </Button>
        </form>

        {mode !== "settings" && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {mode === "login"
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
