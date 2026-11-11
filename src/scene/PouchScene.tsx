import { useState } from 'react';
import { KeyOrnament } from '../components/KeyOrnament';
import { ScenePanel } from '../components/ScenePanel';
import { StorageNotice } from '../components/StorageNotice';
import { gameContent } from '../game/content';
import { useGame } from '../game/GameProvider';
import type { PouchId, TaskDraft } from '../game/types';
import { DetailTask } from '../tasks/DetailTask';
import { PhotoTask } from '../tasks/PhotoTask';
import { PhraseTask } from '../tasks/PhraseTask';
import { QuizTask } from '../tasks/QuizTask';
import { pouchImages } from './assets';
import { SecretSpot } from '../secrets/SecretSpot';
import { secretImages } from '../secrets/assets';

interface PouchSceneProps {
  pouchId: PouchId;
}

export function PouchScene({ pouchId }: PouchSceneProps) {
  const { progress, send } = useGame();
  const completed = progress.completedPouches.includes(pouchId);
  const [wasCompletedOnOpen] = useState(completed);
  const showReward = completed;
  const newReward = showReward && !wasCompletedOnOpen;
  const draft = progress.drafts[pouchId];
  const onBack = () => send({ type: 'navigate', scene: { kind: 'table' } });
  const pouch = gameContent.pouches[pouchId];
  const task = pouch.task;
  const callbacks = {
    onDraftChange: (nextDraft: TaskDraft) => send({ type: 'save-draft', pouchId, draft: nextDraft }),
    onSolved: () => send({ type: 'complete-pouch', pouchId }),
  };

  function renderTask() {
    switch (task.kind) {
      case 'quiz': return <QuizTask task={task} draft={draft?.kind === 'quiz' ? draft : undefined} {...callbacks} />;
      case 'photo': return <PhotoTask task={task} draft={draft?.kind === 'photo' ? draft : undefined} {...callbacks} />;
      case 'phrase': return <PhraseTask task={task} draft={draft?.kind === 'phrase' ? draft : undefined} {...callbacks} />;
      case 'detail': return <DetailTask task={task} draft={draft?.kind === 'detail' ? draft : undefined} {...callbacks} />;
    }
  }
  return (
    <ScenePanel title={pouch.title} onBack={onBack} returnFocusId={`pouch-${pouchId}`}>
      <StorageNotice />
      <p className="pouch-preview__subtitle">{pouch.subtitle}</p>
      <div className={`pouch-preview__art pouch-preview__art--${pouchId} pouch-preview__art--task${newReward ? ' pouch-preview__art--opening' : ''}`}>
        {pouchId === 'proposal' && <SecretSpot secretId="green-dress" label="Край открытки" className="secret-spot--dress">
          <span className="secret-spot__postcard"><img src={secretImages.dress} alt="" width="512" height="768" draggable="false" /></span>
        </SecretSpot>}
        <img src={pouchImages[pouchId]} alt="" width="640" height="600" draggable="false" />
      </div>
      {showReward ? (
        <section className={`pouch-reward${newReward ? ' pouch-reward--new' : ''}`} aria-label="Записка и найденный ключ" aria-live="polite">
          <span className="pouch-reward__key" aria-hidden="true"><KeyOrnament /></span>
          <p className="pouch-reward__title">Ключ найден</p>
          <p className="pouch-reward__note">{pouch.rewardNote}</p>
          <button className="story-button" type="button" onClick={onBack}>Вернуться на стол</button>
        </section>
      ) : renderTask()}
    </ScenePanel>
  );
}
