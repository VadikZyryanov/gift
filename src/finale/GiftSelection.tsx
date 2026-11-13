import { useEffect, useRef, useState } from 'react';
import { gameContent } from '../game/content';
import { useGame } from '../game/GameProvider';
import { useAudio } from '../audio/AudioProvider';
import { formatPupsicoins, getGiftWallet } from '../game/gifts';
import type { GiftContent, GiftId } from '../game/types';
import { GiftPurchaseDialog } from './GiftPurchaseDialog';

const gifts: readonly GiftContent[] = gameContent.gifts.items;

export function GiftSelection() {
  const { progress, send, storageStatus } = useGame();
  const { prepareEffects, playEffect } = useAudio();
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle');
  const [pendingGiftId, setPendingGiftId] = useState<GiftId | null>(null);
  const [purchaseBusy, setPurchaseBusy] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const purchaseBusyRef = useRef(false);
  const requestRef = useRef(0);
  const purchasedGiftIds = progress.purchasedGiftIds ?? [];
  const purchased = gifts.filter(gift => purchasedGiftIds.includes(gift.id));
  const wallet = getGiftWallet(progress);
  const pendingGift = gifts.find(gift => gift.id === pendingGiftId);
  const unavailableMessage = pendingGift && purchasedGiftIds.includes(pendingGift.id)
    ? 'Этот подарок уже выбран.'
    : pendingGift && pendingGift.price > wallet.remaining
      ? 'Остаток изменился — на этот подарок больше не хватает пупсикоинов.'
      : wallet.earned === 0 ? 'Подарки будут доступны после прохождения игры.' : purchaseError;
  const selectionText = [
    'Мои подарки:',
    ...purchased.map(gift => `• ${gift.title} — ${formatPupsicoins(gift.price)} пупсикоинов`),
    '',
    `Потрачено: ${formatPupsicoins(wallet.spent)} пупсикоинов`,
    `Осталось: ${formatPupsicoins(wallet.remaining)} пупсикоинов`,
  ].join('\n');

  useEffect(() => {
    // A purchase in another tab also invalidates an in-flight clipboard request.
    requestRef.current++;
    setCopyState('idle');
    return () => { requestRef.current++; };
  }, [progress.purchasedGiftIds]);

  function openPurchase(giftId: GiftId) {
    setPurchaseError(null);
    setPendingGiftId(giftId);
  }

  function closePurchase() {
    if (purchaseBusyRef.current) return;
    setPendingGiftId(null);
    setPurchaseError(null);
  }

  async function confirmPurchase() {
    if (!pendingGift || unavailableMessage || purchaseBusyRef.current) return;
    purchaseBusyRef.current = true;
    setPurchaseBusy(true);
    requestRef.current++;
    setCopyState('idle');
    // Unlock audio in the gesture; play only once the transaction has applied.
    prepareEffects();
    try {
      const applied = await send({ type: 'purchase-gift', giftId: pendingGift.id });
      if (applied) {
        playEffect('coins');
        setPendingGiftId(null);
      } else {
        setPurchaseError('Не получилось забрать подарок: проверь остаток и свой список подарков.');
      }
    } catch {
      setPurchaseError('Не получилось забрать подарок. Попробуй ещё раз.');
    } finally {
      purchaseBusyRef.current = false;
      setPurchaseBusy(false);
    }
  }

  async function copySelection() {
    const request = ++requestRef.current;
    setCopyState('copying');
    try {
      await navigator.clipboard.writeText(selectionText);
      if (request === requestRef.current) setCopyState('copied');
    } catch {
      if (request === requestRef.current) setCopyState('manual');
    }
  }

  return <section className="gift-selection" aria-labelledby="gift-selection-title">
    <p className="finale-page__eyebrow">Подарки за пупсикоины</p>
    <h3 id="gift-selection-title" className="gift-selection__title" tabIndex={-1}>Что тебя порадует?</h3>
    <p className="gift-selection__intro">За прохождение нашей истории тебе начислен миллион пупсикоинов. Теперь они могут стать подарками.</p>
    <p id="gift-selection-rules" className="gift-selection__rules">Выбирай сердцем: после подтверждения вернуть подарок и пупсикоины уже не получится. Описание откроется после покупки.</p>
    <div className="gift-wallet" role="status" aria-live="polite" aria-atomic="true">
      <dl className="gift-wallet__totals">
        <div><dt>Начислено</dt><dd>{formatPupsicoins(wallet.earned)}</dd></div>
        <div><dt>Потрачено</dt><dd>{formatPupsicoins(wallet.spent)}</dd></div>
        <div className="gift-wallet__remaining"><dt>Осталось</dt><dd>{formatPupsicoins(wallet.remaining)}</dd></div>
      </dl>
      <p className="gift-wallet__currency">пупсикоинов</p>
    </div>
    <div className="gift-selection__cards">
      {gifts.map((gift, index) => {
        const chosen = purchasedGiftIds.includes(gift.id);
        const shortfall = gift.price - wallet.remaining;
        const unavailable = !chosen && (wallet.earned === 0 || shortfall > 0);
        return <button key={gift.id}
          className={`gift-card${chosen ? ' gift-card--selected' : ''}${unavailable ? ' gift-card--unavailable' : ''}`}
          type="button" disabled={chosen || unavailable} aria-describedby="gift-selection-rules"
          onClick={() => openPurchase(gift.id)}>
          <span className="gift-card__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="gift-card__title">{gift.title}</span>
          <span className="gift-card__price">{formatPupsicoins(gift.price)} <span>пупсикоинов</span></span>
          {chosen && <span className="gift-card__description">{gift.description}</span>}
          <span className="gift-card__state">
            {chosen ? <><span aria-hidden="true">♥</span> Твой подарок</>
              : unavailable ? wallet.earned === 0 ? 'После прохождения игры' : `Не хватает ${formatPupsicoins(shortfall)}`
                : gift.price === 0 ? 'Выбрать бесплатно' : 'Выбрать'}
          </span>
        </button>;
      })}
    </div>
    <div className="gift-selection__summary">
      <p role="status">{purchased.length > 0 ? `Твоих подарков: ${purchased.length}` : 'Выбери то, что откликается.'}</p>
      {purchased.length > 0 && <>
        <p className="gift-selection__saved">{storageStatus === 'unavailable' ? 'Подарки останутся здесь, пока открыта страница.' : 'Подарки сохранены. Можно вернуться к ним позже.'}</p>
        <button className="story-button" type="button" disabled={copyState === 'copying'} onClick={() => { void copySelection(); }}>
          {copyState === 'copying' ? 'Копирую…' : 'Скопировать мои подарки'}
        </button>
        <p className="gift-selection__copy-status" role="status">{copyState === 'copied' ? 'Скопировано. Теперь можно отправить мне в сообщении.' : copyState === 'manual' ? 'Выдели текст ниже и скопируй его, чтобы отправить мне.' : 'Скопируй список и отправь мне в сообщении.'}</p>
        {copyState === 'manual' && <textarea className="gift-selection__fallback" aria-label="Текст купленных подарков" readOnly value={selectionText}
          rows={purchased.length + 5} onFocus={event => event.currentTarget.select()} />}
      </>}
    </div>
    {pendingGift && <GiftPurchaseDialog gift={pendingGift} remaining={wallet.remaining} busy={purchaseBusy}
      unavailableMessage={unavailableMessage} onCancel={closePurchase} onConfirm={() => { void confirmPurchase(); }} />}
  </section>;
}
