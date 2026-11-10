import { ScenePanel } from '../components/ScenePanel';
import { gameContent } from '../game/content';
import type { PouchId } from '../game/types';
import { pouchImages } from './assets';

interface PouchSceneProps {
  pouchId: PouchId;
  onBack: () => void;
}

export function PouchScene({ pouchId, onBack }: PouchSceneProps) {
  const pouch = gameContent.pouches[pouchId];
  return (
    <ScenePanel title={pouch.title} onBack={onBack}>
      <p className="pouch-preview__subtitle">{pouch.subtitle}</p>
      <div className={`pouch-preview__art pouch-preview__art--${pouchId}`}><img src={pouchImages[pouchId]} alt="" width="640" height="600" draggable="false" /></div>
      <p className="pouch-preview__description">{pouch.description}</p>
      <div className="pouch-preview__ornament" aria-hidden="true">✧ &nbsp; ♡ &nbsp; ✧</div>
    </ScenePanel>
  );
}
