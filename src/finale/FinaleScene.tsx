import { ScenePanel } from '../components/ScenePanel';
import { StorageNotice } from '../components/StorageNotice';
import { useGame } from '../game/GameProvider';

export function FinaleScene() {
  const { send } = useGame();
  const onBack = () => send({ type: 'navigate', scene: { kind: 'table' } });
  return <ScenePanel title="У этой истории есть продолжение" onBack={onBack} returnFocusId="treasure-chest">
    <StorageNotice />
    <div className="finale-keepsake" aria-hidden="true"><span>♡</span></div>
    <p className="finale-handwriting">Самый любимый человек — ты.</p>
    <p className="finale-copy">Все четыре маленькие истории уже здесь. А к письму можно возвращаться столько, сколько захочется.</p>
    <p className="content-draft">Здесь появится твой подарочный лист. Его мы составим отдельно, когда вся история будет готова.</p>
    <button className="story-button" type="button" onClick={() => send({ type: 'open-letter' })}>Перечитать письмо</button>
    <button className="story-button story-button--quiet" type="button" onClick={onBack}>Вернуться на стол</button>
  </ScenePanel>;
}
