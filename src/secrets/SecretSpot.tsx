import { useRef, useState, type ReactNode } from 'react';
import { useAudio } from '../audio/AudioProvider';
import { useGame } from '../game/GameProvider';
import type { SecretId } from '../game/types';
import { SecretNote } from './SecretNote';

interface SecretSpotProps {
  secretId: SecretId;
  label: string;
  children: ReactNode;
  className?: string;
}

export function SecretSpot({ secretId, label, children, className = '' }: SecretSpotProps) {
  const { progress, send } = useGame();
  const { playEffect } = useAudio();
  const [note, setNote] = useState<{ isNew: boolean } | null>(null);
  const openingRef = useRef(false);
  const found = progress.foundSecrets.includes(secretId);

  function openNote() {
    if (openingRef.current) return;
    openingRef.current = true;
    const isNew = !found;
    if (isNew) send({ type: 'find-secret', secretId });
    setNote({ isNew });
    if (isNew) playEffect('found');
  }

  return <>
    <button id={`secret-${secretId}`} className={`secret-spot ${className}`} type="button"
      aria-label={label} aria-haspopup="dialog" onClick={event => {
        event.currentTarget.focus({ preventScroll: true });
        openNote();
      }}>
      {children}
    </button>
    {note && <SecretNote secretId={secretId} isNew={note.isNew} onClose={() => {
      openingRef.current = false;
      setNote(null);
    }} />}
  </>;
}
