import React, { useState } from "react";
import { X, Settings, Heart, Save, RotateCcw } from "lucide-react";
import { AppSettings } from "../types";
import { playSparkleChime } from "../utils/audio";

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    playSparkleChime();
    onClose();
  };

  const handleReset = () => {
    const defaults: AppSettings = {
      girlfriendName: "Ashika",
      nickname: "Ashu",
      boyfriendName: "Junaid",
      anniversaryDate: "2023-02-14",
      birthDate: "2000-09-21",
      mainWish: "To my beloved Ashika: You brought sunshine to my world, poetry to my words, and infinite joy to my heart. May your special day be as enchanting as you are.",
      secretGiftMessage: "Ashika, no gift in the universe could ever measure up to you. Everything I have, everything I am, and all my tomorrows belong to you. Forever yours, Junaid.",
    };
    setFormData(defaults);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#140b1e] text-white rounded-3xl shadow-2xl border border-rose-500/40 p-6 sm:p-8 my-8 font-sans-romantic">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Personalize Her Celebration
              </h3>
              <p className="text-xs text-rose-300/70">Tailor names, dates, and secret notes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-rose-200 mb-1 font-medium">Her Real Name</label>
              <input
                type="text"
                value={formData.girlfriendName}
                onChange={(e) => setFormData({ ...formData, girlfriendName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-rose-400"
                placeholder="Ashika"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-rose-200 mb-1 font-medium">Her Nickname / Pet Name</label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-rose-400"
                placeholder="e.g. Ashu / Angel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-rose-200 mb-1 font-medium">Developer & Boyfriend Name</label>
              <input
                type="text"
                value={formData.boyfriendName}
                onChange={(e) => setFormData({ ...formData, boyfriendName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-rose-400"
                placeholder="Junaid"
              />
            </div>

            <div>
              <label className="block text-xs text-rose-200 mb-1 font-medium">When You Fell In Love / Anniversary</label>
              <input
                type="date"
                value={formData.anniversaryDate}
                onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-rose-200 mb-1 font-medium">Hero Banner Birthday Wish</label>
            <textarea
              rows={2}
              value={formData.mainWish}
              onChange={(e) => setFormData({ ...formData, mainWish: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs text-rose-200 mb-1 font-medium">Secret Gift Box Message</label>
            <textarea
              rows={2}
              value={formData.secretGiftMessage}
              onChange={(e) => setFormData({ ...formData, secretGiftMessage: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-rose-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-stone-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
