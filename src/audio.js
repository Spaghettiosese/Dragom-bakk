// Tiny WebAudio synth for punches, ki, beams, explosions.
let ctx, master, noiseBuf;
export function initAudio() {
  if (ctx) return; ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}
function env(g, t, a, peak, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
function noise(dur, freq, q, peak, type = 'lowpass') {
  const t = ctx.currentTime, s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); env(g, t, 0.005, peak, dur); s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + dur + 0.05); return f;
}
function tone(type, f0, f1, dur, peak) {
  const t = ctx.currentTime, o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain(); env(g, t, 0.01, peak, dur); o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
}
export const sfx = {
  hit(heavy) { if (!ctx) return; noise(heavy ? 0.35 : 0.14, heavy ? 900 : 1800, 1, heavy ? 0.9 : 0.6); tone('sine', heavy ? 140 : 220, 40, heavy ? 0.3 : 0.12, 0.8); },
  whoosh() { if (!ctx) return; const f = noise(0.18, 600, 2, 0.25, 'bandpass'); f.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.18); },
  block() { if (!ctx) return; tone('square', 900, 400, 0.08, 0.15); noise(0.08, 4000, 2, 0.3, 'highpass'); },
  ki() { if (!ctx) return; tone('sawtooth', 700, 1500, 0.12, 0.08); tone('sine', 1200, 300, 0.15, 0.15); },
  boom(big) { if (!ctx) return; noise(big ? 2.2 : 0.9, big ? 300 : 700, 0.7, big ? 1.2 : 0.8); tone('sine', 90, 25, big ? 1.5 : 0.6, 1); },
  charge() { if (!ctx) return; tone('sawtooth', 80, 160, 0.6, 0.06); noise(0.6, 500, 3, 0.1, 'bandpass'); },
  beam(dur = 1.5) { if (!ctx) return; tone('sawtooth', 120, 90, dur, 0.18); tone('square', 60, 45, dur, 0.12); noise(dur, 1500, 1, 0.35, 'bandpass'); },
  powerup() { if (!ctx) return; tone('sawtooth', 60, 400, 1.6, 0.18); noise(1.6, 800, 1, 0.4); },
  vanish() { if (!ctx) return; tone('sine', 2000, 300, 0.12, 0.2); },
  roar() { if (!ctx) return; tone('sawtooth', 110, 55, 1.6, 0.45); noise(1.6, 400, 1, 0.7); },
  ui() { if (!ctx) return; tone('square', 880, 1320, 0.06, 0.08); },
};
