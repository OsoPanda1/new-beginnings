import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import QuantumLayout from "./components/layout/QuantumLayout";
import WelcomeMessage from "./components/WelcomeMessage";
import Auth from "./pages/Auth";
import GlobalWall from "./pages/GlobalWall";
import DreamSpaces from "./pages/DreamSpaces";
import Wallet from "./pages/Wallet";
import AudioKaos from "./pages/AudioKaos";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Chats from "./pages/Chats";
import Gallery from "./pages/Gallery";
import Lives from "./pages/Lives";
import Marketplace from "./pages/Marketplace";
import AdminDashboard from "./pages/AdminDashboard";
import KnowledgeSystem from "./pages/KnowledgeSystem";
import University from "./pages/University";
import Groups from "./pages/Groups";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Manifest from "./pages/Manifest";
import SecurityDashboard from "./pages/SecurityDashboard";
import { Dashboard } from "@/components/Dashboard";
import Lottery from "./pages/Lottery";
import Referrals from "./pages/Referrals";
import Games from "./pages/Games";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import MSRBlockchain from "./pages/MSRBlockchain";
import BookPI from "./pages/BookPI";
import TruthDashboard from "./pages/TruthDashboard";
import Nubiwallet from "./pages/Nubiwallet";
import LotteryVRF from "./pages/LotteryVRF";
import FederatedDashboard from "./pages/FederatedDashboard";
import QuantumDemo from "./pages/QuantumDemo";
import Render4D from "./pages/Render4D";
import GuardiansCenter from "./pages/GuardiansCenter";
import DigitalPets from "./pages/DigitalPets";
import Trueque from "./pages/Trueque";
import Auctions from "./pages/Auctions";
import DAOGovernance from "./pages/DAOGovernance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <WelcomeMessage />
        <BrowserRouter>
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
              <Route path="/pets" element={<DigitalPets />} />
              <Route path="/trueque" element={<Trueque />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/dao" element={<DAOGovernance />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QuantumLayout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
