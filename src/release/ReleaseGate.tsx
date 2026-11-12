import { lazy, Suspense, useEffect, useState } from 'react';
import './release.css';

const releaseDate = '2026-11-18T00:00:00+03:00';
const releaseTime = Date.parse(releaseDate);

function GameLoadError() {
  return (
    <main className="release-page">
      <section className="release-card" aria-labelledby="release-error-title">
        <h1 id="release-error-title">Подарок уже ждёт</h1>
        <p className="release-message">Не удалось загрузить игру. Проверь подключение и обнови страницу.</p>
        <button className="release-button" type="button" onClick={() => window.location.reload()}>
          Обновить страницу
        </button>
      </section>
    </main>
  );
}

const GameApp = lazy(async () => {
  try {
    return await import('../App');
  } catch {
    // A deployment can replace the chunk while the countdown page is still open.
    return { default: GameLoadError };
  }
});

export function ReleaseGate() {
  const [now, setNow] = useState(Date.now);
  const [opened, setOpened] = useState(false);
  const available = now >= releaseTime;

  useEffect(() => {
    if (import.meta.env.DEV || opened) return;

    function updateTime() {
      setNow(Date.now());
    }

    const interval = window.setInterval(updateTime, 1000);
    document.addEventListener('visibilitychange', updateTime);
    window.addEventListener('pageshow', updateTime);
    window.addEventListener('focus', updateTime);
    updateTime();

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', updateTime);
      window.removeEventListener('pageshow', updateTime);
      window.removeEventListener('focus', updateTime);
    };
  }, [opened]);

  if (import.meta.env.DEV || opened) {
    return (
      <Suspense fallback={
        <main className="release-page">
          <p className="release-loading" role="status">Открываем твой подарок…</p>
        </main>
      }>
        <GameApp />
      </Suspense>
    );
  }

  const secondsLeft = Math.max(0, Math.ceil((releaseTime - now) / 1000));
  const countdown = [
    { label: 'дней', value: Math.floor(secondsLeft / 86400) },
    { label: 'часов', value: Math.floor(secondsLeft / 3600) % 24 },
    { label: 'минут', value: Math.floor(secondsLeft / 60) % 60 },
    { label: 'секунд', value: secondsLeft % 60 },
  ];

  function openGift() {
    const currentTime = Date.now();
    setNow(currentTime);
    if (currentTime >= releaseTime) setOpened(true);
  }

  return (
    <main className="release-page">
      <section className="release-card" aria-labelledby="release-title">
        <p className="release-dedication">Только для тебя</p>
        <div className="release-envelope" aria-hidden="true"><span>♥</span></div>
        <h1 id="release-title">Карамельная попка,</h1>
        <p className="release-subtitle">у меня для тебя сюрприз</p>
        <p className="release-message" role="status">
          {available
            ? 'Твой день настал. С днём рождения, любимая! Пришло время открыть то, что я приготовил для тебя.'
            : 'Некоторые подарки ждут своего особенного момента. Этот — ждёт твоего дня рождения.'}
        </p>
        <p className="release-date">
          <time dateTime={releaseDate}>18 ноября · 00:00 по Москве</time>
        </p>
        {available ? (
          <button className="release-button" type="button" onClick={openGift}>Открыть подарок</button>
        ) : (
          <dl className="release-countdown" aria-label="До открытия подарка" aria-live="off">
            {countdown.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{String(value).padStart(2, '0')}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="release-signature">С любовью и маленьким секретом внутри ♥</p>
      </section>
    </main>
  );
}
