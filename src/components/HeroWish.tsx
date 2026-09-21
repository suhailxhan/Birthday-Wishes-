import React, { useState, useEffect } from "react";
import { Heart, Sparkles, Calendar, Clock, Crown, Edit3 } from "lucide-react";
import { AppSettings } from "../types";

interface HeroWishProps {
  settings: AppSettings;
  onOpenLetter: () => void;
  onOpenGift: () => void;
  onOpenCustomize: () => void;
  onTriggerFireworks: () => void;
  showGlitterStars?: boolean;
  onToggleGlitterStars?: () => void;
}

export const HeroWish: React.FC<HeroWishProps> = ({
  settings,
  onOpenLetter,
  onOpenGift,
  onOpenCustomize,
  onTriggerFireworks,
  showGlitterStars = true,
  onToggleGlitterStars,
}) => {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const anniversary = new Date(settings.anniversaryDate || "2023-01-01").getTime();
      const now = Date.now();
      const diff = Math.max(0, now - anniversary);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.anniversaryDate]);

  return (
    <header className="relative w-full max-w-5xl mx-auto pt-6 pb-4 px-4 text-center z-10">
      {/* Little crown & sweet nickname badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs tracking-wider uppercase backdrop-blur-md mb-4 shadow-lg shadow-rose-950/40">
        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span>To My Beloved {settings.nickname || "Princess"}</span>
        <button
          onClick={onOpenCustomize}
          className="ml-1 text-rose-400 hover:text-white p-0.5 rounded transition"
          title="Customize names & dates"
        >
          <Edit3 className="w-3 h-3" />
        </button>
      </div>

      {/* Main Grand Romantic Typography */}
      <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-2 leading-tight">
        Happy Birthday,{" "}
        <span className="font-script text-5xl sm:text-7xl md:text-8xl bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent drop-shadow-lg inline-block hover:scale-105 transition-transform duration-300">
          {settings.girlfriendName || "My Love"}
        </span>
      </h1>

      {/* Poetic Subheading */}
      <p className="font-serif italic text-rose-200/90 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-6 font-light">
        "{settings.mainWish || "You brought sunshine to my life, poetry to my words, and infinite joy to my heart. May your special day be as enchanting as you are."}"
      </p>

      {/* Love Clock: Counting Every Second In Love */}
      <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-rose-950/50 border border-rose-500/20 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl mb-6">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-medium mr-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>In love with you for:</span>
        </div>
        <div className="flex items-center gap-3 font-sans-romantic">
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">{timeElapsed.days}</span>
            <span className="text-[10px] text-rose-300/70 uppercase">Days</span>
          </div>
          <span className="text-rose-500 font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">{timeElapsed.hours}</span>
            <span className="text-[10px] text-rose-300/70 uppercase">Hours</span>
          </div>
          <span className="text-rose-500 font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">{timeElapsed.minutes}</span>
            <span className="text-[10px] text-rose-300/70 uppercase">Mins</span>
          </div>
          <span className="text-rose-500 font-bold">:</span>
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-xl font-bold text-amber-300 tracking-tight">{timeElapsed.seconds}</span>
            <span className="text-[10px] text-rose-300/70 uppercase">Secs</span>
          </div>
        </div>
      </div>

      {/* Action Quick Ribbons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onOpenLetter}
          className="px-5 py-2.5 rounded-full bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-400/40 text-xs sm:text-sm font-medium backdrop-blur-md flex items-center gap-2 shadow-lg hover:shadow-rose-500/25 transition-all duration-200"
        >
          <span>💌 Read My Love Letter</span>
        </button>

        <button
          onClick={onOpenGift}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-700 hover:to-rose-700 text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-lg shadow-fuchsia-600/30 transition-all duration-200 hover:scale-105"
        >
          <span>🎁 Open Birthday Gift</span>
        </button>

        <button
          onClick={onTriggerFireworks}
          className="px-5 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs sm:text-sm font-medium backdrop-blur-md flex items-center gap-2 transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch Fireworks</span>
        </button>

        {onToggleGlitterStars && (
          <button
            onClick={onToggleGlitterStars}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-md flex items-center gap-2 transition-all duration-200 border ${
              showGlitterStars
                ? "bg-amber-400/15 hover:bg-amber-400/25 text-amber-200 border-amber-300/40 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
                : "bg-white/5 hover:bg-white/10 text-rose-200/50 border-white/10"
            }`}
            title="Toggle glittering star particles in the sky"
          >
            <Sparkles className={`w-3.5 h-3.5 ${showGlitterStars ? "text-amber-300 fill-amber-300/40 animate-pulse" : "text-white/30"}`} />
            <span>{showGlitterStars ? "✨ Glittering Stars: ON" : "✨ Glittering Stars: OFF"}</span>
          </button>
        )}
      </div>
    </header>
  );
};
