import { useState } from 'react';
import { GameMenu } from './components/GameMenu';
import { StorageNotice } from './components/StorageNotice';
import { GameProvider, useGame } from './game/GameProvider';
import { PouchScene } from './scene/PouchScene';
import { TableScene } from './scene/TableScene';
import './scene/scene.css';

function Game() {
  const { progress, send } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {progress.scene.kind !== 'pouch' && !menuOpen && <StorageNotice />}
      <TableScene
        completedPouches={progress.completedPouches}
        onOpenPouch={pouchId => send({ type: 'navigate', scene: { kind: 'pouch', pouchId } })}
        onOpenMenu={() => setMenuOpen(true)}
      />
      {progress.scene.kind === 'pouch' && <PouchScene key={progress.scene.pouchId} pouchId={progress.scene.pouchId} />}
      {menuOpen && <GameMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}

export default function App() {
  return <GameProvider><Game /></GameProvider>;
}
