import { useEffect } from 'react';
import kitkatImage from '../assets/content/beginning-kitkat.webp';

interface KitKatFlightProps {
  message: string;
  onComplete: () => void;
}

export function KitKatFlight({ message, onComplete }: KitKatFlightProps) {
  const duration = 3000;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The key is already saved. This timer only finishes its presentation, even if art fails.
    const timer = window.setTimeout(onComplete, reduced ? 0 : duration);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return <section className="kitkat-flight" role="status" aria-label="Сладкая находка">
    <p className="task-success">{message}</p>
    <div className="kitkat-flight__stage" aria-hidden="true">
      <img className="kitkat-flight__bar" src={kitkatImage} alt="" width="768" height="384" draggable="false" style={{ animationDuration: `${duration}ms` }} />
    </div>
  </section>;
}
