import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LessonComments from "@/components/dashboard/LessonComments";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Sparkles,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

// Module visual assets mapping
import funnelImg from "@/assets/funnel-marketing-digital.jpg";
import seoGrowthImg from "@/assets/seo-growth.jpg";
import geoTargetingImg from "@/assets/geo-targeting-local-seo.jpg";
import brandingImg from "@/assets/branding-identity-framework.jpg";
import aiMarketingImg from "@/assets/ai-marketing-automation.png";
import predictiveImg from "@/assets/predictive-analytics-ai.jpg";
import contentStrategyImg from "@/assets/content-strategy-flowchart.jpg";
import metaverseImg from "@/assets/metaverse-marketing.jpg";
import roiImg from "@/assets/marketing-roi-diagram.jpg";
import projectMgmtImg from "@/assets/project-management-dashboard.jpg";
import socialMediaImg from "@/assets/social-media-ecosystem.jpg";
import emailAutomationImg from "@/assets/email-automation-workflow.jpg";
import analyticsKpiImg from "@/assets/analytics-kpi-dashboard.jpg";
import omnichannelImg from "@/assets/omnichannel-strategy.jpg";
import ppcImg from "@/assets/ppc-campaign-structure.jpg";
import ecommerceImg from "@/assets/ecommerce-sales-funnel.jpg";
import seoVsAeoImg from "@/assets/seo-vs-aeo.png";
import aiDashboardImg from "@/assets/ai-marketing-dashboard.jpg";
import dataPrivacyImg from "@/assets/data-privacy-framework.jpg";
import influencerImg from "@/assets/influencer-marketing-tiers.jpg";
import videoMarketingImg from "@/assets/video-marketing-pipeline.jpg";
import automationPlatformImg from "@/assets/marketing-automation-platform.jpg";
import digitalChannelsImg from "@/assets/digital-channels-ecosystem.png";
import aiSmartRepliesImg from "@/assets/ai-smart-replies.png";
import aiCollaborationImg from "@/assets/ai-human-collaboration.jpg";
import aeoOptImg from "@/assets/aeo-optimization.jpg";

const getLessonImages = (lessonTitle: string, moduleTitle: string): string[] => {
  const title = (lessonTitle + " " + moduleTitle).toLowerCase();
  const images: string[] = [];

  if (title.includes("fundam") || title.includes("introducción") || title.includes("marketing digital")) images.push(funnelImg, digitalChannelsImg);
  if (title.includes("seo") || title.includes("posicion")) images.push(seoGrowthImg, seoVsAeoImg);
  if (title.includes("aeo") || title.includes("answer engine")) images.push(aeoOptImg, seoVsAeoImg);
  if (title.includes("geo") || title.includes("local")) images.push(geoTargetingImg);
  if (title.includes("brand") || title.includes("narrativ") || title.includes("identidad")) images.push(brandingImg);
  if (title.includes("predicti") || title.includes("automatiz")) images.push(predictiveImg, automationPlatformImg);
  if (title.includes("content") || title.includes("contenido")) images.push(contentStrategyImg);
  if (title.includes("metavers") || title.includes("xr") || title.includes("multicanal")) images.push(metaverseImg, omnichannelImg);
  if (title.includes("roi") || title.includes("monetiz")) images.push(roiImg, ecommerceImg);
  if (title.includes("proyecto") || title.includes("final")) images.push(projectMgmtImg);
  if (title.includes("social") || title.includes("redes")) images.push(socialMediaImg, influencerImg);
  if (title.includes("email")) images.push(emailAutomationImg);
  if (title.includes("analíti") || title.includes("métric") || title.includes("kpi")) images.push(analyticsKpiImg);
  if (title.includes("ppc") || title.includes("google ads")) images.push(ppcImg);
  if (title.includes("ia") || title.includes("inteligencia artificial") || title.includes("ai")) images.push(aiMarketingImg, aiDashboardImg, aiCollaborationImg);
  if (title.includes("soporte") || title.includes("chat") || title.includes("respuest")) images.push(aiSmartRepliesImg);
  if (title.includes("privacidad") || title.includes("seguridad") || title.includes("datos")) images.push(dataPrivacyImg);
  if (title.includes("video")) images.push(videoMarketingImg);
  if (title.includes("canal") || title.includes("estrategia")) images.push(omnichannelImg, digitalChannelsImg);

  if (images.length === 0) images.push(funnelImg, aiDashboardImg);
  return images.slice(0, 3);
};

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url?: string;
  audio_content?: string;
  order_index: number;
  duration_minutes: number;
}

interface LessonViewerProps {
  lesson: Lesson;
  moduleTitle: string;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isCompleted: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

const LessonViewer = ({
  lesson,
  moduleTitle,
  onComplete,
  onNext,
  onPrevious,
  isCompleted,
  hasNext,
  hasPrevious,
}: LessonViewerProps) => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeSpentRef = useRef(0);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (!user) return;
    timeSpentRef.current = 0;

    // Record lesson start
    const recordStart = async () => {
      await supabase.from("lesson_progress").upsert(
        { user_id: user.id, lesson_id: lesson.id, started_at: new Date().toISOString() },
        { onConflict: "user_id,lesson_id" }
      ).then(() => {});
    };
    recordStart();

    // Auto-save interval
    autoSaveRef.current = setInterval(async () => {
      timeSpentRef.current += 30;
      await supabase.from("lesson_progress").upsert(
        { user_id: user.id, lesson_id: lesson.id, time_spent_seconds: timeSpentRef.current },
        { onConflict: "user_id,lesson_id" }
      );
    }, 30000);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
      // Final save on unmount
      if (timeSpentRef.current > 0) {
        supabase.from("lesson_progress").upsert(
          { user_id: user.id, lesson_id: lesson.id, time_spent_seconds: timeSpentRef.current },
          { onConflict: "user_id,lesson_id" }
        );
      }
    };
  }, [user, lesson.id]);

  // TTS voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoiceReady(voices.length > 0);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    handleVoicesChanged();
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
  }, [lesson.id]);

  const speakContent = () => {
    if (!("speechSynthesis" in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const text = lesson.audio_content || lesson.content || "";
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.92;
    utterance.pitch = 1.08;

    const voices = window.speechSynthesis.getVoices();
    const femaleSpanishVoice =
      voices.find(
        (voice) =>
          voice.lang.startsWith("es") &&
          ["female", "paulina", "monica", "helena", "laura", "conchita", "lucia", "elvira", "sabina"].some((token) =>
            voice.name.toLowerCase().includes(token)
          )
      ) || voices.find((voice) => voice.lang.startsWith("es"));

    if (femaleSpanishVoice) utterance.voice = femaleSpanishVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };
    utterance.onboundary = (event) => {
      if (!text.length) return;
      setProgress(Math.min(100, (event.charIndex / text.length) * 100));
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const renderContent = () => {
    const content = lesson.content || "";
    const sections = content.split("\n\n").filter(Boolean);

    return sections.map((section, index) => {
      if (section.startsWith("##")) {
        return (
          <h3 key={index} className="text-xl font-display font-semibold text-foreground mt-6 mb-3">
            {section.replace(/^##\s*/, "")}
          </h3>
        );
      }
      if (section.includes("\n- ") || section.startsWith("- ")) {
        const items = section.split("\n- ").filter(Boolean);
        return (
          <ul key={index} className="space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>{item.replace(/^-\\s*/, "")}</span>
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-[15px]">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-card via-muted/40 to-card p-6 border-b border-border">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span className="uppercase tracking-[0.22em]">{moduleTitle}</span>
          </div>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs md:text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              Lección completada
            </span>
          )}
        </div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">{lesson.title}</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{lesson.duration_minutes} min</span>
          <span className="flex items-center gap-1"><FileText className="w-4 h-4" />Lección {lesson.order_index}</span>
        </div>
      </div>

      {/* Video */}
      {lesson.video_url && (
        <div className="aspect-video bg-muted relative">
          <iframe src={lesson.video_url} className="w-full h-full" loading="lazy" title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}

      {/* TTS Controls */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Button variant="outline" size="sm" onClick={speakContent} className="gap-2" disabled={!voiceReady}>
            {isPlaying ? <><Pause className="w-4 h-4" />Pausar</> : <><Play className="w-4 h-4" />Escuchar</>}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsMuted((p) => !p)} disabled={!voiceReady}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <div className="flex-1 min-w-[120px]"><Progress value={progress} className="h-1" /></div>
          <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="mb-6 rounded-xl border border-border bg-muted/20 px-4 py-3 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">Objetivo de la lección</p>
            <p className="text-sm text-muted-foreground">
              Al finalizar esta lección serás capaz de comprender y aplicar los conceptos clave para avanzar al siguiente nivel del módulo.
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">{renderContent()}</div>

        {/* Visual resources */}
        <div className="my-8 space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ImageIcon className="w-4 h-4 text-primary" />
            Material Visual Complementario
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getLessonImages(lesson.title, moduleTitle).map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border shadow-md">
                <img src={img} alt={`Recurso visual ${i + 1} - ${lesson.title}`} className="w-full h-48 object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <LessonComments lessonId={lesson.id} />
      </div>

      {/* Navigation */}
      <div className="p-4 md:p-6 bg-muted/30 border-t border-border flex items-center justify-between gap-3">
        <Button variant="outline" onClick={onPrevious} disabled={!hasPrevious} className="gap-2">
          <ChevronLeft className="w-4 h-4" />Anterior
        </Button>
        <div className="flex items-center gap-3">
          {!isCompleted && (
            <Button variant="elite" onClick={onComplete} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />Completar
            </Button>
          )}
        </div>
        <Button variant="outline" onClick={onNext} disabled={!hasNext} className="gap-2">
          Siguiente<ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default LessonViewer;
