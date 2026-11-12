import envelope from '../assets/scene/envelope.webp';

export function Envelope({ onOpen }: { onOpen: () => void }) {
  return <button type="button" className="envelope" aria-label="Открыть письмо" onClick={onOpen}>
    <img src={envelope} alt="" width="640" height="426" draggable="false" />
  </button>;
}
