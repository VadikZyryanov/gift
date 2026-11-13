export type EffectName = 'paper' | 'locked' | 'unlock' | 'found' | 'reveal' | 'gifts';

// All layers belong to one cancellable effect; no downloads or background music.
export function playSound(context: AudioContext, name: EffectName): () => void {
  const output = context.createGain();
  output.gain.setValueAtTime(.65, context.currentTime);
  output.connect(context.destination);
  const sources = new Set<AudioScheduledSourceNode>();
  const now = context.currentTime;

  function schedule(source: AudioScheduledSourceNode, delay: number, duration: number, volume: number, filter?: BiquadFilterNode) {
    const gain = context.createGain();
    const start = now + delay;
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(.025, duration / 4));
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    if (filter) { source.connect(filter); filter.connect(gain); }
    else source.connect(gain);
    gain.connect(output);
    sources.add(source);
    source.onended = () => {
      source.disconnect();
      filter?.disconnect();
      gain.disconnect();
      sources.delete(source);
      if (sources.size === 0) output.disconnect();
    };
    source.start(start);
    source.stop(start + duration);
  }

  function tone(frequency: number, delay: number, duration: number, volume: number, endFrequency = frequency) {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + delay);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + delay + duration);
    schedule(oscillator, delay, duration, volume);
  }

  function rustle(delay: number, duration: number, volume: number, frequency: number) {
    const source = context.createBufferSource();
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index++) {
      const progress = index / samples.length;
      samples[index] = (Math.random() * 2 - 1) * (.3 + .7 * Math.sin(progress * Math.PI * 3) ** 2);
    }
    source.buffer = buffer;
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency, now + delay);
    filter.Q.setValueAtTime(.7, now + delay);
    schedule(source, delay, duration, volume, filter);
  }

  if (name === 'paper') {
    rustle(0, .32, .055, 1500);
    rustle(.1, .24, .025, 2800);
  } else if (name === 'locked') {
    for (const [delay, volume] of [[0, .055], [.12, .04], [.26, .025]] as const) {
      tone(180, delay, .085, volume, 100);
      tone(1680, delay, .045, volume * .3, 1300);
      rustle(delay, .065, volume, 2400);
    }
  } else if (name === 'found') {
    tone(659.25, 0, .38, .032);
    tone(830.61, .07, .45, .023);
    tone(987.77, .14, .6, .018);
  } else if (name === 'gifts') {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093];
    notes.forEach((frequency, index) => {
      const delay = index * .085;
      tone(frequency, delay, .85, .034 - index * .002);
      tone(frequency * 2, delay, .28, .005);
      tone(frequency, delay + .16, .85, .008);
    });
    [261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
      tone(frequency, .52 + index * .035, 1.65, .015);
    });
    tone(2637.02, .68, 1, .009);
    tone(3135.96, .8, .9, .006);
  } else {
    tone(880, 0, .13, .045, 460);
    tone(1320, .035, .11, .014, 660);
    rustle(.02, .12, .025, 3200);
    if (name === 'reveal') {
      rustle(.4, .6, .04, 700);
      tone(261.63, .55, 1.1, .025);
      tone(329.63, .7, 1.05, .02);
      tone(392, .85, 1, .016);
      rustle(1.65, .45, .04, 1800);
    }
  }

  return () => {
    for (const source of sources) {
      try { source.stop(); } catch { /* A source may already have ended. */ }
    }
    output.disconnect();
  };
}
