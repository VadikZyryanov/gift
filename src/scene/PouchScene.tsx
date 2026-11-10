import { useState } from 'react';
import { KeyOrnament } from '../components/KeyOrnament';
import { ScenePanel } from '../components/ScenePanel';
import { StorageNotice } from '../components/StorageNotice';
import { gameContent } from '../game/content';
import { useGame } from '../game/GameProvider';
import type { PouchId } from '../game/types';
import { QuizTask } from '../tasks/QuizTask';
import { pouchImages } from './assets';

interface PouchSceneProps {
  pouchId: PouchId;
}

export function PouchScene({ pouchId }: PouchSceneProps) {
  const { progress, send } = useGame();
  const completed = progress.completedPouches.includes(pouchId);
  const [wasCompletedOnOpen] = useState(completed);
  const isFirstTask = pouchId === 'beginning';
  const showReward = isFirstTask && completed;
  const newReward = showReward && !wasCompletedOnOpen;
  const draft = progress.drafts[pouchId];
  const onBack = () => send({ type: 'navigate', scene: { kind: 'table' } });
  const pouch = gameContent.pouches[pouchId];
  return (
    <ScenePanel title={pouch.title} onBack={onBack} returnFocusId={`pouch-${pouchId}`}>
      <StorageNotice />
      <p className="pouch-preview__subtitle">{pouch.subtitle}</p>
      <div className={`pouch-preview__art pouch-preview__art--${pouchId}${isFirstTask ? ' pouch-preview__art--task' : ''}${newReward ? ' pouch-preview__art--opening' : ''}`}>
        <img src={pouchImages[pouchId]} alt="" width="640" height="600" draggable="false" />
      </div>
      {showReward ? (
        <section className={`pouch-reward${newReward ? ' pouch-reward--new' : ''}`} aria-label="Записка и найденный ключ" aria-live="polite">
          <span className="pouch-reward__key" aria-hidden="true"><KeyOrnament /></span>
          <p className="pouch-reward__title">Ключ найден</p>
          <p className="pouch-reward__note">{gameContent.beginning.rewardNote}</p>
          <button className="story-button" type="button" onClick={onBack}>Вернуться на стол</button>
        </section>
      ) : isFirstTask ? (
        <QuizTask
          task={gameContent.beginning.task}
          draft={draft?.kind === 'quiz' ? draft : undefined}
          onDraftChange={(nextDraft) => send({ type: 'save-draft', pouchId, draft: nextDraft })}
          onSolved={() => send({ type: 'complete-pouch', pouchId })}
        />
      ) : (
        <>
          <p className="pouch-preview__description">{pouch.description}</p>
          <div className="pouch-preview__ornament" aria-hidden="true">✧ &nbsp; ♡ &nbsp; ✧</div>
        </>
      )}
    </ScenePanel>
  );
}
