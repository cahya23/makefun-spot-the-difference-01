// Twin Gardens — Spot the Difference
// audio.js: every sound is synthesized with WebAudio, so the game loads no
// audio file at all. The context is created on the first user gesture, as
// browsers require, and a mute flag silences everything.

export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensure() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
    }
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  tone(freq, startIn, dur, type, gain) {
    if (!this.context || this.muted) return;
    const t0 = this.context.currentTime + startIn;
    const osc = this.context.createOscillator();
    const amp = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp);
    amp.connect(this.context.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // A happy two-note chime when a difference is found.
  chime() {
    this.ensure();
    this.tone(659.25, 0, 0.22, 'sine', 0.22);
    this.tone(880.0, 0.09, 0.3, 'sine', 0.22);
  }

  // A soft low buzz for a wrong click: noticeable, never harsh.
  buzz() {
    this.ensure();
    this.tone(130.81, 0, 0.18, 'sawtooth', 0.08);
  }

  // A tiny tick for buttons.
  click() {
    this.ensure();
    this.tone(523.25, 0, 0.07, 'square', 0.06);
  }

  // A rising arpeggio when a level is finished.
  fanfare() {
    this.ensure();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.tone(f, i * 0.11, 0.32, 'triangle', 0.2);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}
