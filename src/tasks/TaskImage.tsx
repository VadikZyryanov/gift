import { useState } from 'react';
import type { TaskImageSource } from '../game/types';

export function TaskImage({ src, alt }: TaskImageSource) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return failedSrc === src ? (
    <span className="task-image task-image--missing" role="img" aria-label={alt}>Иллюстрация недоступна</span>
  ) : (
    <img className="task-image" src={src} alt={alt} width="800" height="600" draggable="false" onError={() => setFailedSrc(src)} />
  );
}
