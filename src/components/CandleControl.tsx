import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Wind, Flame, Mic, MicOff, HeartHandshake } from "lucide-react";

interface CandleControlProps {
  isLit: boolean;
  onBlowCandle: () => void;
  onRelightCandle: () => void;
  wishesCount: number;
}

export const CandleControl: React.FC<CandleControlProps> = ({
  isLit,
  onBlowCandle,
  onRelightCandle,
  wishesCount,
}) => {
  const [micActive, setMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startMicBlowDetection = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let blowAccumulator = 0;

      const checkBlow = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Low frequency noise corresponds to blowing directly on the mic
        let lowFreqSum = 0;
        const lowBins = 16;
        for (let i = 0; i < lowBins; i++) {
          lowFreqSum += dataArray[i];
        }
        const avg = lowFreqSum / lowBins;
        const levelPercent = Math.min(100, Math.round((avg / 140) * 100));
        setMicLevel(levelPercent);

        if (levelPercent > 55) {
          blowAccumulator += 20;
          if (blowAccumulator >= 80) {
            onBlowCandle();
            stopMic();
            return;
          }
        } else {
          blowAccumulator = Math.max(0, blowAccumulator - 5);
        }

        animFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err: any) {
      console.warn("Microphone access failed or denied:", err);
      setMicError("Microphone access denied or unavailable. Tap the button instead!");
      setMicActive(false);
    }
  };

  const stopMic = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setMicActive(false);
    setMicLevel(0);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full max-w-md mx-auto px-4 py-3 bg-gradient-to-b from-rose-950/40 via-purple-950/40 to-black/60 backdrop-blur-xl border border-rose-500/20 rounded-2xl shadow-2xl">
      {/* Candle Status text */}
      <div className="text-center">
        {isLit ? (
          <p className="text-sm font-sans-romantic text-rose-200 flex items-center justify-center gap-1.5 font-medium">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            Make a secret birthday wish and blow out the candle!
          </p>
        ) : (
          <p className="text-sm font-sans-romantic text-emerald-300 flex items-center justify-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Your wish has been cast into the stars! Happy Birthday!
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {isLit ? (
          <>
            <button
              id="blow-candle-btn"
              onClick={onBlowCandle}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full font-medium text-sm shadow-lg shadow-rose-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Wind className="w-4 h-4" />
              <span>Blow Candle</span>
            </button>

            <button
              id="mic-blow-toggle-btn"
              onClick={micActive ? stopMic : startMicBlowDetection}
              className={`px-4 py-2.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                micActive
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse"
                  : "bg-rose-950/60 text-rose-200 border-rose-500/30 hover:bg-rose-900/60"
              }`}
              title="Blow air into your phone or laptop microphone!"
            >
              {micActive ? <Mic className="w-3.5 h-3.5 text-amber-400" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{micActive ? "Listening for Blow..." : "Use Mic to Blow"}</span>
            </button>
          </>
        ) : (
          <button
            id="relight-candle-btn"
            onClick={onRelightCandle}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-semibold text-sm rounded-full shadow-lg shadow-amber-500/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Flame className="w-4 h-4" />
            <span>Light Candle Again</span>
          </button>
        )}
      </div>

      {/* Mic sound level bar if active */}
      {micActive && (
        <div className="w-full flex flex-col items-center gap-1 mt-1">
          <div className="w-48 h-2 bg-rose-950/80 rounded-full overflow-hidden border border-rose-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-75"
              style={{ width: `${micLevel}%` }}
            />
          </div>
          <span className="text-[11px] text-amber-200/80">
            Blow strongly into your mic: {micLevel}%
          </span>
        </div>
      )}

      {micError && (
        <p className="text-[11px] text-rose-300 text-center">{micError}</p>
      )}

      {wishesCount > 0 && (
        <div className="text-[11px] text-rose-300/80 flex items-center gap-1">
          <HeartHandshake className="w-3 h-3 text-rose-400" />
          <span>Wishes made today: {wishesCount}</span>
        </div>
      )}
    </div>
  );
};
