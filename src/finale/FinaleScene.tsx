import { FinaleLayout } from './FinaleLayout';
import { StorageNotice } from '../components/StorageNotice';
import { useGame } from '../game/GameProvider';
import { gameContent } from '../game/content';
import { secretIds } from '../game/types';
import { GiftSelection } from './GiftSelection';
import { useAudio } from '../audio/AudioProvider';

export function FinaleScene() {
  const { progress, send } = useGame();
  const { stopEffects } = useAudio();
  const found = secretIds.filter(id => progress.foundSecrets.includes(id));
  const onBack = () => {
    stopEffects();
    send({ type: 'navigate', scene: { kind: 'table' } });
  };
  return <FinaleLayout title="У этой истории есть продолжение" onBack={onBack}>
    <StorageNotice />
    <GiftSelection />
    <section className="secret-results" aria-label="Найденные маленькие тайны">
      <p className="secret-results__count" role="status">Маленькие тайны: {found.length} из {secretIds.length}</p>
      <div className="secret-results__collection">
        {secretIds.map(id => <div key={id} className="secret-results__item">
          {found.includes(id) ? <>
            <img src={gameContent.secrets[id].image.src} alt="" width="160" height="160" />
            <span>{id === 'black-g-class' ? 'Чёрный Гелик' : id === 'green-dress' ? 'Зелёное платье' : 'Белый Bueno'}</span>
          </> : <><span className="secret-results__unknown" aria-hidden="true">✧</span><span>Ещё одна тайна</span></>}
        </div>)}
      </div>
      {found.length === secretIds.length ? <article className="secret-bonus" aria-label="Ещё кое-что для тебя">
        <h3>Ещё кое-что для тебя</h3><p>{gameContent.bonusMessage}</p>
      </article> : <p className="secret-results__invitation">Кажется, среди наших вещей спряталось ещё кое-что. Нужно вернуться и присмотреться.</p>}
    </section>
    <button className="story-button" type="button" onClick={() => send({ type: 'open-letter' })}>Перечитать письмо</button>
    <button className="story-button story-button--quiet" type="button" onClick={onBack}>Вернуться на стол</button>
  </FinaleLayout>;
}
