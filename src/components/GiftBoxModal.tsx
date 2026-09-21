import React, { useState } from "react";
import { X, Gift, Sparkles, Heart, Crown, Award, Smile } from "lucide-react";
import confetti from "canvas-confetti";
import { AppSettings } from "../types";
import { playCelebrationFanfare } from "../utils/audio";

interface GiftBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

export const GiftBoxModal: React.FC<GiftBoxModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);

  if (!isOpen) return null;

  const coupons = [
    {
      id: 1,
      title: "Romantic Candlelight Dinner",
      desc: "Valid anytime for your favorite cuisine cooked or booked by me!",
      icon: "🍝",
    },
    {
      id: 2,
      title: "Unlimited Hugs & Back Rubs",
      desc: "Instant redemption for unlimited warm cuddles and forehead kisses.",
      icon: "🤗",
    },
    {
      id: 3,
      title: "Spontaneous Weekend Getaway",
      desc: "Pack your bags, my queen! We are heading wherever you point on the map.",
      icon: "✈️",
    },
    {
      id: 4,
      title: "Queen For A Day",
      desc: "Zero chores, breakfast in bed, foot massage, and you choose every movie!",
      icon: "👑",
    },
  ];

  const handleClaimReward = () => {
    playCelebrationFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f43f5e", "#ec4899", "#f59e0b", "#a855f7"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1c0d24] to-[#0a0412] text-white rounded-3xl shadow-2xl border border-rose-500/30 overflow-hidden my-8 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gift Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/30 animate-bounce">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">
            Your Birthday Gift Unwrapped!
          </h3>
          <p className="text-xs sm:text-sm text-rose-200/80 font-sans-romantic">
            Exclusively handcrafted with all my devotion for {settings.girlfriendName}
          </p>
        </div>

        {/* Secret Special Message Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/30 mb-6 shadow-inner text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center justify-center gap-1 mb-1">
            <Sparkles className="w-3 h-3" /> Special Note From {settings.boyfriendName || "Your Love"}
          </span>
          <p className="font-serif italic text-sm text-rose-100 leading-relaxed">
            "{settings.secretGiftMessage || "No box in the universe could ever hold all the love I have for you. But everything I have, everything I am, and all my tomorrows belong to you."}"
          </p>
        </div>

        {/* Romantic Birthday Coupons */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-300 mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-rose-400" />
            <span>Lifetime Love Coupons (Tap to redeem)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                onClick={() => {
                  setSelectedVoucher(coupon.id);
                  handleClaimReward();
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  selectedVoucher === coupon.id
                    ? "bg-rose-500/20 border-rose-400 scale-[1.02] shadow-lg shadow-rose-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-rose-500/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{coupon.icon}</span>
                  <h5 className="font-medium text-xs text-white">{coupon.title}</h5>
                </div>
                <p className="text-[11px] text-rose-200/70 leading-snug">{coupon.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Claim button */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleClaimReward}
            className="w-full py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl font-medium text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Claim 1,000,000 Kisses & Hugs!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
