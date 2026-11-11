import { useEffect, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from 'react';
import chestBack from '../assets/scene/secret-chest-back.webp';
import { sceneImages } from './assets';
import './rotating-chest.css';

interface RotatingChestProps {
  onPress: () => void;
  artRef: RefObject<HTMLSpanElement | null>;
  rearContent?: ReactNode;
}

interface Gesture {
  pointerId: number;
  x: number;
  y: number;
  angle: number;
  axis: 'pending' | 'horizontal' | 'vertical';
}

export function RotatingChest({ onPress, artRef, rearContent }: RotatingChestProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const gestureRef = useRef<Gesture | null>(null);
  const suppressClickRef = useRef(false);
  const clearClickRef = useRef<number | undefined>(undefined);
  const keyboardFocusRef = useRef(false);
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const backFacing = Math.cos(angle * Math.PI / 180) < 0;

  function turn(next: number) {
    angleRef.current = next;
    setAngle(next);
  }

  function finishGesture(cancelled: boolean) {
    const gesture = gestureRef.current;
    if (!gesture) return;
    gestureRef.current = null;
    if (gesture.axis === 'horizontal') turn(Math.round((cancelled ? gesture.angle : angleRef.current) / 180) * 180);
    setDragging(false);
    // Native click follows pointerup in the same task. A later genuine tap is allowed.
    window.clearTimeout(clearClickRef.current);
    clearClickRef.current = window.setTimeout(() => { suppressClickRef.current = false; }, 0);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary || gestureRef.current) return;
    if (event.target instanceof Element && event.target.closest('dialog')) return;
    window.clearTimeout(clearClickRef.current);
    suppressClickRef.current = false;
    gestureRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, angle: angleRef.current, axis: 'pending' };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || event.pointerId !== gesture.pointerId || gesture.axis === 'vertical') return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    // Movement stops being a tap even while diagonal intent is undecided.
    if (Math.hypot(dx, dy) > 10) suppressClickRef.current = true;
    if (gesture.axis === 'pending') {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        suppressClickRef.current = true;
        gesture.axis = 'vertical';
        return;
      }
      if (Math.abs(dx) <= 10 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
      gesture.axis = 'horizontal';
      suppressClickRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    event.preventDefault();
    turn(gesture.angle + dx / event.currentTarget.clientWidth * 300);
  }

  useEffect(() => () => { window.clearTimeout(clearClickRef.current); }, []);
  useEffect(() => {
    if (!keyboardFocusRef.current) return;
    keyboardFocusRef.current = false;
    const selector = backFacing ? '.chest-orbit__back button' : '.chest-orbit__front';
    groupRef.current?.querySelector<HTMLButtonElement>(selector)?.focus({ preventScroll: true });
  }, [backFacing]);

  return <div ref={groupRef} className={`chest-orbit${dragging ? ' chest-orbit--dragging' : ''}`}
    role="group" aria-label="Сундук на столе" aria-keyshortcuts="ArrowLeft ArrowRight"
    onPointerDown={onPointerDown} onPointerMove={onPointerMove}
    onPointerUp={event => { if (event.pointerId === gestureRef.current?.pointerId) finishGesture(false); }}
    onPointerCancel={event => { if (event.pointerId === gestureRef.current?.pointerId) finishGesture(true); }}
    onPointerLeave={() => { if (gestureRef.current?.axis !== 'horizontal') finishGesture(true); }}
    onLostPointerCapture={() => finishGesture(true)}
    onClickCapture={event => {
      if (suppressClickRef.current) { event.preventDefault(); event.stopPropagation(); }
    }}
    onKeyDown={event => {
      if (event.target instanceof Element && event.target.closest('dialog')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      finishGesture(true);
      keyboardFocusRef.current = true;
      turn(Math.round(angleRef.current / 180) * 180 + (event.key === 'ArrowLeft' ? -180 : 180));
    }}>
    <div className="chest-orbit__turntable" style={{ transform: `rotateY(${angle}deg)` }}>
      <button id="treasure-chest" className="chest chest-orbit__face chest-orbit__front" type="button"
        aria-label="Сундук" aria-describedby="chest-hint chest-turn-instructions" aria-hidden={backFacing} inert={backFacing}
        onClick={event => { event.currentTarget.focus({ preventScroll: true }); onPress(); }}>
        <span className="chest__art" ref={artRef}>
          <img src={sceneImages.chest} alt="" width="840" height="480" draggable="false" />
        </span>
      </button>
      <div className="chest-orbit__face chest-orbit__back" aria-hidden={!backFacing} inert={!backFacing}>
        <img className="chest-orbit__rear-image" src={chestBack} alt="" width="840" height="480" draggable="false" />
        {rearContent}
      </div>
      <span className="chest-orbit__side chest-orbit__side--left" aria-hidden="true" />
      <span className="chest-orbit__side chest-orbit__side--right" aria-hidden="true" />
    </div>
    <span id="chest-turn-instructions" className="chest-orbit__instructions">Чтобы осмотреть сундук, проведи по нему влево или вправо. С клавиатуры используй стрелки влево и вправо.</span>
  </div>;
}
