import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const { closeLogin } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    // setAuth({ name, email }); // Simulate successful login/signup
    closeLogin();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-8"
    >
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode == "signup" && (
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

          {/* PASSWORD */}
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {mode == "login" ? "Log In" : "Sign Up"}
          </Button>
        </form>

        {/* Options to switch between login and signup */}
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
      </Card>
    </motion.div>
  );
}
