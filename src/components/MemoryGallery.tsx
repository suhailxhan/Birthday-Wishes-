import React, { useState } from "react";
import { Camera, Plus, X, Heart, Calendar, Image as ImageIcon } from "lucide-react";
import { MemoryPhoto } from "../types";
import { playSparkleChime } from "../utils/audio";

interface MemoryGalleryProps {
  girlfriendName: string;
}

const INITIAL_MEMORIES: MemoryPhoto[] = [
  {
    id: "m1",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    title: "Our Golden Sunset Stroll",
    date: "Golden Hour Memories",
    caption: "Holding your warm hand while the whole sky blushed pink, just like you when I told you I loved you.",
  },
  {
    id: "m2",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    title: "Unstoppable Laughter",
    date: "A Day Full of Smiles",
    caption: "We laughed until our stomachs ached. Moments like this are when I realize how lucky I truly am.",
  },
  {
    id: "m3",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    title: "Sweet Coffee Dates",
    date: "Our Quiet Mornings",
    caption: "Watching you sip your warm cappuccino with that cute sleepy smile. My favorite morning view forever.",
  },
  {
    id: "m4",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    title: "Dancing Under The Stars",
    date: "Midnight Magic",
    caption: "No music in the world was needed; your heartbeat was the only rhythm I wanted to dance to.",
  },
];

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  girlfriendName,
}) => {
  const [memories, setMemories] = useState<MemoryPhoto[]>(INITIAL_MEMORIES);
  const [activePhoto, setActivePhoto] = useState<MemoryPhoto | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New memory inputs
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newMem: MemoryPhoto = {
      id: Date.now().toString(),
      title: newTitle,
      caption: newCaption || "A precious moment with my love.",
      date: newDate || "Cherished Day",
      url: newUrl,
    };

    setMemories((prev) => [newMem, ...prev]);
    setIsAdding(false);
    setNewTitle("");
    setNewCaption("");
    setNewDate("");
    setNewUrl("");
    playSparkleChime();
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12 z-10 relative">
      {/* Section Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium">
          <Camera className="w-3.5 h-3.5 text-rose-400" />
          <span>Our Love Scrapbook</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Captured Memories with{" "}
          <span className="font-script text-4xl sm:text-5xl text-rose-400">
            {girlfriendName}
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-rose-200/80 max-w-xl mx-auto font-sans-romantic">
          Every photo is a timeless bookmark in our love story. Tap any polaroid to reminisce.
        </p>
      </div>

      {/* Add Memory Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-medium flex items-center gap-2 shadow-lg hover:shadow-pink-500/25 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Memory / Upload Photo</span>
        </button>
      </div>

      {/* Add Memory Modal/Form */}
      {isAdding && (
        <form
          onSubmit={handleAddMemory}
          className="mb-8 p-6 bg-[#1a0f24]/90 border border-rose-500/40 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4 font-sans-romantic"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-rose-200">Add a New Sweet Memory</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-300 mb-1">Memory Title</label>
              <input
                type="text"
                placeholder="e.g. Our First Trip to the Beach"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-stone-400 focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-300 mb-1">Date / Occasion</label>
              <input
                type="text"
                placeholder="e.g. Summer 2024"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-stone-400 focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-300 mb-1">Love Note / Caption</label>
            <textarea
              rows={3}
              placeholder="What makes this memory with her unforgettable?"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-stone-400 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-300 mb-1">Upload Photo</label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-rose-400/50 bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 text-xs flex items-center gap-2 transition w-full sm:w-auto justify-center">
                <ImageIcon className="w-4 h-4" />
                <span>Select from device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-stone-400">or paste image link:</span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex-1 w-full"
              />
            </div>
            {newUrl && (
              <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-rose-400">
                <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newUrl || !newTitle}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-40"
            >
              Pin to Scrapbook
            </button>
          </div>
        </form>
      )}

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {memories.map((mem, idx) => {
          // Subtle natural polaroid tilt
          const rotations = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-3"];
          const rotClass = rotations[idx % rotations.length];

          return (
            <div
              key={mem.id}
              onClick={() => {
                setActivePhoto(mem);
                playSparkleChime();
              }}
              className={`group bg-stone-100 p-3 pb-5 rounded-lg shadow-xl shadow-black/50 cursor-pointer transform ${rotClass} hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 border border-stone-300`}
            >
              {/* Photo */}
              <div className="w-full aspect-[4/3] rounded overflow-hidden bg-stone-900 relative">
                <img
                  src={mem.url}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[11px] text-white font-sans-romantic flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> Tap to view note
                  </span>
                </div>
              </div>

              {/* Handwritten style caption on Polaroid rim */}
              <div className="mt-3 px-1 text-center">
                <h4 className="font-script text-xl text-stone-800 font-bold leading-tight truncate">
                  {mem.title}
                </h4>
                <p className="text-[10px] text-stone-500 font-sans-romantic tracking-wider uppercase mt-0.5">
                  {mem.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Photo & Caption Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#fffbf2] p-5 sm:p-6 rounded-3xl shadow-2xl border-4 border-[#e6d5ba] text-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-inner mb-4">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-center space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-rose-600 font-bold font-sans-romantic">
                {activePhoto.date}
              </span>
              <h3 className="font-display text-2xl font-bold text-stone-900">
                {activePhoto.title}
              </h3>
              <p className="font-serif italic text-base text-stone-700 leading-relaxed max-w-md mx-auto">
                "{activePhoto.caption}"
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setActivePhoto(null)}
                className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow"
              >
                Close Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
