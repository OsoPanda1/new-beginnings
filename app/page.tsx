"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import QuantumLayout from "../src/components/layout/QuantumLayout";
import WelcomeMessage from "../src/components/WelcomeMessage";
import Auth from "../src/pages/Auth";
import GlobalWall from "../src/pages/GlobalWall";
import DreamSpaces from "../src/pages/DreamSpaces";
import Wallet from "../src/pages/Wallet";
import AudioKaos from "../src/pages/AudioKaos";
import Projects from "../src/pages/Projects";
import Profile from "../src/pages/Profile";
import Chats from "../src/pages/Chats";
import Gallery from "../src/pages/Gallery";
import Lives from "../src/pages/Lives";
import Marketplace from "../src/pages/Marketplace";
import AdminDashboard from "../src/pages/AdminDashboard";
import KnowledgeSystem from "../src/pages/KnowledgeSystem";
import University from "../src/pages/University";
import Groups from "../src/pages/Groups";
import Community from "../src/pages/Community";
import NotFound from "../src/pages/NotFound";
import Home from "../src/pages/Home";
import Manifest from "../src/pages/Manifest";
import SecurityDashboard from "../src/pages/SecurityDashboard";
import { Dashboard } from "../src/components/Dashboard";
import Lottery from "../src/pages/Lottery";
import Referrals from "../src/pages/Referrals";
import Games from "../src/pages/Games";
import Settings from "../src/pages/Settings";
import Help from "../src/pages/Help";
import MSRBlockchain from "../src/pages/MSRBlockchain";
import BookPI from "../src/pages/BookPI";
import TruthDashboard from "../src/pages/TruthDashboard";
import Nubiwallet from "../src/pages/Nubiwallet";
import LotteryVRF from "../src/pages/LotteryVRF";
import FederatedDashboard from "../src/pages/FederatedDashboard";
import QuantumDemo from "../src/pages/QuantumDemo";
import Render4D from "../src/pages/Render4D";
import GuardiansCenter from "../src/pages/GuardiansCenter";
import { useState } from "react";

function AppContent() {
  return (
    <QuantumLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/lives" element={<Lives />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/knowledge" element={<KnowledgeSystem />} />
        <Route path="/university" element={<University />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/community" element={<Community />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dreamspaces" element={<DreamSpaces />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/audio-kaos" element={<AudioKaos />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/global-wall" element={<GlobalWall />} />
        <Route path="/wall" element={<GlobalWall />} />
        <Route path="/manifest" element={<Manifest />} />
        <Route path="/security" element={<SecurityDashboard />} />
        <Route path="/lottery" element={<Lottery />} />
        <Route path="/lottery-vrf" element={<LotteryVRF />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/games" element={<Games />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/msr-blockchain" element={<MSRBlockchain />} />
        <Route path="/bookpi" element={<BookPI />} />
        <Route path="/truth-dashboard" element={<TruthDashboard />} />
        <Route path="/nubiwallet" element={<Nubiwallet />} />
        <Route path="/federation" element={<FederatedDashboard />} />
        <Route path="/quantum-demo" element={<QuantumDemo />} />
        <Route path="/render-4d" element={<Render4D />} />
        <Route path="/guardians" element={<GuardiansCenter />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QuantumLayout>
  );
}

export default function Page() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WelcomeMessage />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
