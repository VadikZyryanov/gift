import { useGame } from '../game/GameProvider';

export function StorageNotice() {
  const { storageStatus } = useGame();
  if (storageStatus === 'available') return null;

  return (
    <aside className="storage-notice" role="note" aria-label="Сохранение игры" aria-live="polite">
      {storageStatus === 'unavailable'
        ? 'Можно играть дальше, но сейчас прохождение не сохранится после закрытия страницы.'
        : 'Не удалось восстановить прежнее прохождение. Начнём с чистого листа — новые находки будут сохраняться.'}
    </aside>
  );
}
