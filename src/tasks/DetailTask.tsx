import { useId, useState } from 'react';
import type { DetailDraft, DetailTaskDefinition } from '../game/types';
import './tasks.css';

interface DetailTaskProps {
  task: DetailTaskDefinition;
  draft: DetailDraft | undefined;
  onDraftChange: (draft: DetailDraft) => void;
  onSolved: () => void;
}

export function DetailTask({ task, draft, onDraftChange, onSolved }: DetailTaskProps) {
  const id = useId();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageFailed = failedSrc === task.image.src;
  const inspectedIds = draft?.inspectedIds ?? [];
  const showHint = inspectedIds.some(spotId => spotId !== task.targetId);

  return (
    <section className="quiz-task detail-task" aria-labelledby={`${id}-question`}>
      <h3 className="task-question" id={`${id}-question`}>{task.question}</h3>
      <p className="quiz-task__invitation">{task.caption}</p>
      <div className={`detail-task__picture${imageFailed ? ' detail-task__picture--missing' : ''}`}>
        {imageFailed ? <p className="task-image--missing">Иллюстрация недоступна</p> : (
          <img className="task-image" src={task.image.src} alt={task.image.alt} width="800" height="600" draggable="false" onError={() => setFailedSrc(task.image.src)} />
        )}
        <div className="detail-task__spots" role="group" aria-label="Детали семейной иллюстрации">
          {task.spots.map((spot, index) => (
            <button key={spot.id} type="button" className="detail-spot" style={imageFailed ? undefined : { left: `${spot.x}%`, top: `${spot.y}%` }} aria-label={spot.label} aria-pressed={inspectedIds.includes(spot.id)} onClick={() => {
              // Completion is one persisted event, before the reward animation.
              if (spot.id === task.targetId) onSolved();
              else if (!inspectedIds.includes(spot.id)) onDraftChange({ kind: 'detail', inspectedIds: [...inspectedIds, spot.id] });
            }}>
              {imageFailed ? spot.label : <span aria-hidden="true">{index + 1}</span>}
            </button>
          ))}
        </div>
      </div>
      <p className={showHint ? 'task-hint' : 'quiz-task__feedback-empty'} role="status">{showHint ? task.hint : ''}</p>
    </section>
  );
}
