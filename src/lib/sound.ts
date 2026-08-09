export function playChime() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    [523.25, 783.99].forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      const start = now + i * 0.15;

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(start);
      oscillator.stop(start + 0.8);
    });

    setTimeout(() => ctx.close(), 1200);
  } catch {
    // Web Audio unsupported or blocked — fail silently.
  }
}
