import { useEffect, useRef, useState, type ReactNode } from 'react';
import { KeyOrnament } from '../components/KeyOrnament';
import { gameContent } from '../game/content';
import { pouchIds, type PouchId } from '../game/types';
import { pouchImages, sceneImages } from './assets';
import { RotatingChest } from './RotatingChest';

interface TableSceneProps {
  completedPouches: readonly PouchId[];
  onOpenPouch: (pouchId: PouchId) => void;
  onOpenChest?: () => void;
  onCheckLock?: () => void;
  onOpenMenu?: () => void;
  soundControl?: ReactNode;
  chestRear?: ReactNode;
  flowerSecret?: ReactNode;
}

const lockedChestFrames: Keyframe[] = [
  { transform: 'translateX(0) rotate(0)' },
  { transform: 'translateX(-4px) rotate(-1.2deg)' },
  { transform: 'translateX(4px) rotate(1.2deg)' },
  { transform: 'translateX(-3px) rotate(-.8deg)' },
  { transform: 'translateX(2px) rotate(.5deg)' },
  { transform: 'translateX(0) rotate(0)' },
];

function HeartDivider() {
  return (
    <svg className="heart-divider" viewBox="0 0 200 23" fill="none" aria-hidden="true">
      <path d="M7 15c27-10 47-10 75-3m36 0c28-7 48-7 75 3M100 21l-9-10C81-1 99-3 100 6c1-9 19-7 9 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TableScene({ completedPouches, onOpenPouch, onOpenChest, onCheckLock, onOpenMenu, soundControl, chestRear, flowerSecret }: TableSceneProps) {
  const [hasCheckedLock, setHasCheckedLock] = useState(false);
  const chestArtRef = useRef<HTMLSpanElement>(null);
  const shakeAnimationRef = useRef<Animation | null>(null);
  const keyCount = pouchIds.filter((id) => completedPouches.includes(id)).length;
  const chestReady = keyCount === pouchIds.length;
  const remainingKeys = pouchIds.length - keyCount;
  const chestHint = chestReady
    ? 'Все ключи нашлись. Самое тёплое — внутри.'
    : hasCheckedLock
      ? `Пока закрыто. Осталось найти ещё ${remainingKeys} ${remainingKeys === 1 ? 'ключ' : 'ключа'}.`
      : 'Сундук откроется, когда найдутся все 4 ключа.';

  useEffect(() => () => { shakeAnimationRef.current?.cancel(); }, []);

  function handleChestPress() {
    shakeAnimationRef.current?.cancel();
    if (chestReady) {
      onOpenChest?.();
      return;
    }

    setHasCheckedLock(true);
    onCheckLock?.();
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    shakeAnimationRef.current = chestArtRef.current?.animate?.(lockedChestFrames, {
      duration: 500,
      easing: 'ease-out',
    }) ?? null;
  }

  return (
    <main className="table-wrap">
      <div className="table">
        <div className="table-decor" aria-hidden="true">
          <img className="table-decor__flowers table-decor__flowers--top" src={sceneImages.decor} alt="" width="500" height="500" />
          <span className="table-decor__ribbon table-decor__ribbon--left" />
          <span className="table-decor__ribbon table-decor__ribbon--right" />
          {Array.from({ length: 9 }, (_, index) => <i key={index} className={`mote mote--${index + 1}`} />)}
        </div>

        <header className="table-heading">
          {soundControl ?? <span className="sound-indicator" role="img" aria-label="Звук выключен">
            <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 12h6l8-7v22l-8-7H4v-8Zm20 1 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>}
          <p className="dedication">{gameContent.dedication}</p>
          <HeartDivider />
          <h1 aria-label={gameContent.title}>KitKat<span>в чемодане</span></h1>
          <p className="table-instruction">{gameContent.instruction}</p>
        </header>

        <section className="pouches" aria-label="Четыре маленькие истории">
          {pouchIds.map((id) => (
            <div className="pouch-slot" key={id}>
              <button
                id={`pouch-${id}`}
                className={`pouch pouch--${id}`}
                type="button"
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  onOpenPouch(id);
                }}
                aria-label={gameContent.pouches[id].title}
                aria-haspopup="dialog"
              >
                <span className="pouch__art">
                  <img src={pouchImages[id]} alt="" width="640" height="600" draggable="false" fetchPriority={id === 'beginning' ? 'high' : 'auto'} />
                  <span className="pouch__tag">{gameContent.pouches[id].title}</span>
                </span>
              </button>
            </div>
          ))}
        </section>

        <section className="treasure" aria-label="Ключи и сундук">
          <p className="key-count" aria-live="polite">Ключи: {keyCount} из 4</p>
          <div className="key-row" aria-hidden="true">
            {pouchIds.map((id) => <span key={id} className={`key-ornament${completedPouches.includes(id) ? ' key-ornament--found' : ''}`}><KeyOrnament /></span>)}
          </div>
          <div className="treasure__display">
            <RotatingChest onPress={handleChestPress} artRef={chestArtRef} rearContent={chestRear} />
            <div className="table-flower-corner">
              {flowerSecret}
              <img src={sceneImages.decor} alt="" width="500" height="500" aria-hidden="true" />
            </div>
          </div>
          <p id="chest-hint" className="chest-hint" role="status" aria-atomic="true">{chestHint}</p>
        </section>

        <footer className="table-footer">
          <p>{gameContent.signature}</p><HeartDivider />
          {onOpenMenu && <button className="game-menu-button" type="button" aria-haspopup="dialog" onClick={(event) => {
            event.currentTarget.focus({ preventScroll: true });
            onOpenMenu();
          }}>Меню игры</button>}
        </footer>
      </div>
    </main>
  );
}
