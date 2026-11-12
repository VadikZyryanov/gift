import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyOrnament } from '../components/KeyOrnament';
import { ScenePanel } from '../components/ScenePanel';
import { StorageNotice } from '../components/StorageNotice';
import { gameContent } from '../game/content';
import { useGame } from '../game/GameProvider';
import { canOpenChest } from '../game/progress';
import type { PouchId, TaskDraft } from '../game/types';
import { FamilyTask } from '../tasks/FamilyTask';
import { FamilyPicture, FamilyTimeline } from '../tasks/FamilyPicture';
import { PhraseTask } from '../tasks/PhraseTask';
import { QuizTask } from '../tasks/QuizTask';
import { TaskImage } from '../tasks/TaskImage';
import { pouchImages } from './assets';
import { SecretSpot } from '../secrets/SecretSpot';
import { secretImages } from '../secrets/assets';
import { KitKatFlight } from './KitKatFlight';

interface PouchSceneProps {
  pouchId: PouchId;
  onBack: () => void;
}

export function PouchScene({ pouchId, onBack }: PouchSceneProps) {
  const { progress, send } = useGame();
  const completed = progress.completedPouches.includes(pouchId);
  const [wasCompletedOnOpen] = useState(completed);
  const [celebrating, setCelebrating] = useState(false);
  const finishCelebration = useCallback(() => setCelebrating(false), []);
  const rewardRef = useRef<HTMLParagraphElement>(null);
  const showReward = completed && !celebrating;
  const newReward = showReward && !wasCompletedOnOpen;
  const draft = progress.drafts[pouchId];
  const pouch = gameContent.pouches[pouchId];
  const task = pouch.task;
  const callbacks = {
    onDraftChange: (nextDraft: TaskDraft) => send({ type: 'save-draft', pouchId, draft: nextDraft }),
    onSolved: () => {
      if (pouchId === 'beginning') setCelebrating(true);
      send({ type: 'complete-pouch', pouchId });
    },
  };

  useEffect(() => {
    if (!newReward) return;
    rewardRef.current?.focus({ preventScroll: true });
    rewardRef.current?.scrollIntoView?.({ block: 'nearest' });
  }, [newReward]);

  function renderTask() {
    switch (task.kind) {
      case 'quiz': return <QuizTask task={task} draft={draft?.kind === 'quiz' ? draft : undefined} {...callbacks} />;
      case 'phrase': return <PhraseTask task={task} draft={draft?.kind === 'phrase' ? draft : undefined} {...callbacks} />;
      case 'family': return <FamilyTask task={task} draft={draft?.kind === 'family' ? draft : undefined} {...callbacks} />;
    }
  }
  return (
    <ScenePanel title={pouch.title} onBack={onBack} returnFocusId={`pouch-${pouchId}`} entrance={pouchId === 'beginning' || pouchId === 'journey' ? 'heart' : undefined} layout={pouchId === 'family' ? 'panorama' : undefined}>
      <StorageNotice />
      {pouchId !== 'family' && <><p className="pouch-preview__subtitle">{pouch.subtitle}</p>
      <div className={`pouch-preview__art pouch-preview__art--${pouchId} pouch-preview__art--task${newReward ? ' pouch-preview__art--opening' : ''}`}>
        {pouchId === 'proposal' && <SecretSpot secretId="green-dress" label="Край открытки" className="secret-spot--dress">
          <span className="secret-spot__postcard"><img src={secretImages.dress} alt="" width="512" height="768" draggable="false" /></span>
        </SecretSpot>}
        <img src={pouchImages[pouchId]} alt="" width="640" height="600" draggable="false" />
      </div></>}
      {showReward ? (
        <section className={`pouch-reward${pouchId === 'family' ? ' pouch-reward--family' : ''}${newReward ? ' pouch-reward--new' : ''}`} aria-label="Записка и найденный ключ" aria-live="polite">
          <span className="pouch-reward__key" aria-hidden="true"><KeyOrnament /></span>
          <p className="pouch-reward__title" ref={rewardRef} tabIndex={-1}>Ключ найден</p>
          <p className="pouch-reward__note">{pouch.rewardNote}</p>
          {task.kind === 'family' && <>
            <FamilyPicture task={task} foundIds={task.members.map(member => member.id)} />
            <FamilyTimeline task={task} />
          </>}
          {pouchId === 'proposal' && <article className="proposal-letter" aria-label={gameContent.proposalLetter.title}>
            <figure className="proposal-letter__photo">
              <TaskImage {...gameContent.proposalLetter.image} />
              <figcaption className="proposal-letter__date">{gameContent.proposalLetter.date}</figcaption>
            </figure>
            <div className="proposal-letter__body">
              <h3 className="proposal-letter__title">{gameContent.proposalLetter.title}</h3>
              {gameContent.proposalLetter.stanzas.map(stanza => <p className="proposal-letter__stanza" key={stanza}>{stanza}</p>)}
            </div>
          </article>}
          <button className="story-button" type="button" onClick={onBack}>{canOpenChest(progress) && !progress.chestOpened ? 'К сундуку' : 'Вернуться на стол'}</button>
        </section>
      ) : celebrating && task.kind === 'quiz' ? (
        <KitKatFlight message={task.questions[task.questions.length - 1].successMessage} onComplete={finishCelebration} />
      ) : renderTask()}
    </ScenePanel>
  );
}
