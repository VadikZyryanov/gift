import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../animation/useReducedMotion';
import { KeyOrnament } from '../components/KeyOrnament';
import type { PouchId } from '../game/types';
import './key-flight.css';

export interface KeyDeparture {
  pouchId: PouchId;
  origin: { x: number; y: number };
}

interface KeyFlightProps {
  departure: KeyDeparture;
  unlock: boolean;
  onComplete: () => void;
}

export function KeyFlight({ departure, unlock, onComplete }: KeyFlightProps) {
  const keyRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (completedRef.current) return;
    const key = keyRef.current;
    const slot = document.getElementById(`table-key-${departure.pouchId}`);
    if (!key || !slot || reduced || !key.animate || document.visibilityState === 'hidden') {
      completedRef.current = true;
      onCompleteRef.current();
      return;
    }

    // The dialog has closed; bring the destination into view before measuring it.
    slot.scrollIntoView?.({ block: 'center', behavior: 'instant' });
    const bounds = slot.getBoundingClientRect();
    const destination = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
    const start = {
      x: Math.max(24, Math.min(window.innerWidth - 24, departure.origin.x)),
      y: Math.max(32, Math.min(window.innerHeight - 32, departure.origin.y)),
    };
    const transform = (x: number, y: number, scale: number, rotation: number) => `translate(${x - 16}px, ${y - 28}px) rotate(${rotation}deg) scale(${scale})`;
    const visibility = slot.style.visibility;
    slot.style.visibility = 'hidden';
    const animations: Animation[] = [];
    let disposed = false;
    let arrived = false;
    let timer: number;

    function finish() {
      if (disposed) return;
      disposed = true;
      completedRef.current = true;
      window.clearTimeout(timer);
      slot!.style.visibility = visibility;
      onCompleteRef.current();
    }

    function arrive() {
      if (disposed || arrived) return;
      arrived = true;
      window.clearTimeout(timer);
      slot!.style.visibility = visibility;
      animations[0]?.cancel();
      key!.style.opacity = '0';
      const pulse = slot!.animate?.([
        { transform: 'scale(1)', filter: 'drop-shadow(0 0 0px #ffe8a0)' },
        { transform: 'scale(1.45)', filter: 'drop-shadow(0 0 14px #ffe8a0)' },
        { transform: 'scale(1)', filter: 'drop-shadow(0 0 0px #ffe8a0)' },
      ], { duration: 500, easing: 'ease-out' });
      if (pulse) animations.push(pulse);
      if (unlock) {
        const glow = document.getElementById('treasure-chest')?.animate?.([
          { filter: 'drop-shadow(0 0 0px #ffe8a000)' },
          { filter: 'drop-shadow(0 0 30px #ffde88) brightness(1.18)' },
          { filter: 'drop-shadow(0 0 12px #ffde8866)' },
        ], { duration: 650, easing: 'ease-in-out' });
        if (glow) animations.push(glow);
      }
      timer = window.setTimeout(finish, unlock ? 700 : 250);
    }

    const flight = key.animate([
      { transform: transform(start.x, start.y, 1.5, -18), opacity: 0 },
      { transform: transform(start.x, start.y - 24, 1.7, 8), opacity: 1, offset: .15 },
      { transform: transform((start.x + destination.x) / 2 + 40, Math.min(start.y, destination.y) - 70, 1.25, 24), opacity: 1, offset: .55 },
      { transform: transform(destination.x, destination.y, .75, 0), opacity: 1 },
    ], { duration: 900, easing: 'cubic-bezier(.3,.1,.25,1)', fill: 'both' });
    animations.push(flight);
    flight.onfinish = arrive;
    // A missing animation event must never delay the fourth-key chest entrance.
    timer = window.setTimeout(arrive, 1050);
    const onHidden = () => { if (document.visibilityState === 'hidden') finish(); };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('resize', finish);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      slot.style.visibility = visibility;
      animations.forEach(animation => animation.cancel());
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('resize', finish);
    };
  }, [departure, unlock, reduced]);

  return <span ref={keyRef} className="key-flight" aria-hidden="true"><KeyOrnament /></span>;
}
