import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import './affection-photo.css';

export function AffectionPhoto({ children, description }: { children: ReactNode; description: string }) {
  const [burst, setBurst] = useState(0);
  const sequence = useRef(0);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function reveal(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail !== 0) {
      const start = pointerStart.current;
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) {
        lastTap.current.time = 0;
        return;
      }
      const previous = lastTap.current;
      lastTap.current = { time: event.timeStamp, x: event.clientX, y: event.clientY };
      if (!previous.time || event.timeStamp - previous.time > 350 || Math.hypot(event.clientX - previous.x, event.clientY - previous.y) > 28) return;
      lastTap.current.time = 0;
    }
    window.clearTimeout(timer.current);
    setBurst(++sequence.current);
    timer.current = window.setTimeout(() => setBurst(0), 1500);
  }

  return <button type="button" className="affection-photo" aria-label={`${description}. Отправить сердечко: два касания или Enter.`}
    title="Дважды коснись фотографии"
    onPointerDown={event => { pointerStart.current = { x: event.clientX, y: event.clientY }; }}
    onPointerCancel={() => { pointerStart.current = null; lastTap.current.time = 0; }} onClick={reveal}>
    {children}
    <span className="affection-photo__hint" aria-hidden="true">♡</span>
    {burst > 0 && <span key={burst} className="affection-photo__reaction" aria-hidden="true">
      <span className="affection-photo__heart">♥</span>
      <span className="affection-photo__message">Люблю нас</span>
    </span>}
  </button>;
}
