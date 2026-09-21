// Web Audio API procedural sound synthesizer for zero-dependency romantic audio

let audioCtx: AudioContext | null = null;
let isPlayingMelody = false;
let melodyTimeout: any = null;
let currentTrackIndex = 0;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Romantic frequency map
const NOTES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

// Happy Birthday Romantic Music Box sequence: [note, duration in beats]
const BIRTHDAY_MELODY: [string, number][] = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1.5],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2.5]
];

// Romantic Love Serenade sequence: Canon in D dreamy music box
const CANON_MELODY: [string, number][] = [
  ['D5', 1], ['A4', 1], ['B4', 1], ['F4', 1], ['G4', 1], ['D4', 1], ['G4', 1], ['A4', 1],
  ['F5', 1], ['E5', 1], ['D5', 1], ['C5', 1], ['B4', 1], ['A4', 1], ['B4', 1], ['C5', 1],
  ['D5', 1.5], ['C5', 0.5], ['B4', 1], ['A4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['A4', 2]
];

export function playMusicBoxNote(freq: number, duration: number = 1.2, volume: number = 0.15) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Warm bell/music-box sine with gentle triangle harmonic
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  } catch (e) {
    console.error("Audio error:", e);
  }
}

export function playSparkleChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const chimeFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5 E5 G5 C6 E6
    
    chimeFreqs.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      }, idx * 80);
    });
  } catch (e) {
    console.error(e);
  }
}

export function playCandleBlowSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Noise buffer for realistic blowing wind/breath
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.8);
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.8);
  } catch (e) {
    console.error(e);
  }
}

export function playCelebrationFanfare() {
  playSparkleChime();
  setTimeout(() => {
    try {
      const ctx = getAudioContext();
      const chord = [261.63, 329.63, 392.0, 523.25]; // C major
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.1);
      });
    } catch (e) {}
  }, 250);
}

export function startRomanticBGM(track: 'birthday' | 'canon' = 'birthday', onTrackEnd?: () => void) {
  stopRomanticBGM();
  isPlayingMelody = true;
  const sequence = track === 'birthday' ? BIRTHDAY_MELODY : CANON_MELODY;
  let noteIndex = 0;
  const tempoMs = 520; // gentle slow music box pace

  function playNext() {
    if (!isPlayingMelody) return;
    if (noteIndex >= sequence.length) {
      noteIndex = 0; // loop
      melodyTimeout = setTimeout(playNext, 1200);
      return;
    }

    const [note, beats] = sequence[noteIndex];
    const freq = NOTES[note] || 440;
    playMusicBoxNote(freq, beats * (tempoMs / 1000) * 1.5, 0.12);

    noteIndex++;
    melodyTimeout = setTimeout(playNext, beats * tempoMs);
  }

  playNext();
}

export function stopRomanticBGM() {
  isPlayingMelody = false;
  if (melodyTimeout) {
    clearTimeout(melodyTimeout);
    melodyTimeout = null;
  }
}

export function isBGMActive() {
  return isPlayingMelody;
}
