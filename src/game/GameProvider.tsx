import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { gameContent } from './content';
import { createInitialProgress, gameReducer } from './progress';
import { readProgress, writeProgress } from './storage';
import type { GameEvent, GameSession } from './types';

const GameContext = createContext<GameSession | null>(null);

function restoreSession(): Omit<GameSession, 'send'> {
  try {
    const { progress, status } = readProgress(window.localStorage, gameContent.revision);
    return { progress, storageStatus: status };
  } catch {
    return { progress: createInitialProgress(gameContent.revision), storageStatus: 'unavailable' };
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(restoreSession);
  const sessionRef = useRef(session);

  const send = useCallback((event: GameEvent) => {
    const current = sessionRef.current;
    const progress = gameReducer(current.progress, event);
    let saved = false;
    try {
      saved = writeProgress(window.localStorage, progress);
    } catch { /* Accessing localStorage itself may be denied. Continue in memory. */ }
    const storageStatus = !saved || current.storageStatus === 'unavailable' ? 'unavailable'
      : event.type === 'restart' ? 'available' : current.storageStatus;
    const next = { progress, storageStatus } satisfies Omit<GameSession, 'send'>;
    // Keep synchronous events consistent before React commits its next render.
    sessionRef.current = next;
    setSession(next);
  }, []);

  return <GameContext value={{ ...session, send }}>{children}</GameContext>;
}

export function useGame(): GameSession {
  const session = useContext(GameContext);
  if (!session) throw new Error('useGame must be used within GameProvider');
  return session;
}
