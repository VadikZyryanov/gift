import { useState } from 'react';
import type { TaskImageSource } from '../game/types';
import { AffectionPhoto } from './AffectionPhoto';

interface TaskImageProps extends TaskImageSource {
  affection?: boolean;
}

export function TaskImage({ src, alt, width, height, affection = false }: TaskImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (failedSrc === src) return (
    <span className="task-image task-image--missing" role="img" aria-label={alt}>Иллюстрация недоступна</span>
  );
  const image = (
    <img className="task-image" src={src} alt={alt} width={width ?? 800} height={height ?? 600}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
      draggable="false" onError={() => setFailedSrc(src)} />
  );
  return affection ? <AffectionPhoto key={src} description={alt}>{image}</AffectionPhoto> : image;
}
