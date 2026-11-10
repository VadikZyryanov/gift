import { useState } from 'react';
import type { PouchId } from './game/types';
import { PouchScene } from './scene/PouchScene';
import { TableScene } from './scene/TableScene';
import './scene/scene.css';

export default function App() {
  const [selectedPouch, setSelectedPouch] = useState<PouchId | null>(null);

  return (
    <>
      <TableScene completedPouches={[]} onOpenPouch={setSelectedPouch} onOpenChest={() => {}} />
      {selectedPouch && <PouchScene pouchId={selectedPouch} onBack={() => setSelectedPouch(null)} />}
    </>
  );
}
