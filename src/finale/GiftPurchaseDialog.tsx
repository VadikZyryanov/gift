import { useEffect, useId, useRef } from 'react';
import { formatPupsicoins } from '../game/gifts';
import type { GiftContent } from '../game/types';

interface GiftPurchaseDialogProps {
  gift: GiftContent;
  remaining: number;
  busy: boolean;
  unavailableMessage: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function GiftPurchaseDialog({ gift, remaining, busy, unavailableMessage, onCancel, onConfirm }: GiftPurchaseDialogProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const returnFocus = document.activeElement;
    const scene = dialog.closest<HTMLElement>('.finale-page');
    const previousOverflow = scene?.style.overflowY ?? '';
    if (scene) scene.style.overflowY = 'hidden';
    dialog.showModal();
    cancelRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      if (scene) scene.style.overflowY = previousOverflow;
      if (returnFocus instanceof HTMLElement && returnFocus.isConnected
        && !(returnFocus instanceof HTMLButtonElement && returnFocus.disabled)) {
        returnFocus.focus({ preventScroll: true });
      } else {
        document.getElementById('gift-selection-title')?.focus({ preventScroll: true });
      }
    };
  }, []);

  return <dialog ref={dialogRef} className="gift-purchase-dialog" aria-labelledby={`${id}-title`}
    aria-describedby={`${id}-rules`} aria-busy={busy}
    onKeyDown={event => { if (event.key === 'Escape') event.stopPropagation(); }}
    onCancel={event => {
      event.preventDefault();
      event.stopPropagation();
      if (!busy) onCancel();
    }}>
    <p className="gift-purchase-dialog__heart" aria-hidden="true">♡</p>
    <h2 id={`${id}-title`}>Забрать этот подарок?</h2>
    <p className="gift-purchase-dialog__name">{gift.title}</p>
    <dl className="gift-purchase-dialog__totals">
      <div><dt>Стоимость</dt><dd>{formatPupsicoins(gift.price)} пупсикоинов</dd></div>
      <div><dt>Останется</dt><dd>{formatPupsicoins(Math.max(0, remaining - gift.price))} пупсикоинов</dd></div>
    </dl>
    <p id={`${id}-rules`} className="gift-purchase-dialog__rules">После подтверждения отменить выбор нельзя. Описание откроется сразу после покупки.</p>
    {unavailableMessage && <p className="gift-purchase-dialog__message" role="status">{unavailableMessage}</p>}
    <div className="gift-purchase-dialog__actions">
      <button className="story-button" type="button" disabled={busy || unavailableMessage !== null} onClick={onConfirm}>
        {busy ? 'Забираю…' : 'Да, забираю'}
      </button>
      <button ref={cancelRef} className="story-button story-button--quiet" type="button" disabled={busy} onClick={onCancel}>Ещё подумаю</button>
    </div>
  </dialog>;
}
