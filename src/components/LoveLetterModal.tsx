import React, { useState } from "react";
import { X, Heart, Copy, Check } from "lucide-react";
import { AppSettings } from "../types";

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateLetter?: (letterText: string) => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const girlfriendName = settings.girlfriendName || "Ashika";
  const boyfriendName = settings.boyfriendName || "Junaid";

  const letterText =
    `My Dearest ${girlfriendName},\n\n` +
    `Today the universe became infinitely brighter, because on this day, the most breathtaking soul was born.\n\n` +
    `Every single moment beside you is a gift I hold close to my heart. Your laughter is my favorite melody, your eyes are my peace, and your gentle smile can turn any ordinary day into pure magic.\n\n` +
    `On your birthday, I want to promise you that I will always stand by your side—celebrating your brightest victories, comforting your quiet moments, and loving you more fiercely with every passing sunrise.\n\n` +
    `May this year bless you with all the warmth, joy, and beautiful dreams your heart has ever wished for.\n\n` +
    `Happy Birthday, my love. You mean the whole world to me.\n\n` +
    `Forever & always yours,\n` +
    `${boyfriendName} ❤️`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#fffbf2] text-stone-800 rounded-3xl shadow-2xl border-4 border-[#e6d5ba] overflow-hidden my-8">
        {/* Top vintage stamp & close button */}
        <div className="bg-[#f5ebd7] px-6 py-4 border-b border-[#e2cca4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-rose-700 text-white flex items-center justify-center font-bold text-xs shadow-inner">
              <Heart className="w-5 h-5 fill-white" />
            </span>
            <div>
              <h3 className="font-display font-bold text-base text-stone-900 tracking-wide">
                Special Delivery to {girlfriendName}
              </h3>
              <p className="text-[11px] text-stone-500 font-sans-romantic">
                From {boyfriendName} • Sealed with eternal love & adoration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-300 text-stone-600 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vintage Parchment Letter Body */}
        <div className="p-7 sm:p-10 max-h-[65vh] overflow-y-auto bg-[radial-gradient(#fbf4e4_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="space-y-4 font-serif leading-relaxed text-stone-800 text-base sm:text-lg font-normal selection:bg-rose-200">
            <p className="font-script text-2xl sm:text-3xl text-rose-800 font-bold">
              My Dearest {girlfriendName},
            </p>

            <p>
              Today the universe became infinitely brighter, because on this day, the most breathtaking soul was born.
            </p>

            <p>
              Every single moment beside you is a gift I hold close to my heart. Your laughter is my favorite melody, your eyes are my peace, and your gentle smile can turn any ordinary day into pure magic.
            </p>

            <p>
              On your birthday, I want to promise you that I will always stand by your side—celebrating your brightest victories, comforting your quiet moments, and loving you more fiercely with every passing sunrise.
            </p>

            <p>
              May this year bless you with all the warmth, joy, and beautiful dreams your heart has ever wished for.
            </p>

            <p className="text-rose-900 font-medium">
              Happy Birthday, my love. You mean the whole world to me.
            </p>

            <div className="pt-4 border-t border-[#e6d5ba]/60 flex flex-col items-end">
              <span className="text-sm italic text-stone-600">Forever & always yours,</span>
              <span className="font-script text-2xl sm:text-3xl text-rose-700 font-bold mt-1">
                {boyfriendName} ❤️
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-[#f5ebd7] px-6 py-4 border-t border-[#e2cca4] flex items-center justify-between text-xs font-sans-romantic">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition shadow-sm"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{isCopied ? "Copied with Love!" : "Copy Letter"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium shadow-md transition"
          >
            Close with a Kiss 💋
          </button>
        </div>
      </div>
    </div>
  );
};
