import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '../animation/useReducedMotion';
import { gameContent } from '../game/content';
import './collected-car.css';

function CarArtwork({ lit = false }: { lit?: boolean }) {
  return <span className={`collected-car__art${lit ? ' collected-car__art--lit' : ''}`} aria-hidden="true">
    <img src={gameContent.secrets['black-g-class'].image.src} alt="" width="640" height="426" />
    <span className="collected-car__headlight collected-car__headlight--near" />
    <span className="collected-car__headlight collected-car__headlight--far" />
  </span>;
}

export function CollectedCar() {
  const reducedMotion = useReducedMotion();
  const [ride, setRide] = useState<number | null>(null);
  const duration = reducedMotion ? 1200 : 3800;

  useEffect(() => {
    if (ride === null) return;
    const timeout = window.setTimeout(() => setRide(null), duration);
    return () => window.clearTimeout(timeout);
  }, [ride, duration]);

  return <>
    <button className="secret-results__item collected-car" type="button"
      aria-label="Чёрный Гелик. Нажми — прокатимся"
      onClick={() => setRide(current => (current ?? 0) + 1)}>
      <CarArtwork lit={ride !== null} />
      <span>Чёрный Гелик<span className="collected-car__invitation">Нажми — прокатимся</span></span>
    </button>
    {ride !== null && createPortal(<div className={`collected-car-ride${reducedMotion ? ' collected-car-ride--still' : ''}`}
      style={{ '--car-ride-duration': `${duration}ms` } as CSSProperties} aria-hidden="true">
      <div key={ride} className="collected-car-ride__vehicle">
        <CarArtwork lit />
        <span className="collected-car-ride__heart collected-car-ride__heart--one">♡</span>
        <span className="collected-car-ride__heart collected-car-ride__heart--two">♡</span>
        <span className="collected-car-ride__heart collected-car-ride__heart--three">♡</span>
      </div>
    </div>, document.body)}
  </>;
}
