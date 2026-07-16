// Fully procedural sound design using the Web Audio API.
// Nothing here loads an external asset — piano, ambience and SFX are all
// synthesised at runtime, then routed through a soft algorithmic reverb.

type Maybe<T> = T | null;

const NOTES: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
};

// A tender, slow, loosely "Clair de Lune"-inspired original phrase.
// [note, beatOffset, duration(beats), velocity]
const MELODY: [string, number, number, number][] = [
  ["A4", 0, 1.5, 0.5], ["C5", 1.5, 1, 0.45], ["E5", 2.5, 1.5, 0.55],
  ["D5", 4, 1, 0.4], ["C5", 5, 1.5, 0.5], ["A4", 6.5, 1.5, 0.42],
  ["G4", 8, 1, 0.4], ["A4", 9, 2, 0.48], ["E5", 11, 1, 0.5],
  ["D5", 12, 1.5, 0.44], ["C5", 13.5, 2.5, 0.5],
];
// Left-hand rolling chords (arpeggios)
const BASS: [string, number, number, number][] = [
  ["A3", 0, 2, 0.3], ["E4", 0.5, 2, 0.22], ["A3", 4, 2, 0.3], ["E4", 4.5, 2, 0.22],
  ["F3", 8, 2, 0.3], ["C4", 8.5, 2, 0.22], ["G3", 12, 2, 0.3], ["D4", 12.5, 2, 0.24],
];
const BEAT = 0.62; // seconds per beat — slow and unhurried
const LOOP_BEATS = 16;

export class AudioEngine {
  private ctx: Maybe<AudioContext> = null;
  private master: Maybe<GainNode> = null;
  private musicBus: Maybe<GainNode> = null;
  private ambienceBus: Maybe<GainNode> = null;
  private reverb: Maybe<ConvolverNode> = null;
  private analyser: Maybe<AnalyserNode> = null;
  private musicTimer: Maybe<number> = null;
  private birdTimer: Maybe<number> = null;
  private windNode: Maybe<AudioBufferSourceNode> = null;
  private started = false;

  isRunning() {
    return this.ctx?.state === "running";
  }

  /** Must be called from a user gesture. Idempotent. */
  async init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return;
    }
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.connect(ctx.destination);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.82;
    this.master.connect(this.analyser);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.makeImpulse(3.2, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    this.reverb.connect(wet).connect(this.master);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0.0001;
    this.musicBus.connect(this.master);
    this.musicBus.connect(this.reverb);

    this.ambienceBus = ctx.createGain();
    this.ambienceBus.gain.value = 0.0001;
    this.ambienceBus.connect(this.master);
    this.ambienceBus.connect(this.reverb);

    await ctx.resume();
    this.fade(this.master.gain, 0.9, 1.5);
  }

  getAnalyser() {
    return this.analyser;
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] =
          (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  private fade(param: AudioParam, to: number, time: number) {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    param.cancelScheduledValues(now);
    param.setValueAtTime(Math.max(param.value, 0.0001), now);
    param.exponentialRampToValueAtTime(Math.max(to, 0.0001), now + time);
  }

  // ---- Piano voice (FM-ish additive with a soft hammer transient) ----
  private playNote(freq: number, at: number, dur: number, vel: number) {
    const ctx = this.ctx!;
    const bus = this.musicBus!;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2600;

    osc.type = "triangle";
    osc.frequency.value = freq;
    osc2.type = "sine";
    osc2.frequency.value = freq * 2.001; // gentle detune shimmer
    const g2 = ctx.createGain();
    g2.gain.value = 0.35;

    const peak = vel;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(peak * 0.5, at + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);

    osc.connect(gain);
    osc2.connect(g2).connect(gain);
    gain.connect(tone).connect(bus);

    osc.start(at);
    osc2.start(at);
    osc.stop(at + dur + 0.1);
    osc2.stop(at + dur + 0.1);
  }

  private scheduleLoop() {
    if (!this.ctx) return;
    const start = this.ctx.currentTime + 0.05;
    const play = (arr: typeof MELODY) =>
      arr.forEach(([n, off, d, v]) =>
        this.playNote(NOTES[n], start + off * BEAT, d * BEAT, v),
      );
    play(MELODY);
    play(BASS);
    this.musicTimer = window.setTimeout(
      () => this.scheduleLoop(),
      LOOP_BEATS * BEAT * 1000,
    );
  }

  startMusic() {
    if (!this.ctx || this.started) return;
    this.started = true;
    this.fade(this.musicBus!.gain, 0.55, 3.5);
    this.scheduleLoop();
  }

  stopMusic() {
    if (!this.ctx) return;
    this.started = false;
    this.fade(this.musicBus!.gain, 0.0001, 1.2);
    if (this.musicTimer) window.clearTimeout(this.musicTimer);
  }

  setMusicVolume(v: number) {
    if (this.musicBus) this.fade(this.musicBus.gain, v, 0.3);
  }

  // ---- Ambience: soft wind bed + occasional birdsong ----
  startAmbience() {
    if (!this.ctx || this.windNode) return;
    const ctx = this.ctx;
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02; // brown noise → warm wind
      data[i] = last * 3.2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 620;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(filt.frequency);
    src.connect(filt).connect(this.ambienceBus!);
    src.start();
    lfo.start();
    this.windNode = src;

    this.fade(this.ambienceBus!.gain, 0.4, 4);
    this.scheduleBird();
  }

  stopAmbience() {
    if (!this.ctx || !this.ambienceBus) return;
    this.fade(this.ambienceBus.gain, 0.0001, 3);
    if (this.birdTimer) window.clearTimeout(this.birdTimer);
  }

  private scheduleBird() {
    if (!this.ctx) return;
    const next = 3500 + Math.random() * 7000;
    this.birdTimer = window.setTimeout(() => {
      this.chirp();
      this.scheduleBird();
    }, next);
  }

  private chirp() {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const notes = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < notes; i++) {
      const t = now + i * (0.07 + Math.random() * 0.05);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const base = 1900 + Math.random() * 1400;
      osc.type = "sine";
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base * 1.5, t + 0.05);
      osc.frequency.exponentialRampToValueAtTime(base * 0.9, t + 0.12);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(g).connect(this.ambienceBus!);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  }

  private noiseBurst(dur: number, freq: number, q: number, vol: number, type: BiquadFilterType = "bandpass") {
    const ctx = this.ctx;
    if (!ctx) return;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.4);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = type;
    filt.frequency.value = freq;
    filt.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = vol;
    src.connect(filt).connect(g).connect(this.master!);
    g.connect(this.reverb!);
    src.start();
  }

  // ---- One-shot SFX ----
  paper() {
    this.noiseBurst(0.5, 1800, 0.7, 0.18, "highpass");
    window.setTimeout(() => this.noiseBurst(0.35, 1200, 0.9, 0.12, "highpass"), 140);
  }

  wax() {
    // dry click + short crack
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc.connect(g).connect(this.master!);
    osc.start(now);
    osc.stop(now + 0.12);
    this.noiseBurst(0.18, 900, 1.2, 0.22, "bandpass");
  }

  petal() {
    this.noiseBurst(0.3, 5200, 0.6, 0.05, "highpass");
  }

  chime() {
    const ctx = this.ctx;
    if (!ctx) return;
    [880, 1320, 1760].forEach((f, i) => {
      const t = ctx.currentTime + i * 0.06;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.connect(g).connect(this.master!);
      g.connect(this.reverb!);
      osc.start(t);
      osc.stop(t + 1);
    });
  }

  muteAll(muted: boolean) {
    if (this.master) this.fade(this.master.gain, muted ? 0.0001 : 0.9, 0.4);
  }

  dispose() {
    if (this.musicTimer) window.clearTimeout(this.musicTimer);
    if (this.birdTimer) window.clearTimeout(this.birdTimer);
    this.ctx?.close();
    this.ctx = null;
  }
}

// Shared singleton across the app.
let engine: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  if (!engine) engine = new AudioEngine();
  return engine;
}
