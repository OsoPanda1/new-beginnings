import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import CrystalSidebar from "@/components/navigation/CrystalSidebar";
import CrystalTopBar from "@/components/navigation/CrystalTopBar";
import CrystalRightPanel from "@/components/navigation/CrystalRightPanel";
import IsabellaOrb from "@/components/IsabellaOrb";

interface QuantumLayoutProps {
  children: ReactNode;
}

export default function QuantumLayout({ children }: QuantumLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background relative overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <CrystalTopBar />
      <CrystalSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content - full width when sidebar is closed */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-[72px] min-h-screen relative z-10"
      >
        <div className="p-4 md:p-6">{children}</div>
      </motion.main>
      
      <CrystalRightPanel />
      <IsabellaOrb />
    </div>
  );
}
