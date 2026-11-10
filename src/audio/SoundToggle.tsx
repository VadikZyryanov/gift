import { useAudio } from './AudioProvider';

export function SoundToggle() {
  const { effectsEnabled, setEffectsEnabled } = useAudio();
  return <button className="sound-toggle" type="button" aria-label={effectsEnabled ? 'Выключить звуки' : 'Включить звуки'} aria-pressed={effectsEnabled} onClick={() => setEffectsEnabled(!effectsEnabled)}>
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 12h6l8-7v22l-8-7H4v-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d={effectsEnabled ? 'M23 10c5 3 5 9 0 12m3-16c8 5 8 15 0 20' : 'm24 13 6 6m0-6-6 6'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </button>;
}
