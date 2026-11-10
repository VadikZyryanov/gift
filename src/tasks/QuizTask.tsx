import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import type { QuizDraft, QuizTaskDefinition } from '../game/types';
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
  const previousQuestionId = useRef(question.id);

  useEffect(() => {
    if (previousQuestionId.current === question.id) return;
    previousQuestionId.current = question.id;
    legendRef.current?.focus({ preventScroll: true });
    legendRef.current?.scrollIntoView?.({ block: 'nearest' });
  }, [question.id]);

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
    <form className="quiz-task" onSubmit={checkAnswer}>
      <p className="quiz-task__progress">Воспоминание {questionIndex + 1} из {task.questions.length}</p>
      <fieldset disabled={confirmed} aria-describedby={showHint || confirmed ? `${id}-feedback` : undefined}>
        <legend ref={legendRef} tabIndex={-1}>{question.question}</legend>
        <p className="quiz-task__invitation">Давай вспомним нашу историю.</p>
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
      </fieldset>
      <p id={`${id}-feedback`} className={confirmed ? 'task-success' : showHint ? 'task-hint' : 'quiz-task__feedback-empty'} role="status">
        {confirmed ? question.successMessage : showHint ? question.hint : ''}
      </p>
      <button className="story-button" type="submit" disabled={selectedId === null}>{confirmed ? 'Дальше' : 'Проверить ответ'}</button>
    </form>
  );
}
