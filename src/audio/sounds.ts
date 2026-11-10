export type EffectName = 'paper' | 'unlock' | 'found';

// Short, quiet procedural effects: no downloads or background music.
export function playSound(context: AudioContext, name: EffectName): () => void {
  const gain = context.createGain();
  const duration = name === 'paper' ? .18 : .38;
  const start = context.currentTime;
  let source: AudioBufferSourceNode | OscillatorNode;
  if (name === 'paper') {
    const noise = context.createBufferSource();
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    source = noise;
  } else {
    const tone = context.createOscillator();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(name === 'unlock' ? 420 : 640, start);
    tone.frequency.exponentialRampToValueAtTime(name === 'unlock' ? 680 : 960, start + duration);
    source = tone;
  }
  gain.gain.setValueAtTime(name === 'paper' ? .018 : .045, start);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  source.connect(gain);
  gain.connect(context.destination);
  const disconnect = () => { source.disconnect(); gain.disconnect(); };
  source.onended = disconnect;
  source.start(start);
  source.stop(start + duration);
  return () => {
    try { source.stop(); } catch { /* A source may already have ended. */ }
    disconnect();
  };
}
