"use client";

import { motion } from "framer-motion";
import NexusIcon from "./NexusIcon";

interface PremiumBannerProps {
  type: "memory" | "guardian" | "execution" | "audit" | "sovereignty" | "security" | "architecture" | "cancellation" | "finance" | "gdpr" | "wealth";
  imagePath: string;
  title: string;
  subtitle: string;
  tag: string;
  showAnimation?: boolean;
}

export default function PremiumBanner({ type, imagePath, title, subtitle, tag, showAnimation = true }: PremiumBannerProps) {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/5" style={{ background: "#050d18", minHeight: "75vh" }}>
      
      {/* Background Layer 0: Animated Tech Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: "linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} 
        />
        {showAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,229,255,0.05)] to-transparent"
            style={{ height: "200%" }}
          />
        )}
      </div>

      {/* Background Layer 1: Atmospheric Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] height-[600px] bg-[rgba(0,229,255,0.08)] blur-[120px] rounded-full z-0 transform -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] height-[500px] bg-[rgba(187,134,252,0.05)] blur-[100px] rounded-full z-0 transform translate-y-1/2" />

      {/* Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-center pt-32 pb-24">
        
        {/* Tag Badge */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6 }}
           className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 glass-card border-[rgba(0,229,255,0.2)] text-[0.65rem] font-mono tracking-[0.2em] text-[var(--sovereign-cyan)] uppercase shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <NexusIcon type={type} size={14} />
            {tag}
          </div>
        </motion.div>

        {/* Main Headings */}
        <div className="text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-space-grotesk font-extrabold text-[clamp(3.5rem,10vw,6rem)] leading-[0.9] text-white tracking-tighter mb-8"
            style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}
          >
            {title}<span className="text-[var(--sovereign-cyan)]">.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/50 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 3D Asset Anchor (Immersive) */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
          className="mt-16 relative w-full max-w-2xl aspect-[16/9] flex justify-center"
        >
           {/* Visual Depth Circle */}
           <div className="absolute inset-0 bg-radial-gradient from-[rgba(0,229,255,0.1)] to-transparent blur-3xl transform scale-125" />
           
           <img 
              src={imagePath} 
              alt={title}
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_40px_80px_rgba(0,229,255,0.25)]"
           />
           
           {/* Bottom Shadow / Grounding */}
           <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-4/5 h-[10px] bg-black blur-xl opacity-80" />
        </motion.div>
      </div>

      {/* Decorative Bottom Line (Scanner Effect) */}
      <motion.div 
        animate={{ left: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--sovereign-cyan)] to-transparent opacity-30"
      />
    </section>
  );
}
