import { useRef, useState } from 'react';
import { gameContent } from '../game/content';
import { useGame } from '../game/GameProvider';
import type { GiftContent, GiftId } from '../game/types';

const gifts: readonly GiftContent[] = gameContent.gifts.items;

export function GiftSelection() {
  const { progress, send, storageStatus } = useGame();
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle');
  const requestRef = useRef(0);
  const selectedGiftIds = progress.selectedGiftIds ?? [];
  const selected = gifts.filter(gift => selectedGiftIds.includes(gift.id));
  const selectionText = `Мой выбор подарков:\n${selected.map(gift => `• ${gift.title}`).join('\n')}`;

  function toggleGift(giftId: GiftId) {
    requestRef.current++;
    setCopyState('idle');
    send({ type: 'toggle-gift', giftId });
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
    <p className="finale-page__eyebrow">Маленькие желания</p>
    <h3 id="gift-selection-title" className="gift-selection__title">Что тебя порадует?</h3>
    <p className="gift-selection__intro">Выбери всё, что хочется. Свой выбор можно изменить.</p>
    {gameContent.gifts.status === 'draft' && <p className="content-draft">Примерный список — настоящие подарки ещё появятся здесь.</p>}
    <div className="gift-selection__cards">
      {gifts.map((gift, index) => {
        const chosen = selectedGiftIds.includes(gift.id);
        return <button key={gift.id} className={`gift-card${chosen ? ' gift-card--selected' : ''}`} type="button"
          aria-pressed={chosen} onClick={() => toggleGift(gift.id)}>
          <span className="gift-card__number" aria-hidden="true">0{index + 1}</span>
          <span className="gift-card__title">{gift.title}</span>
          <span className="gift-card__description">{gift.description}</span>
          <span className="gift-card__state"><span aria-hidden="true">{chosen ? '♥' : '+'}</span> {chosen ? 'Выбрано' : 'Хочу'}</span>
        </button>;
      })}
    </div>
    <div className="gift-selection__summary">
      <p role="status">{selected.length > 0 ? `Выбрано подарков: ${selected.length}` : 'Выбери то, что откликается.'}</p>
      {selected.length > 0 && <>
        <p className="gift-selection__saved">{storageStatus === 'unavailable' ? 'Выбор останется здесь, пока открыта страница.' : 'Выбор сохранён. Можно вернуться к нему позже.'}</p>
        <button className="story-button" type="button" disabled={copyState === 'copying'} onClick={() => { void copySelection(); }}>
          {copyState === 'copying' ? 'Копирую…' : 'Скопировать мой выбор'}
        </button>
        <p className="gift-selection__copy-status" role="status">{copyState === 'copied' ? 'Скопировано. Теперь можно отправить мне в сообщении.' : copyState === 'manual' ? 'Выдели текст ниже и скопируй его, чтобы отправить мне.' : 'Скопируй список и отправь мне в сообщении.'}</p>
        {copyState === 'manual' && <textarea className="gift-selection__fallback" aria-label="Текст выбранных подарков" readOnly value={selectionText}
          rows={selected.length + 2} onFocus={event => event.currentTarget.select()} />}
      </>}
    </div>
  </section>;
}
