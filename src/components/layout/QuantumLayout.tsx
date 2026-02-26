import { ReactNode } from "react";
import { motion } from "framer-motion";
import QuantumSidebarLeft from "@/components/navigation/QuantumSidebarLeft";
import QuantumTopBar from "@/components/navigation/QuantumTopBar";
import QuantumRightPanel from "@/components/navigation/QuantumRightPanel";
import IsabellaOrb from "@/components/IsabellaOrb";

interface QuantumLayoutProps {
  children: ReactNode;
}

export default function QuantumLayout({ children }: QuantumLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Top navigation bar */}
      <QuantumTopBar />
      
      {/* Left sidebar */}
      <QuantumSidebarLeft />
      
      {/* Main content area */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20 lg:pl-[280px] min-h-screen relative z-10"
      >
        <div className="p-4 md:p-6">
          {children}
        </div>
      </motion.main>
      
      {/* Right panel */}
      <QuantumRightPanel />
      
      {/* Isabella AI floating orb - global presence */}
      <IsabellaOrb />
    </div>
  );
}
