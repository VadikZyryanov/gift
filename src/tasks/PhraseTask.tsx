import { useId, useState, type FormEvent } from 'react';
import type { PhraseDraft, PhraseTaskDefinition } from '../game/types';
import './tasks.css';

interface PhraseTaskProps {
  task: PhraseTaskDefinition;
  draft: PhraseDraft | undefined;
  onDraftChange: (draft: PhraseDraft) => void;
  onSolved: () => void;
}

export function PhraseTask({ task, draft, onDraftChange, onSolved }: PhraseTaskProps) {
  const id = useId();
  const [showHint, setShowHint] = useState(false);
  const selectedIds = draft?.selectedWordIds ?? [];

  function updateWords(ids: string[]) {
    setShowHint(false);
    onDraftChange({ kind: 'phrase', selectedWordIds: ids });
  }

  function checkAnswer(event: FormEvent) {
    event.preventDefault();
    if (selectedIds.length === 0) return;
    if (selectedIds.length === task.answerIds.length && selectedIds.every((wordId, index) => wordId === task.answerIds[index])) onSolved();
    else setShowHint(true);
  }

  return (
    <form className="quiz-task phrase-task" onSubmit={checkAnswer} aria-labelledby={`${id}-question`}>
      <h3 className="task-question" id={`${id}-question`}>{task.question}</h3>
      <p className="quiz-task__invitation">{task.caption}</p>
      <div className="phrase-task__paper">
        <ol className="phrase-task__line" aria-label="Собранная фраза" aria-live="polite">
          {selectedIds.map((wordId, index) => (
            <li key={wordId}>
              <button className="phrase-word phrase-word--chosen" type="button" aria-label={`Убрать слово ${index + 1}: ${task.words.find(word => word.id === wordId)?.label}`} onClick={() => updateWords(selectedIds.filter(other => other !== wordId))}>
                {task.words.find(word => word.id === wordId)?.label}
              </button>
            </li>
          ))}
        </ol>
        {selectedIds.length === 0 && <p className="phrase-task__placeholder">Здесь появится то самое пожелание</p>}
        <button className="phrase-task__clear" type="button" disabled={selectedIds.length === 0} onClick={() => updateWords([])}>Очистить фразу</button>
      </div>
      <div className="phrase-task__words" role="group" aria-label="Слова для фразы">
        {task.words.map(word => (
          <button key={word.id} className="phrase-word" type="button" aria-label={`Добавить слово «${word.label}»`} disabled={selectedIds.includes(word.id)} onClick={() => {
            if (!selectedIds.includes(word.id)) updateWords([...selectedIds, word.id]);
          }}>{word.label}</button>
        ))}
      </div>
      <p className={showHint ? 'task-hint' : 'quiz-task__feedback-empty'} role="status">{showHint ? task.hint : ''}</p>
      <button className="story-button" type="submit" disabled={selectedIds.length === 0}>Проверить фразу</button>
    </form>
  );
}
