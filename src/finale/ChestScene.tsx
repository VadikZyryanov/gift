import { useAudio } from '../audio/AudioProvider';
import { ScenePanel } from '../components/ScenePanel';
import { StorageNotice } from '../components/StorageNotice';
import { useGame } from '../game/GameProvider';
import chestOpen from '../assets/scene/chest-open.webp';
import envelope from '../assets/scene/envelope.webp';

export function ChestScene() {
  const { send } = useGame();
  const { playEffect, stopVoice } = useAudio();
  return <ScenePanel title="Самое тёплое — внутри" onBack={() => {
    stopVoice();
    send({ type: 'navigate', scene: { kind: 'table' } });
  }} returnFocusId="treasure-chest">
    <StorageNotice />
    <div className="chest-reveal" aria-hidden="true">
      <span className="chest-reveal__glow" />
      <img className="chest-reveal__chest" src={chestOpen} alt="" width="840" height="560" draggable="false" />
    </div>
    <p className="finale-handwriting">Четыре ключа. И кое-что только для тебя.</p>
    <button className="envelope-button" type="button" onClick={() => {
      send({ type: 'open-letter' });
      playEffect('paper');
    }}>
      <img src={envelope} alt="" width="640" height="426" draggable="false" />
      <span>Открыть письмо</span>
    </button>
  </ScenePanel>;
}
