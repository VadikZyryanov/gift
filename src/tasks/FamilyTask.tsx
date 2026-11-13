import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { familyMonths } from '../game/family';
import type { FamilyDateAnswer, FamilyDraft, FamilyMemberId, FamilyTaskDefinition } from '../game/types';
import { FamilyPicture, FamilyTimeline } from './FamilyPicture';
import './tasks.css';
import './family-task.css';

interface FamilyTaskProps {
  task: FamilyTaskDefinition;
  draft: FamilyDraft | undefined;
  onDraftChange: (draft: FamilyDraft) => void;
  onSolved: () => void;
  onPetThomas?: () => (() => void) | undefined;
}

export function FamilyTask({ task, draft, onDraftChange, onSolved, onPetThomas }: FamilyTaskProps) {
  const id = useId();
  const [showHint, setShowHint] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [searchHintId, setSearchHintId] = useState<FamilyMemberId | null>(null);
  const cardRef = useRef<HTMLDialogElement>(null);
  const cardTitleRef = useRef<HTMLParagraphElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const member = task.members.find(item => item.id === draft?.selectedMemberId);
  const answer = member ? draft?.answers[member.id] : undefined;
  const confirmed = answer?.confirmed ?? false;
  const foundIds = task.members.filter(item => draft?.answers[item.id]?.confirmed).map(item => item.id);
  const allFound = foundIds.length === task.members.length;
  const nextMember = task.members.find(item => !foundIds.includes(item.id));
  const searchHintMember = task.members.find(item => item.id === searchHintId && !foundIds.includes(item.id));

  useEffect(() => {
    if (!member || !cardOpen) return;
    const dialog = cardRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, [member, cardOpen]);

  useEffect(() => {
    if (cardOpen) cardTitleRef.current?.focus({ preventScroll: true });
  }, [member, confirmed, cardOpen]);

  function closeCard() {
    cardRef.current?.close();
    setCardOpen(false);
  }

  function selectMember(memberId: FamilyMemberId) {
    setShowHint(false);
    setCardOpen(true);
    onDraftChange({ kind: 'family', selectedMemberId: memberId, answers: draft?.answers ?? {} });
  }

  function changeDate(update: Partial<Pick<FamilyDateAnswer, 'month' | 'year'>>) {
    if (!member || confirmed) return;
    setShowHint(false);
    onDraftChange({
      kind: 'family', selectedMemberId: member.id,
      answers: { ...draft?.answers, [member.id]: { month: answer?.month ?? null, year: answer?.year ?? null, confirmed: false, ...update } },
    });
  }

  function checkAnswer(event: FormEvent) {
    event.preventDefault();
    if (!member || !answer || answer.month === null || answer.year === null || confirmed) return;
    if (answer.month !== member.month || answer.year !== member.year) {
      setShowHint(true);
      return;
    }
    setShowHint(false);
    onDraftChange({ kind: 'family', selectedMemberId: member.id, answers: { ...draft?.answers, [member.id]: { ...answer, confirmed: true } } });
  }

  return <section className="quiz-task family-task" aria-labelledby={`${id}-question`}>
    <h3 className="task-question" id={`${id}-question`}>{task.question}</h3>
    <p className="quiz-task__invitation">{task.caption}</p>
    <FamilyPicture task={task} selectedMemberId={cardOpen ? member?.id : undefined} pausedMemberId={cardOpen ? member?.id : undefined} foundIds={foundIds} onSelect={selectMember} onPetThomas={onPetThomas} />
    <p className="family-task__progress" role="status">{allFound ? 'Все трое на своём месте. Все истории — в нашем сердце.' : `Нашли ${foundIds.length} из ${task.members.length}`}</p>
    {nextMember && <div className="family-search-hint">
      <button type="button" className="family-search-hint__button" onClick={() => setSearchHintId(nextMember.id)}>Подсказка для поиска</button>
      <p className={searchHintMember ? 'task-hint' : 'quiz-task__feedback-empty'} role="status">{searchHintMember?.searchHint ?? ''}</p>
    </div>}
    {member && <dialog className="family-answer-card" ref={cardRef} aria-labelledby={`${id}-member`} onCancel={event => {
      event.preventDefault();
      event.stopPropagation();
      closeCard();
    }}>
      <div className="family-answer-card__top"><span>Одна из наших историй</span><button className="family-answer-card__close" type="button" aria-label="Закрыть карточку и вернуться к поиску" onClick={closeCard}>×</button></div>
      <section className={`family-memory${confirmed ? ' family-memory--found' : ''}`}>
      <p className="family-memory__name" id={`${id}-member`} ref={cardTitleRef} tabIndex={-1}>{member.name}<span aria-hidden="true">{confirmed ? ' ♥' : ' ♡'}</span></p>
      {confirmed ? <>
        <p className="family-memory__message">{member.successMessage}</p>
        <button className="story-button" type="button" onClick={() => {
          closeCard();
          if (allFound) {
            storyRef.current?.focus({ preventScroll: true });
            storyRef.current?.scrollIntoView?.({ block: 'start' });
          }
        }}>{allFound ? 'К нашей семейной истории' : 'Продолжить поиск'}</button>
      </> : <form onSubmit={checkAnswer}>
        <fieldset className="family-date" aria-describedby={showHint ? `${id}-hint` : undefined}>
          <legend>{member.question}</legend>
          <div className="family-date__fields">
            <label htmlFor={`${id}-month`}>Месяц
              <select id={`${id}-month`} value={answer?.month ?? ''} onChange={event => changeDate({ month: event.target.value === '' ? null : Number(event.target.value) })} required>
                <option value="" disabled>Месяц</option>
                {familyMonths.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
              </select>
            </label>
            <label htmlFor={`${id}-year`}>Год
              <select id={`${id}-year`} value={answer?.year ?? ''} onChange={event => changeDate({ year: event.target.value === '' ? null : Number(event.target.value) })} required>
                <option value="" disabled>Год</option>
                {task.years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
          </div>
        </fieldset>
        <p className={showHint ? 'task-hint' : 'quiz-task__feedback-empty'} id={`${id}-hint`} role="status">{showHint ? member.hint : ''}</p>
        <button className="story-button" type="submit" disabled={answer?.month == null || answer?.year == null}>Вспомнить</button>
      </form>}
    </section>
    </dialog>}
    {allFound && <div className="family-story" ref={storyRef} tabIndex={-1}>
      <FamilyTimeline task={task} />
      <button className="story-button" type="button" onClick={onSolved}>Забрать семейный ключ</button>
    </div>}
  </section>;
}
