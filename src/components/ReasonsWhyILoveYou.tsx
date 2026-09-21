import React, { useState } from "react";
import { Heart, Sparkles, Shuffle, Plus, Star, Smile, Flame, Moon, Sun, Award } from "lucide-react";
import { motion } from "motion/react";
import { LoveReason } from "../types";
import { playSparkleChime } from "../utils/audio";

interface ReasonsWhyILoveYouProps {
  girlfriendName: string;
}

const INITIAL_REASONS: LoveReason[] = [
  {
    id: "1",
    number: 1,
    title: "The Way Your Eyes Light Up",
    description: "Every time you talk about something you're passionate about, your eyes sparkle like an entire constellation.",
    iconName: "sparkles",
    category: "smile",
  },
  {
    id: "2",
    number: 2,
    title: "Your Warm, Healing Hugs",
    description: "Whenever you wrap your arms around me, all the noise and stress of the outside world melts into pure peace.",
    iconName: "heart",
    category: "heart",
  },
  {
    id: "3",
    number: 3,
    title: "How You Make Ordinary Magic",
    description: "Grocery shopping, quiet car rides, or watching rain through the window—everything becomes unforgettable when I'm with you.",
    iconName: "magic",
    category: "magic",
  },
  {
    id: "4",
    number: 4,
    title: "Your Unconditional Kindness",
    description: "The gentle compassion you show to animals, children, and strangers reminds me constantly of what an angel you are.",
    iconName: "soul",
    category: "soul",
  },
  {
    id: "5",
    number: 5,
    title: "Our Late-Night Conversations",
    description: "Talking with you until 2 AM about our deepest dreams, childhood memories, and inside jokes that nobody else understands.",
    iconName: "moon",
    category: "magic",
  },
  {
    id: "6",
    number: 6,
    title: "The Sound of Your Laughter",
    description: "That genuine, crinkly-eyed giggle you make when something is truly funny is the single sweetest sound in the universe.",
    iconName: "smile",
    category: "smile",
  },
  {
    id: "7",
    number: 7,
    title: "Growing Old With You",
    description: "Knowing that no matter what twists life takes, you are the person I want by my side in every chapter and every adventure.",
    iconName: "future",
    category: "future",
  },
  {
    id: "8",
    number: 8,
    title: "Your Unmatched Beauty",
    description: "Whether you are all dressed up for a date or wearing an oversized hoodie with messy hair, you take my breath away every time.",
    iconName: "heart",
    category: "heart",
  },
];

export const ReasonsWhyILoveYou: React.FC<ReasonsWhyILoveYouProps> = ({
  girlfriendName,
}) => {
  const [reasons, setReasons] = useState<LoveReason[]>(INITIAL_REASONS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // New reason state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    playSparkleChime();
  };

  const handlePickRandom = () => {
    const randomItem = reasons[Math.floor(Math.random() * reasons.length)];
    setHighlightedId(randomItem.id);
    setFlippedCards((prev) => ({
      ...prev,
      [randomItem.id]: true,
    }));
    playSparkleChime();

    // Scroll to card
    const element = document.getElementById(`reason-card-${randomItem.id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newReason: LoveReason = {
      id: Date.now().toString(),
      number: reasons.length + 1,
      title: newTitle.trim(),
      description: newDesc.trim(),
      iconName: "heart",
      category: "heart",
    };

    setReasons((prev) => [...prev, newReason]);
    setNewTitle("");
    setNewDesc("");
    setIsAdding(false);
    playSparkleChime();
  };

  const filteredReasons = reasons.filter((r) =>
    activeCategory === "all" ? true : r.category === activeCategory
  );

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12 z-10 relative">
      {/* Section Title */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>The Love Vault</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Reasons Why I Love You,{" "}
          <span className="font-script text-4xl sm:text-5xl text-rose-400">
            {girlfriendName}
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-rose-200/80 max-w-xl mx-auto font-sans-romantic">
          Tap on any 3D card to uncover another secret reason why you hold the key to my soul.
        </p>
      </div>

      {/* Control Bar: Categories + Random Shuffle + Add Reason */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-sans-romantic">
          {[
            { id: "all", label: "All Reasons" },
            { id: "smile", label: "✨ Smile & Charm" },
            { id: "heart", label: "💖 Heart & Soul" },
            { id: "magic", label: "🌙 Our Magic" },
            { id: "future", label: "🌟 Future" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full transition ${
                activeCategory === cat.id
                  ? "bg-rose-600 text-white font-semibold shadow"
                  : "bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePickRandom}
            className="px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Draw Random</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 rounded-full bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reason</span>
          </button>
        </div>
      </div>

      {/* Form to add custom reason */}
      {isAdding && (
        <form
          onSubmit={handleAddReason}
          className="mb-8 p-5 bg-gradient-to-r from-rose-950/70 to-purple-950/70 rounded-2xl border border-rose-500/40 shadow-xl backdrop-blur-md space-y-3 font-sans-romantic animate-fadeIn"
        >
          <h4 className="text-sm font-semibold text-rose-200">Add a New Love Reason:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Reason title (e.g. Your cute nose scrunch)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-stone-400 focus:outline-none focus:border-rose-400"
              required
            />
            <input
              type="text"
              placeholder="Description (What makes it so special to you?)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-stone-400 focus:outline-none focus:border-rose-400"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Save Reason
            </button>
          </div>
        </form>
      )}

      {/* 3D Flipping Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredReasons.map((reason, index) => {
          const isFlipped = !!flippedCards[reason.id];
          const isHighlighted = highlightedId === reason.id;

          return (
            <motion.div
              key={reason.id}
              id={`reason-card-${reason.id}`}
              onClick={() => toggleFlip(reason.id)}
              className="group h-56 perspective-1000 cursor-pointer select-none"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: (index % 4) * 0.08,
              }}
            >
              <div
                className={`relative w-full h-full preserve-3d transition-transform duration-700 rounded-2xl ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                } ${isHighlighted ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-black" : ""}`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1a0f24] via-[#24132e] to-[#12081c] border border-rose-500/25 group-hover:border-rose-400/60 rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-purple-950/40 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center">
                      #{reason.number}
                    </span>
                    <Heart className="w-4 h-4 text-rose-400/80 fill-rose-500/20 group-hover:scale-110 transition" />
                  </div>

                  <div className="text-center my-auto">
                    <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300 mb-3 group-hover:scale-110 transition">
                      <Sparkles className="w-6 h-6 text-rose-400" />
                    </div>
                    <h3 className="font-display font-semibold text-base text-white leading-snug group-hover:text-rose-200 transition">
                      {reason.title}
                    </h3>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-rose-400/80 uppercase tracking-widest font-sans-romantic font-semibold">
                      Click to Reveal ↺
                    </span>
                  </div>
                </div>

                {/* Back Side (180 deg) */}
                <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-rose-950/90 via-pink-950/90 to-purple-950/90 border border-rose-400/50 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      Reason #{reason.number}
                    </span>
                    <span className="text-xs">💖</span>
                  </div>

                  <div className="my-auto">
                    <p className="font-serif italic text-sm text-rose-100 leading-relaxed text-center">
                      "{reason.description}"
                    </p>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-rose-300/70 font-sans-romantic">
                      Tap to flip back
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
