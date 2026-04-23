"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation'
import LoginCard from "./LoginCard";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function Header() {
  const pathname = usePathname();
  const { user, openLogin, closeLogin, isLoginOpen, logout } = useAuth();

  const router = useRouter();

  return (
    <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO LINK TO HOME */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-emerald-400"
              >
                <Logo className="w-8 h-8" />
              </motion.div>
              <span className="text-xl font-semibold text-slate-100">
                ResumeAI
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {/* NEW RESUME LINK */}
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname === "/"
                        ? "bg-emerald-600/20 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-700/50"
                    }`}
                  >
                    New Resume
                  </motion.button>
                </Link>
                {/* LINK TO DASHBOARD */}
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname === "/dashboard" || pathname === "/settings"
                        ? "bg-emerald-600/20 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-700/50"
                    }`}
                  >
                    Dashboard
                  </motion.button>
                </Link>
              </div>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </motion.button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-slate-800 border-slate-700"
                  >
                    <div className="px-2 py-2">
                      <p className="text-sm font-medium text-slate-200">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                      onSelect={() => router.push('/settings')}
                      className="text-slate-300 focus:bg-slate-700 focus:text-slate-100 cursor-pointer"
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={async () => {
                        await logout();
                        router.push('/');
                        router.refresh();
                      }}
                      className="text-red-400 focus:bg-red-950/30 focus:text-red-300 cursor-pointer"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openLogin}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                >
                  <Logo className="w-16 h-16" />
                </motion.button>
              )}

              {/* LOGIN / SIGNUP MODAL */}
              <Dialog open={isLoginOpen} onOpenChange={closeLogin}>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
                  <DialogTitle className="sr-only" />
                  <LoginCard />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
