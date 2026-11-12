import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { formatFamilyDate } from '../game/family';
import type { FamilyMemberId, FamilyTaskDefinition } from '../game/types';
import './family-task.css';

interface FamilyPictureProps {
  task: FamilyTaskDefinition;
  foundIds: readonly FamilyMemberId[];
  selectedMemberId?: FamilyMemberId | null;
  onSelect?: (memberId: FamilyMemberId) => void;
  pausedMemberId?: FamilyMemberId;
}

export function FamilyPicture({ task, foundIds, selectedMemberId, onSelect, pausedMemberId }: FamilyPictureProps) {
  const id = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const gesture = useRef({ x: 0, y: 0, scrollLeft: 0, moved: false });
  const [pan, setPan] = useState({ position: 0, fraction: 1 });
  const [failedRoom, setFailedRoom] = useState<string | null>(null);
  const [failedSprites, setFailedSprites] = useState<string | null>(null);
  const missingArt = failedRoom === task.image.src || task.members.some(member => failedSprites === member.sprites.image.src);

  function updatePan() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    setPan({ position: maxScroll > 0 ? Math.max(0, Math.min(1, viewport.scrollLeft / maxScroll)) : 0, fraction: Math.min(1, viewport.clientWidth / viewport.scrollWidth) });
  }

  useEffect(() => {
    if (missingArt) return;
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return;
    const observer = new ResizeObserver(updatePan);
    observer.observe(viewport);
    observer.observe(world);
    return () => observer.disconnect();
  }, [missingArt]);

  function movePan(direction: -1 | 1) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({ left: direction * viewport.clientWidth * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function handlePanKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      movePan(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.scrollTo({ left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth });
    }
  }

  return <div className={`family-picture${missingArt ? ' family-picture--missing' : ''}`}>
    <div className="family-picture__viewport" ref={viewportRef} role="region" aria-label="Панорама нашей комнаты"
      aria-describedby={missingArt ? undefined : `${id}-pan-help`} tabIndex={missingArt ? undefined : 0} onScroll={updatePan} onKeyDown={handlePanKey}
      onPointerDownCapture={event => {
        gesture.current = { x: event.clientX, y: event.clientY, scrollLeft: event.currentTarget.scrollLeft, moved: false };
      }} onPointerMoveCapture={event => {
        if (!event.buttons) return;
        const dx = event.clientX - gesture.current.x;
        const dy = event.clientY - gesture.current.y;
        if (Math.hypot(dx, dy) > 8) gesture.current.moved = true;
        if (event.pointerType === 'mouse' && gesture.current.moved) {
          event.currentTarget.scrollLeft = gesture.current.scrollLeft - dx;
          event.preventDefault();
        }
      }} onPointerCancel={() => { gesture.current.moved = true; }}>
    <div className="family-picture__world" ref={worldRef}>
    {!missingArt && <img className="family-picture__room" src={task.image.src} alt={task.image.alt}
      width={task.image.width} height={task.image.height} draggable="false" onError={() => setFailedRoom(task.image.src)} />}
    {missingArt && <p className="family-picture__missing">Картинка отдыхает, а наша история всё равно здесь.</p>}
    <div className="family-picture__characters" role="group" aria-label={onSelect ? 'Найди героев нашей семьи' : 'Наша семья'}>
      {task.members.map(member => {
        const found = foundIds.includes(member.id);
        const sprites = member.sprites;
        const style: CSSProperties & { '--family-frame-transform': string } = {
          left: `${member.x}%`, top: `${member.y}%`, width: `${member.width}%`,
          '--family-frame-transform': sprites.rows === 2 ? 'translateY(-50%)' : 'translateX(-50%)',
        };
        const content = <>
          {!missingArt && <span className="family-character__sprite" aria-hidden="true">
            <img src={sprites.image.src} alt="" width={sprites.image.width} height={sprites.image.height} draggable="false"
              style={{ left: `${-100 * member.spriteColumn}%`, width: `${100 * sprites.columns}%`, height: `${100 * sprites.rows}%` }} onError={() => setFailedSprites(sprites.image.src)} />
          </span>}
          {(missingArt || found || selectedMemberId === member.id) && <span className="family-character__tag">
            <span>{found && <span className="family-character__heart" aria-hidden="true">♥ </span>}{member.name}</span>
            {found && <span className="family-character__date">{formatFamilyDate(member.month, member.year)}</span>}
          </span>}
        </>;
        const className = `family-character family-character--${member.id}${found ? ' family-character--found' : ''}${selectedMemberId === member.id ? ' family-character--selected' : ''}${pausedMemberId === member.id ? ' family-character--paused' : ''}`;
        return onSelect ? <button key={member.id} className={className} style={style} type="button"
          aria-label={`${member.name}${found ? ', дата найдена' : ''}`} aria-pressed={selectedMemberId === member.id}
          onFocus={event => {
            if (!missingArt && event.currentTarget.matches(':focus-visible')) event.currentTarget.scrollIntoView?.({ block: 'nearest', inline: 'center' });
          }} onClick={event => {
            if (event.detail !== 0 && gesture.current.moved) return;
            onSelect(member.id);
          }}>
          {content}
        </button> : <div key={member.id} className={className} style={style}>{content}</div>;
      })}
    </div>
    </div>
    </div>
    {!missingArt && <div className="family-pan-controls">
      <button type="button" className="family-pan-controls__arrow" aria-label="Осмотреть комнату слева" disabled={pan.position <= .001} onClick={() => movePan(-1)}>←</button>
      <div className="family-pan-controls__middle">
        <p id={`${id}-pan-help`}>Двигай картинку, чтобы осмотреться</p>
        <div className="family-pan-controls__track" aria-hidden="true"><span style={{ width: `${pan.fraction * 100}%`, left: `${pan.position * (1 - pan.fraction) * 100}%` }} /></div>
      </div>
      <button type="button" className="family-pan-controls__arrow" aria-label="Осмотреть комнату справа" disabled={pan.fraction >= 1 || pan.position >= .999} onClick={() => movePan(1)}>→</button>
    </div>}
  </div>;
}

export function FamilyTimeline({ task }: { task: FamilyTaskDefinition }) {
  return <section className="family-timeline" aria-label="Как росла наша семья">
    <h4 className="family-timeline__title">И дома стало больше любви</h4>
    <ol className="family-timeline__list">
      {task.members.map(member => <li key={member.id}>
        <span className="family-timeline__heart" aria-hidden="true">♥</span>
        <span><span className="family-timeline__date">{formatFamilyDate(member.month, member.year)}</span><span className="family-timeline__name">{member.name}</span></span>
      </li>)}
    </ol>
  </section>;
}
