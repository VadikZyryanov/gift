import { useEffect, useId, useRef, type ReactNode } from 'react';
import { SoundToggle } from '../audio/SoundToggle';

interface FinaleLayoutProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
  className?: string;
}

export function FinaleLayout({ title, onBack, children, className = '' }: FinaleLayoutProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    titleRef.current?.focus({ preventScroll: true });
    sceneRef.current?.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.getElementById('treasure-chest')?.focus({ preventScroll: true });
    };
  }, []);

  return <main ref={sceneRef} className={`finale-page ${className}`} aria-labelledby={titleId}
    onKeyDown={event => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      onBack();
    }}>
    <header className="finale-page__header">
      <button className="back-button" type="button" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>На стол</span>
      </button>
      <span className="finale-page__heart" aria-hidden="true">♡</span>
      <SoundToggle />
    </header>
    <div className="finale-page__body">
      <h2 ref={titleRef} id={titleId} className="finale-page__title" tabIndex={-1}>{title}</h2>
      {children}
    </div>
  </main>;
}
