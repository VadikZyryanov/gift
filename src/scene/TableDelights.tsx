import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../animation/useReducedMotion';
import './table-delights.css';

function useTimedBursts(limit: number) {
  const [bursts, setBursts] = useState<number[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      pending.clear();
    };
  }, []);

  function release(duration: number) {
    const pending = timers.current;
    if (pending.size >= limit) {
      const oldest = pending.keys().next().value;
      if (oldest !== undefined) {
        window.clearTimeout(pending.get(oldest));
        pending.delete(oldest);
      }
    }

    const id = ++nextId.current;
    pending.set(id, window.setTimeout(() => {
      pending.delete(id);
      setBursts((current) => current.filter((burst) => burst !== id));
    }, duration));
    setBursts([...pending.keys()]);
  }

  return [bursts, release] as const;
}

function LittleHeart() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 34C16 30 5 23 5 14.5 5 5 16 4 20 12c4-8 15-7 15 2.5C35 23 24 30 20 34Z" fill="currentColor" stroke="#8c3254" strokeWidth="1.1" />
      <path d="M10 14c.4-3 3-4.5 5.5-3.1" stroke="#ffe6d7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LittleBun() {
  return (
    <svg className="dedication-bun__art" viewBox="0 0 120 86" fill="none" aria-hidden="true">
      <ellipse cx="60" cy="76" rx="37" ry="5" fill="#a35f4430" />
      <path d="M17 54C17 31 31 14 59 14s45 16 45 40c0 17-18 24-44 24S17 71 17 54Z" fill="#eab375" stroke="#ad7547" strokeWidth="1.5" />
      <path d="M22 51c0-21 16-34 37-34 23 0 38 12 40 32-18 8-59 10-77 2Z" fill="#f8d19a" />
      <path d="M44 23c-5 3-8 7-9 11m23-13c-5 3-8 8-9 12m24-10c-5 3-8 7-9 11" stroke="#c88e55" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 22c-3 2-5 5-6 7m20-9c-3 2-5 5-6 8m20-6c-3 2-5 5-6 7" stroke="#ffebc5" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="38" cy="59" rx="7" ry="4" fill="#db8d88" opacity=".65" />
      <ellipse cx="82" cy="59" rx="7" ry="4" fill="#db8d88" opacity=".65" />
      <ellipse cx="45" cy="51" rx="2.8" ry="4" fill="#573143" />
      <ellipse cx="75" cy="51" rx="2.8" ry="4" fill="#573143" />
      <circle cx="45.7" cy="49.7" r=".8" fill="#fff8ec" />
      <circle cx="75.7" cy="49.7" r=".8" fill="#fff8ec" />
      <path d="M54 59c3 5 9 5 12 0" stroke="#75434a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m101 15 2-5 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#b9884c" />
      <path d="M16 28c-6-3-7-7-4-9 3-2 5 0 6 2 0-3 3-5 5-3 3 3 0 7-7 10Z" fill="#bf6680" />
    </svg>
  );
}

export function TableDedication({ text }: { text: string }) {
  const reducedMotion = useReducedMotion();
  const taps = useRef(0);
  const [bun, revealBun] = useTimedBursts(1);

  function tapDedication() {
    taps.current += 1;
    if (taps.current < 5) return;
    taps.current = 0;
    revealBun(reducedMotion ? 1800 : 3200);
  }

  return (
    <div className="table-dedication" data-reduced-motion={reducedMotion}>
      <p className="dedication">
        <button className="dedication__button" type="button" onClick={tapDedication} aria-label={`${text}. Маленький секрет в посвящении`}>
          {text}
        </button>
      </p>
      <span className="dedication-bun-status" role="status">{bun.length > 0 ? 'Да-да, это всё для тебя' : ''}</span>
      {bun.map((id) => (
        <span className="dedication-bun" key={id} aria-hidden="true">
          <LittleBun />
          <span>Да-да, это всё для тебя</span>
        </span>
      ))}
    </div>
  );
}

export function TableHeart() {
  const reducedMotion = useReducedMotion();
  const [bursts, releaseHeart] = useTimedBursts(4);

  return (
    <div className="table-heart" data-reduced-motion={reducedMotion}>
      <svg className="table-heart__flourish" viewBox="0 0 200 23" fill="none" aria-hidden="true">
        <path d="M7 15c27-10 47-10 75-3m36 0c28-7 48-7 75 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <button className="table-heart__button" type="button" onClick={() => releaseHeart(reducedMotion ? 650 : 1300)} aria-label="Отпустить сердечко">
        <LittleHeart />
      </button>
      <span className="table-heart__particles" aria-hidden="true">
        {bursts.map((id) => (
          <span className={`table-heart__burst table-heart__burst--${id % 3}`} key={id}>
            <span className="table-heart__flight"><LittleHeart /></span>
            {Array.from({ length: 4 }, (_, index) => <i className="table-heart__spark" key={index} />)}
          </span>
        ))}
      </span>
    </div>
  );
}

export function FlowerPetals() {
  const reducedMotion = useReducedMotion();
  const [bursts, releasePetals] = useTimedBursts(2);

  return (
    <div className="table-petals" data-reduced-motion={reducedMotion}>
      <button className="table-petals__button" type="button" onClick={() => releasePetals(reducedMotion ? 700 : 2300)} aria-label="Осыпать цветок лепестками" />
      <span className="table-petals__particles" aria-hidden="true">
        {bursts.map((id) => (
          <span className={`table-petals__burst table-petals__burst--${id % 2}`} key={id}>
            {Array.from({ length: 7 }, (_, index) => <i className={`table-petals__petal table-petals__petal--${index + 1}`} key={index} />)}
          </span>
        ))}
      </span>
    </div>
  );
}
