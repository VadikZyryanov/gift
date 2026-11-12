import { useState } from 'react';
import { useGame } from '../game/GameProvider';
import { ScenePanel } from './ScenePanel';
import { StorageNotice } from './StorageNotice';

export function GameMenu({ onClose }: { onClose: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const { send, storageStatus } = useGame();

  return (
    <ScenePanel title="Маленькие настройки" onBack={onClose} backLabel="Закрыть">
      <StorageNotice />
      {confirming ? (
        <div className="game-menu-content">
          <p>Начать нашу маленькую историю заново?</p>
          <p>Все ключи, ответы, тайны и выбор подарков будут сброшены. Можно просто продолжить с того места, где ты остановилась.</p>
          <button className="story-button story-button--quiet" type="button" onClick={onClose}>Продолжить игру</button>
          <button className="story-button" type="button" onClick={() => {
            send({ type: 'restart' });
            onClose();
          }}>Да, начать заново</button>
        </div>
      ) : (
        <div className="game-menu-content">
          <p>{storageStatus === 'unavailable'
            ? 'Продолжай игру в этой вкладке. Чтобы не потерять находки, пока не закрывай страницу.'
            : 'История сохраняется в этом браузере. Можно закрыть страницу и вернуться позже.'}</p>
          <button className="story-button story-button--quiet" type="button" onClick={() => setConfirming(true)}>Начать заново</button>
        </div>
      )}
    </ScenePanel>
  );
}
