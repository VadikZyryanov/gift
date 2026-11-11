import { createPortal } from 'react-dom';
import { ScenePanel } from '../components/ScenePanel';
import { StorageNotice } from '../components/StorageNotice';
import { gameContent } from '../game/content';
import type { SecretId } from '../game/types';
import { TaskImage } from '../tasks/TaskImage';

export function SecretNote({ secretId, isNew, onClose }: { secretId: SecretId; isNew: boolean; onClose: () => void }) {
  const secret = gameContent.secrets[secretId];
  return createPortal(<ScenePanel title={secret.title} onBack={onClose} backLabel="К предмету" returnFocusId={`secret-${secretId}`}>
    <StorageNotice />
    <p className="secret-note__caption">{isNew ? 'Ты нашла маленькую тайну' : 'Твоя маленькая находка'}</p>
    <div className={`secret-note__illustration secret-note__illustration--${secretId}${isNew ? ' secret-note__illustration--new' : ''}`}>
      <TaskImage {...secret.image} />
      {isNew && <span className="secret-note__sparkles" aria-hidden="true">✧ ♡ ✧</span>}
    </div>
    <p className="secret-note__text">{secret.text}</p>
    <p className="secret-note__signature">С любовью. Для тебя.</p>
  </ScenePanel>, document.body);
}
