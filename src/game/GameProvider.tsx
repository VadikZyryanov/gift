import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { gameContent } from './content';
import { createInitialProgress, gameReducer } from './progress';
import { getGiftWallet, normalizeGiftPurchases } from './gifts';
import { progressStorageKey, readProgress, writeProgress } from './storage';
import type { GameEvent, GameProgress, GameSession } from './types';

const GameContext = createContext<GameSession | null>(null);

function restoreSession(): Omit<GameSession, 'send'> {
  try {
    const { progress, status } = readProgress(window.localStorage, gameContent.revision);
    return { progress, storageStatus: status };
  } catch {
    return { progress: createInitialProgress(gameContent.revision), storageStatus: 'unavailable' };
  }
}

function refreshWallet(progress: GameProgress): GameProgress {
  try {
    const saved = readProgress(window.localStorage, gameContent.revision);
    if (saved.status !== 'available') return progress;
    const giftRewardEarned = getGiftWallet(progress).earned > 0 || getGiftWallet(saved.progress).earned > 0;
    const purchasedGiftIds = normalizeGiftPurchases([
      ...(saved.progress.purchasedGiftIds ?? []), ...(progress.purchasedGiftIds ?? []),
    ], giftRewardEarned);
    return { ...progress, giftRewardEarned, purchasedGiftIds };
  } catch {
    return progress;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(restoreSession);
  const sessionRef = useRef(session);

  const send = useCallback((event: GameEvent): Promise<boolean> => {
    function applyEvent(): boolean {
      const current = sessionRef.current;
      // Read under the cross-tab lock before every write, including navigation/restart.
      const latestProgress = refreshWallet(current.progress);
      const progress = gameReducer(latestProgress, event);
      let saved = false;
      try {
        saved = writeProgress(window.localStorage, progress);
      } catch { /* Accessing localStorage itself may be denied. Continue in memory. */ }
      const storageStatus = !saved || current.storageStatus === 'unavailable' ? 'unavailable'
        : event.type === 'restart' ? 'available' : current.storageStatus;
      const next = { progress, storageStatus } satisfies Omit<GameSession, 'send'>;
      // Update before the next queued event and before React renders rewards.
      sessionRef.current = next;
      setSession(next);
      return progress !== latestProgress;
    }

    try {
      if (navigator.locks) {
        return navigator.locks.request(progressStorageKey, applyEvent).catch(applyEvent);
      }
    } catch { /* Some browser contexts deny access to Web Locks. */ }
    return Promise.resolve(applyEvent());
  }, []);

  useEffect(() => {
    function syncWallet(event: StorageEvent) {
      if (event.key !== progressStorageKey || event.newValue === null) return;
      const current = sessionRef.current;
      const next = { ...current, progress: refreshWallet(current.progress) };
      sessionRef.current = next;
      setSession(next);
    }
    window.addEventListener('storage', syncWallet);
    return () => window.removeEventListener('storage', syncWallet);
  }, []);

  return <GameContext value={{ ...session, send }}>{children}</GameContext>;
}

export function useGame(): GameSession {
  const session = useContext(GameContext);
  if (!session) throw new Error('useGame must be used within GameProvider');
  return session;
}
