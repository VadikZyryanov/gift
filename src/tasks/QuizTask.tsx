import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import type { QuizDraft, QuizTaskDefinition } from '../game/types';
import { TaskImage } from './TaskImage';
import './tasks.css';

interface QuizTaskProps {
  task: QuizTaskDefinition;
  draft: QuizDraft | undefined;
  onDraftChange: (draft: QuizDraft) => void;
  onSolved: () => void;
}

export function QuizTask({ task, draft, onDraftChange, onSolved }: QuizTaskProps) {
  const id = useId();
  const [showHint, setShowHint] = useState(false);
  const questionIndex = Math.max(0, task.questions.findIndex(question => question.id === draft?.questionId));
  const question = task.questions[questionIndex] ?? task.questions[0];
  const selectedId = draft?.selectedId ?? null;
  const confirmed = draft?.confirmed ?? false;
  const legendRef = useRef<HTMLLegendElement>(null);
  const memoryRef = useRef<HTMLElement>(null);
  const previousStep = useRef({ questionId: question.id, confirmed });

  useEffect(() => {
    if (previousStep.current.questionId === question.id && previousStep.current.confirmed === confirmed) return;
    previousStep.current = { questionId: question.id, confirmed };
    const target = confirmed ? memoryRef.current : legendRef.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView?.({ block: 'start' });
  }, [question.id, confirmed]);

  function checkAnswer(event: FormEvent) {
    event.preventDefault();
    if (confirmed) {
      const next = task.questions[questionIndex + 1];
      if (next) {
        setShowHint(false);
        onDraftChange({ kind: 'quiz', questionId: next.id, selectedId: null, confirmed: false });
      } else onSolved();
      return;
    }
    if (selectedId === null) return;
    if (selectedId !== question.correctId) {
      setShowHint(true);
      return;
    }
    setShowHint(false);
    // Persist the final reward in one event: a failed write leaves a retryable answer.
    if (questionIndex === task.questions.length - 1) onSolved();
    else onDraftChange({ kind: 'quiz', questionId: question.id, selectedId, confirmed: true });
  }

  return (
    <form className={`quiz-task${question.questionImage ? ' quiz-task--photo' : ''}`} onSubmit={checkAnswer}>
      <p className="quiz-task__progress">Воспоминание {questionIndex + 1} из {task.questions.length}</p>
      {!confirmed && <fieldset aria-describedby={showHint ? `${id}-feedback` : undefined}>
        <legend ref={legendRef} tabIndex={-1}>{question.question}</legend>
        <p className="quiz-task__invitation">{question.questionImage ? 'Узнаешь, где мы были? Выбери один из четырёх вариантов.' : 'Давай вспомним нашу историю.'}</p>
        {question.questionImage && <div className="quiz-task__picture"><TaskImage {...question.questionImage} /></div>}
        <div className="quiz-task__choices">
          {question.options.map(option => (
            <label key={option.id} className={`quiz-choice${selectedId === option.id ? ' quiz-choice--selected' : ''}`}>
              <input type="radio" name={id} value={option.id} checked={selectedId === option.id} onChange={() => {
                setShowHint(false);
                onDraftChange({ kind: 'quiz', questionId: question.id, selectedId: option.id, confirmed: false });
              }} />
              <span>{option.label}</span>
              <span className="quiz-choice__heart" aria-hidden="true">♡</span>
            </label>
          ))}
        </div>
      </fieldset>}
      {confirmed ? <section className="quiz-memory" ref={memoryRef} tabIndex={-1} aria-label="Наше воспоминание">
        <p id={`${id}-feedback`} className="task-success" role="status">{question.successMessage}</p>
        {question.successImage && <div className="quiz-memory__picture"><TaskImage {...question.successImage} /></div>}
      </section> : <p id={`${id}-feedback`} className={showHint ? 'task-hint' : 'quiz-task__feedback-empty'} role="status">
        {showHint ? question.hint : ''}
      </p>}
      <button className="story-button" type="submit" disabled={selectedId === null}>{confirmed ? 'Дальше' : 'Проверить ответ'}</button>
    </form>
  );
}
