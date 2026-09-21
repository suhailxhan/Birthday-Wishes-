import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Heart,
  Sparkles,
  Gift,
  Mail,
  Camera,
  Settings,
  Flame,
  Volume2,
  Share2,
  Check,
} from "lucide-react";
import { AppSettings } from "./types";
import { ThreeBirthdayScene } from "./components/ThreeBirthdayScene";
import { CandleControl } from "./components/CandleControl";
import { HeroWish } from "./components/HeroWish";
import { ReasonsWhyILoveYou } from "./components/ReasonsWhyILoveYou";
import { MemoryGallery } from "./components/MemoryGallery";
import { LoveLetterModal } from "./components/LoveLetterModal";
import { GiftBoxModal } from "./components/GiftBoxModal";
import { CustomizeModal } from "./components/CustomizeModal";
import { FireworksCanvas } from "./components/FireworksCanvas";
import { MusicPlayerBar } from "./components/MusicPlayerBar";
import { FloatingHeartsBackground } from "./components/FloatingHeartsBackground";
import {
  playCandleBlowSound,
  playCelebrationFanfare,
  playSparkleChime,
  startRomanticBGM,
} from "./utils/audio";

const DEFAULT_SETTINGS: AppSettings = {
  girlfriendName: "Ashika",
  nickname: "Ashu",
  boyfriendName: "Junaid",
  anniversaryDate: "2023-02-14",
  birthDate: "2000-09-21",
  mainWish:
    "To my sweetest Ashika: You brought sunshine to my world, poetry to my soul, and infinite joy to every single day. Happy Birthday to the love of my life!",
  secretGiftMessage:
    "Ashika, no gift in the universe could ever measure up to you. But I promise to cherish, protect, and love you more and more with every breath I take. Forever yours, Junaid.",
};

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("birthday_app_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !parsed.girlfriendName ||
          parsed.girlfriendName === "My Princess" ||
          parsed.girlfriendName === "Sophia"
        ) {
          parsed.girlfriendName = "Ashika";
        }
        if (
          !parsed.boyfriendName ||
          parsed.boyfriendName === "Forever Yours" ||
          parsed.boyfriendName === "Your Boyfriend"
        ) {
          parsed.boyfriendName = "Junaid";
        }
        return parsed;
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isCandleLit, setIsCandleLit] = useState(true);
  const [wishesCount, setWishesCount] = useState(0);

  // Modals
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isFireworksActive, setIsFireworksActive] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [heartDensity, setHeartDensity] = useState<"low" | "medium" | "high">("medium");
  const [showGlitterStars, setShowGlitterStars] = useState(true);

  // Save settings when changed
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem("birthday_app_settings", JSON.stringify(newSettings));
  };

  const handleBlowCandle = () => {
    if (!isCandleLit) return;
    setIsCandleLit(false);
    setWishesCount((prev) => prev + 1);

    // Play sounds
    playCandleBlowSound();
    setTimeout(() => {
      playCelebrationFanfare();
      setIsFireworksActive(true);
    }, 400);

    // Multi-color celebratory confetti explosion
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.65 },
      colors: ["#f43f5e", "#fb7185", "#f59e0b", "#a855f7", "#ffffff"],
    });
  };

  const handleRelightCandle = () => {
    setIsCandleLit(true);
    playSparkleChime();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Happy Birthday, ${settings.girlfriendName}!`,
          text: `A romantic 3D birthday celebration handcrafted with love for ${settings.girlfriendName}.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2200);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0c0814] text-rose-50 overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Ambient background glow & stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-900/15 blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-purple-900/15 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-pink-950/20 blur-[160px]" />
      </div>

      {/* Floating Romantic Heart Particles & Glittering Stars drift upward */}
      <FloatingHeartsBackground
        density={heartDensity}
        interactive={true}
        enableGlitterStars={showGlitterStars}
      />

      {/* Top Floating Glass Navigation */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0c0814]/75 border-b border-white/5 py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
            </span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm sm:text-base text-white tracking-wide leading-tight">
                Forever {settings.girlfriendName}
              </span>
              <span className="text-[10px] text-rose-300/70 font-sans tracking-wide leading-none">
                Developed with ❤️ by {settings.boyfriendName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-sans-romantic">
            <button
              onClick={() => {
                const el = document.getElementById("cake-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden sm:flex items-center gap-1 text-rose-200/80 hover:text-white transition px-2 py-1"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Cake</span>
            </button>

            <button
              onClick={() => setIsLetterOpen(true)}
              className="flex items-center gap-1.5 text-rose-200/90 hover:text-white transition px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-rose-500/30"
            >
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xs:inline">Love Letter</span>
            </button>

            <button
              onClick={() => setIsGiftOpen(true)}
              className="flex items-center gap-1.5 text-rose-200/90 hover:text-white transition px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-rose-500/30"
            >
              <Gift className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden xs:inline">Surprise Gift</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-rose-300 transition"
              title="Share or Copy Link"
            >
              {isLinkCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Toggle Glittering Stars */}
            <button
              onClick={() => setShowGlitterStars((prev) => !prev)}
              className={`p-2 rounded-full border transition flex items-center gap-1 ${
                showGlitterStars
                  ? "bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-rose-300/40"
              }`}
              title={`Glittering Stars: ${showGlitterStars ? "ON" : "OFF"} (Click to toggle)`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 ${
                  showGlitterStars
                    ? "text-amber-300 fill-amber-300/40 animate-pulse"
                    : "text-rose-300/40"
                }`}
              />
              <span className="hidden lg:inline text-[10px] uppercase font-mono tracking-wider">
                {showGlitterStars ? "Stars ON" : "Stars OFF"}
              </span>
            </button>

            {/* Hearts Density */}
            <button
              onClick={() => {
                setHeartDensity((prev) =>
                  prev === "low" ? "medium" : prev === "medium" ? "high" : "low"
                );
              }}
              className="p-2 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 text-rose-300 transition flex items-center gap-1"
              title={`Floating Hearts: ${heartDensity.toUpperCase()} density (Click to cycle)`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/60" />
              <span className="hidden md:inline text-[10px] uppercase font-mono tracking-wider text-rose-300/80">
                {heartDensity}
              </span>
            </button>

            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="p-2 rounded-full bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 transition"
              title="Personalize names & dates"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <HeroWish
          settings={settings}
          onOpenLetter={() => setIsLetterOpen(true)}
          onOpenGift={() => setIsGiftOpen(true)}
          onOpenCustomize={() => setIsCustomizeOpen(true)}
          showGlitterStars={showGlitterStars}
          onToggleGlitterStars={() => setShowGlitterStars((prev) => !prev)}
          onTriggerFireworks={() => {
            setIsFireworksActive(true);
            playCelebrationFanfare();
          }}
        />

        {/* Central 3D Interactive Stage */}
        <section
          id="cake-section"
          className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center"
        >
          <div className="w-full aspect-square max-w-[620px] max-h-[580px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#140b20]/70 via-[#190d29]/80 to-[#0c0814]/90 border border-rose-500/20 shadow-2xl relative">
            <ThreeBirthdayScene
              isLit={isCandleLit}
              onBlowCandle={handleBlowCandle}
              onOpenGift={() => setIsGiftOpen(true)}
              girlfriendName={settings.girlfriendName}
            />
          </div>

          {/* Candle Blow Controls with Mic Sensor */}
          <div className="w-full mt-5">
            <CandleControl
              isLit={isCandleLit}
              onBlowCandle={handleBlowCandle}
              onRelightCandle={handleRelightCandle}
              wishesCount={wishesCount}
            />
          </div>
        </section>

        {/* 3D Reasons Why I Love You Cards */}
        <ReasonsWhyILoveYou girlfriendName={settings.girlfriendName} />

        {/* Polaroid Memory Scrapbook */}
        <MemoryGallery girlfriendName={settings.girlfriendName} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-12 px-4 border-t border-white/5 text-center font-sans-romantic text-xs text-rose-300/60 bg-[#08050e]">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span className="font-script text-xl text-rose-200">
              Happy Birthday, {settings.girlfriendName}
            </span>
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <p className="font-serif italic text-stone-400 text-sm">
            "In every lifetime, in every universe, I would always find you and choose you."
          </p>
          <div className="pt-2 border-t border-white/5 space-y-1">
            <p className="text-xs text-rose-300 font-medium">
              Handcrafted with all my heart for Ashika
            </p>
            <p className="text-[11px] text-stone-500">
              Designed & Developed with love by Junaid
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Ambient Music Player */}
      <MusicPlayerBar />

      {/* Celebratory Fireworks & Heart Canvas Overlay */}
      <FireworksCanvas
        isActive={isFireworksActive}
        onDone={() => setIsFireworksActive(false)}
        girlfriendName={settings.girlfriendName}
      />

      {/* Modals */}
      <LoveLetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        settings={settings}
        onUpdateLetter={(letter) => {
          handleSaveSettings({
            ...settings,
            mainWish: letter.slice(0, 140) + "...",
          });
        }}
      />

      <GiftBoxModal
        isOpen={isGiftOpen}
        onClose={() => setIsGiftOpen(false)}
        settings={settings}
      />

      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
