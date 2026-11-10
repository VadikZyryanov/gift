import { useId, useState, type FormEvent } from 'react';
import type { PhotoDraft, PhotoTaskDefinition } from '../game/types';
import { TaskImage } from './TaskImage';
import './tasks.css';

interface PhotoTaskProps {
  task: PhotoTaskDefinition;
  draft: PhotoDraft | undefined;
  onDraftChange: (draft: PhotoDraft) => void;
  onSolved: () => void;
}

export function PhotoTask({ task, draft, onDraftChange, onSolved }: PhotoTaskProps) {
  const id = useId();
  const [showHint, setShowHint] = useState(false);
  const selectedId = draft?.selectedId ?? null;

  function checkAnswer(event: FormEvent) {
    event.preventDefault();
    if (selectedId === null) return;
    if (selectedId === task.correctId) onSolved();
    else setShowHint(true);
  }

  return (
    <form className="quiz-task photo-task" onSubmit={checkAnswer}>
      <fieldset aria-describedby={`${id}-caption${showHint ? ` ${id}-feedback` : ''}`}>
        <legend>{task.question}</legend>
        <p className="quiz-task__invitation" id={`${id}-caption`}>{task.caption}</p>
        <div className="photo-task__choices">
          {task.options.map(option => (
            <label key={option.id} className={`photo-choice${selectedId === option.id ? ' photo-choice--selected' : ''}`}>
              <input type="radio" name={id} aria-label={option.label} checked={selectedId === option.id} onChange={() => {
                setShowHint(false);
                onDraftChange({ kind: 'photo', selectedId: option.id });
              }} />
              <TaskImage {...option.image} />
              <span className="photo-choice__label">{option.label}<span aria-hidden="true">{selectedId === option.id ? '♥' : '♡'}</span></span>
            </label>
          ))}
        </div>
      </fieldset>
      <p id={`${id}-feedback`} className={showHint ? 'task-hint' : 'quiz-task__feedback-empty'} role="status">{showHint ? task.hint : ''}</p>
      <button className="story-button" type="submit" disabled={selectedId === null}>Проверить ответ</button>
    </form>
  );
}
