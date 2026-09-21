import React, { useState } from "react";
import { Music, Volume2, VolumeX, Heart, Disc3, Sparkles } from "lucide-react";
import { startRomanticBGM, stopRomanticBGM } from "../utils/audio";

export const MusicPlayerBar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState<"birthday" | "canon">("birthday");

  const togglePlay = () => {
    if (isPlaying) {
      stopRomanticBGM();
      setIsPlaying(false);
    } else {
      startRomanticBGM(track);
      setIsPlaying(true);
    }
  };

  const changeTrack = (newTrack: "birthday" | "canon") => {
    setTrack(newTrack);
    if (isPlaying) {
      startRomanticBGM(newTrack);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 select-none">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-950/90 via-purple-950/90 to-black/90 border border-rose-500/40 backdrop-blur-xl shadow-2xl text-rose-100 font-sans-romantic">
        
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition transform active:scale-95"
          title={isPlaying ? "Mute Background Music" : "Play Romantic Music Box"}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-white/80" />
          )}
        </button>

        {/* Track info & visualizer */}
        <div className="flex flex-col pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-rose-200">
              {track === "birthday" ? "Birthday Music Box" : "Canon in D Serenade"}
            </span>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-rose-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-0.5 h-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                <span className="w-0.5 h-full bg-amber-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-rose-400/80">
            <button
              onClick={() => changeTrack("birthday")}
              className={`hover:underline ${track === "birthday" ? "text-amber-300 font-bold" : ""}`}
            >
              Melody 1
            </button>
            <span>•</span>
            <button
              onClick={() => changeTrack("canon")}
              className={`hover:underline ${track === "canon" ? "text-amber-300 font-bold" : ""}`}
            >
              Melody 2
            </button>
          </div>
        </div>

        {/* Pulsing heart */}
        <Heart className={`w-4 h-4 text-rose-500 fill-rose-500 ${isPlaying ? "animate-ping" : "opacity-40"}`} />
      </div>
    </div>
  );
};
