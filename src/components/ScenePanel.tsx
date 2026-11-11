import { useEffect, useId, useRef, type ReactNode } from 'react';

interface ScenePanelProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
  backLabel?: string;
  returnFocusId?: string;
  entrance?: 'heart';
}

export function ScenePanel({ title, onBack, children, backLabel = 'На стол', returnFocusId, entrance }: ScenePanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const returnFocus = (returnFocusId ? document.getElementById(returnFocusId) : null) ?? document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (returnFocus instanceof HTMLElement && returnFocus.isConnected) {
        returnFocus.focus({ preventScroll: true });
      }
    };
  }, [returnFocusId]);

  return (
    <dialog ref={dialogRef} className={`scene-panel${entrance === 'heart' ? ' scene-panel--heart' : ''}`} aria-labelledby={titleId} onCancel={(event) => {
      event.preventDefault();
      // React portal events still reach the underlying scene's handlers.
      event.stopPropagation();
      onBack();
    }}>
      <div className="scene-panel__top">
        <button className="back-button" type="button" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{backLabel}</span>
        </button>
        <span className="scene-panel__little-heart" aria-hidden="true">♡</span>
      </div>
      <div className="scene-panel__body"><h2 id={titleId}>{title}</h2>{children}</div>
    </dialog>
  );
}
