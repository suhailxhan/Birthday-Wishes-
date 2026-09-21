export interface MemoryPhoto {
  id: string;
  url: string;
  title: string;
  date: string;
  caption: string;
}

export interface LoveReason {
  id: string;
  number: number;
  title: string;
  description: string;
  iconName: string;
  category: "heart" | "smile" | "soul" | "future" | "magic";
}

export interface AppSettings {
  girlfriendName: string;
  nickname: string;
  boyfriendName: string;
  anniversaryDate: string; // YYYY-MM-DD
  birthDate: string; // YYYY-MM-DD
  mainWish: string;
  secretGiftMessage: string;
}

export interface CandleState {
  isLit: boolean;
  candlesBlownCount: number;
  blowProgress: number; // 0 to 100 for mic
}
