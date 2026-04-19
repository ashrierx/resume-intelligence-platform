import { motion } from "framer-motion";

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M20 30 L50 20 L80 30 L80 70 L50 80 L20 70 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M35 45 L50 40 L65 45 L65 60 L50 65 L35 60 Z"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      <motion.line
        x1="50"
        y1="20"
        x2="50"
        y2="40"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      />
    </svg>
  );
}
