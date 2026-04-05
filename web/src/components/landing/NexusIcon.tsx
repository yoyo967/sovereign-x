"use client";

import { motion } from "framer-motion";

interface NexusIconProps {
  type: "memory" | "guardian" | "execution" | "audit" | "sovereignty" | "security" | "architecture" | "cancellation" | "finance" | "gdpr" | "wealth";
  size?: number;
  className?: string;
}

export default function NexusIcon({ type, size = 120, className = "" }: NexusIconProps) {
  const cyan = "var(--sovereign-cyan, #00E5FF)";
  const purple = "var(--sovereign-purple, #BB86FC)";
  const gold = "var(--sovereign-gold, #FFD600)";

  const renderIcon = () => {
    switch (type) {
      case "memory":
        return (
          <motion.svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
            <motion.rect
              x="20" y="20" width="60" height="60" rx="4"
              stroke={cyan} strokeWidth="1.5"
              animate={{ strokeOpacity: [0.3, 0.8, 0.3], scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path
              d="M30 40 L70 40 M30 50 L50 50 M30 60 L60 60"
              stroke={cyan} strokeWidth="1" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.circle cx="70" cy="70" r="15" stroke={cyan} strokeWidth="0.5" strokeDasharray="2 2" />
          </motion.svg>
        );
      case "guardian":
        return (
          <motion.svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
            <motion.circle
              cx="50" cy="50" r="35"
              stroke={cyan} strokeWidth="2"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M35 50 L50 35 L65 50 L50 65 Z"
              fill={cyan} fillOpacity="0.1"
              stroke={cyan} strokeWidth="1.5"
            />
            <motion.circle cx="50" cy="50" r="5" fill={cyan} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.svg>
        );
      case "execution":
        return (
          <motion.svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
            <motion.path
              d="M20 50 L40 50 L50 30 L60 70 L70 50 L80 50"
              stroke={cyan} strokeWidth="2"
              animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <rect x="15" y="45" width="70" height="10" stroke={cyan} strokeWidth="0.5" strokeDasharray="4 4" />
          </motion.svg>
        );
      case "audit":
        return (
          <motion.svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
            {[20, 40, 60, 80].map((y, i) => (
              <motion.rect
                key={i}
                x="30" y={y-10} width="40" height="15"
                stroke={cyan} strokeWidth="1.5"
                animate={{ x: [30, 32, 30] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
            <motion.path d="M50 10 V90" stroke={cyan} strokeWidth="0.5" strokeDasharray="2 2" />
          </motion.svg>
        );
      case "security":
        return (
          <motion.svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
             <motion.path
              d="M50 15 L20 30 V55 C20 75 50 85 50 85 C50 85 80 75 80 55 V30 L50 15Z"
              stroke={gold} strokeWidth="2"
              animate={{ strokeOpacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.path d="M40 50 L47 57 L60 43" stroke={gold} strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
        );
      case "finance":
      case "wealth":
        return (
          <motion.svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
            <motion.circle cx="50" cy="50" r="30" stroke={gold} strokeWidth="1" strokeDasharray="4 4" animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
            <motion.path d="M50 30 V70 M30 50 L70 50" stroke={gold} strokeWidth="1.5" />
            <motion.path d="M40 40 L60 60 M60 40 L40 60" stroke={gold} strokeWidth="0.5" opacity="0.5" />
          </motion.svg>
        );
      case "cancellation":
        return (
          <motion.svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
            <motion.path
              d="M20 20 L80 80 M80 20 L20 80"
              stroke={cyan} strokeWidth="1" strokeOpacity="0.2"
            />
            <motion.rect
              x="30" y="30" width="40" height="40"
              stroke={cyan} strokeWidth="2"
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.path d="M10 50 H90" stroke={cyan} strokeWidth="0.5" strokeDasharray="5 5" />
          </motion.svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: type === "security" || type === "finance" || type === "wealth" ? "radial-gradient(circle, rgba(255,214,0,0.08) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)",
        }}
      />
      {renderIcon()}
    </div>
  );
}
