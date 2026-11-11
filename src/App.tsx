import { useState } from 'react';
import { AudioProvider, useAudio } from './audio/AudioProvider';
import { SoundToggle } from './audio/SoundToggle';
import { ChestScene } from './finale/ChestScene';
import { LetterScene } from './finale/LetterScene';
import { FinaleScene } from './finale/FinaleScene';
import { GameMenu } from './components/GameMenu';
import { StorageNotice } from './components/StorageNotice';
import { GameProvider, useGame } from './game/GameProvider';
import { PouchScene } from './scene/PouchScene';
import { TableScene } from './scene/TableScene';
import { SecretSpot } from './secrets/SecretSpot';
import { secretImages } from './secrets/assets';
import './scene/scene.css';
import './finale/finale.css';
import './secrets/secrets.css';

function Game() {
  const { progress, send } = useGame();
  const { playEffect } = useAudio();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {progress.scene.kind === 'table' && !menuOpen && <StorageNotice />}
      <TableScene
        completedPouches={progress.completedPouches}
        onOpenPouch={pouchId => {
          send({ type: 'navigate', scene: { kind: 'pouch', pouchId } });
          if (pouchId === 'beginning' || pouchId === 'journey') playEffect('paper');
        }}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenChest={() => { send({ type: 'open-chest' }); playEffect('unlock'); }}
        soundControl={<SoundToggle />}
        flowerSecret={<SecretSpot secretId="white-bueno" label="Белая обёртка" className="secret-spot--bueno">
          <img src={secretImages.bueno} alt="" width="640" height="426" draggable="false" />
        </SecretSpot>}
        chestRear={<SecretSpot secretId="black-g-class" label="Наклейка с чёрной машиной" className="secret-spot--car">
          <img src={secretImages.car} alt="" width="640" height="426" draggable="false" />
        </SecretSpot>}
      />
      {progress.scene.kind === 'pouch' && <PouchScene key={progress.scene.pouchId} pouchId={progress.scene.pouchId} />}
      {progress.scene.kind === 'chest' && <ChestScene />}
      {progress.scene.kind === 'letter' && <LetterScene />}
      {progress.scene.kind === 'finale' && <FinaleScene />}
      {menuOpen && <GameMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}

export default function App() {
  return <GameProvider><AudioProvider><Game /></AudioProvider></GameProvider>;
}
