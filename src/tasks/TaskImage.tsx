import { useState } from 'react';
import type { TaskImageSource } from '../game/types';

export function TaskImage({ src, alt, width, height }: TaskImageSource) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return failedSrc === src ? (
    <span className="task-image task-image--missing" role="img" aria-label={alt}>Иллюстрация недоступна</span>
  ) : (
    <img className="task-image" src={src} alt={alt} width={width ?? 800} height={height ?? 600}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
      draggable="false" onError={() => setFailedSrc(src)} />
  );
}
