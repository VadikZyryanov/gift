import { useAudio } from '../audio/AudioProvider';
import { useEffect, useState } from 'react';
import { StorageNotice } from '../components/StorageNotice';
import { useGame } from '../game/GameProvider';
import chestClosed from '../assets/scene/chest.webp';
import chestOpen from '../assets/scene/chest-open-unlocked.webp';
import { FinaleLayout } from './FinaleLayout';
import { Envelope } from './Envelope';

export function ChestScene({ animate = false }: { animate?: boolean }) {
  const { send } = useGame();
  const { stopVoice, stopEffects } = useAudio();
  const [entering, setEntering] = useState(() => animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (!entering) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => setEntering(false);
    const onVisibility = () => { if (document.visibilityState === 'hidden') finish(); };
    // This timer controls decoration only; the opened chest is already saved.
    const timer = window.setTimeout(finish, 2800);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', finish);
    motion.addEventListener('change', finish);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', finish);
      motion.removeEventListener('change', finish);
    };
  }, [entering]);

  return <FinaleLayout title="Самое тёплое — внутри" className={`chest-page${entering ? ' chest-page--entering' : ''}`} onBack={() => {
    stopVoice();
    stopEffects();
    send({ type: 'navigate', scene: { kind: 'table' } });
  }}>
    <StorageNotice />
    <p className="finale-page__eyebrow">Четыре истории. Четыре ключа.</p>
    <div className="chest-opening" aria-hidden="true">
      <span className="chest-opening__glow" />
      {entering && <img className="chest-opening__closed" src={chestClosed} alt="" width="840" height="480" draggable="false" />}
      <img className="chest-opening__open" src={chestOpen} alt="" width="840" height="560" draggable="false" />
      {entering && <span className="chest-opening__lock">
        <svg viewBox="0 0 100 130" fill="none"><defs><linearGradient id="falling-lock-gold" x2="100" y2="130" gradientUnits="userSpaceOnUse"><stop stopColor="#ffe6a0" /><stop offset=".5" stopColor="#c78a35" /><stop offset="1" stopColor="#8e571f" /></linearGradient></defs>
          <path d="M28 55V29C28 5 70 5 70 29V41" stroke="url(#falling-lock-gold)" strokeWidth="12" strokeLinecap="round" />
          <path d="M50 121 10 83C-8 59 26 34 50 59 74 34 108 59 90 83Z" fill="url(#falling-lock-gold)" stroke="#f4c76c" strokeWidth="3" />
          <path d="M50 73a8 8 0 0 0-4 15l-3 13h14l-3-13a8 8 0 0 0-4-15Z" fill="#674017" />
        </svg>
      </span>}
      <span className="chest-opening__spark chest-opening__spark--one">✧</span>
      <span className="chest-opening__spark chest-opening__spark--two">✧</span>
      <span className="chest-opening__spark chest-opening__spark--three">♡</span>
    </div>
    <div className="chest-page__envelope" inert={entering} aria-hidden={entering}>
      <Envelope onOpen={() => {
        stopEffects();
        send({ type: 'open-letter' });
      }} />
    </div>
    {entering && <button className="chest-page__skip" type="button" onClick={() => setEntering(false)}>Пропустить анимацию</button>}
  </FinaleLayout>;
}
