/** Sonidos sintéticos (Web Audio). Sin archivos externos. */

/** @type {AudioContext | null} */
let _ctx = null;

export function ensureSfx() {
  const AC = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  if (!AC) return null;
  if (!_ctx) _ctx = new AC();
  if (_ctx.state === "suspended") {
    void _ctx.resume();
  }
  return _ctx;
}

/**
 * @param {number} freq
 * @param {number} dur
 * @param {"square" | "triangle" | "sine"} type
 * @param {number} vol
 */
function blip(freq, dur, type, vol) {
  const ctx = _ctx;
  if (!ctx) return;
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.04);
}

export const sfx = {
  /** Golpe pala–pelota: golpe grave corto. */
  paddle() {
    if (!ensureSfx()) return;
    blip(165, 0.055, "triangle", 0.11);
  },
  /** Rebote en pared o techo. */
  wall() {
    if (!ensureSfx()) return;
    blip(380, 0.038, "square", 0.065);
  },
  /**
   * Golpe en ladrillo: más agudo si se destruye.
   * @param {boolean} destroyed
   */
  brick(destroyed) {
    if (!ensureSfx()) return;
    if (destroyed) blip(720, 0.045, "square", 0.075);
    else blip(300, 0.042, "triangle", 0.06);
  },
};
