import { useReducedMotion } from '../animation/useReducedMotion';
import './voice-playback-heart.css';

export type VoiceHeartState = 'idle' | 'playing' | 'paused';

export function VoicePlaybackHeart({ state }: { state: VoiceHeartState }) {
  const reducedMotion = useReducedMotion();
  return <span className={`voice-playback-heart${reducedMotion ? ' voice-playback-heart--still' : ''}`}
    data-state={state} aria-hidden="true">
    <svg className="voice-playback-heart__pulse" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21 3.4 12.7C-2 7.5 5.1-.8 12 6.1 18.9-.8 26 7.5 20.6 12.7Z" />
    </svg>
    <span className="voice-playback-heart__particle voice-playback-heart__particle--one">♡</span>
    <span className="voice-playback-heart__particle voice-playback-heart__particle--two">♡</span>
    <span className="voice-playback-heart__particle voice-playback-heart__particle--three">♡</span>
  </span>;
}
