import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AudioProvider } from '../../src/audio/AudioProvider';
import { GameProvider } from '../../src/game/GameProvider';
import { LetterScene } from '../../src/finale/LetterScene';
import '../../src/index.css';
import '../../src/scene/scene.css';
import '../../src/tasks/tasks.css';
import '../../src/finale/finale.css';

// This harness is served only by Playwright's dev server, never in dist.
const root = document.getElementById('root');
if (!root) throw new Error('Fixture root missing');
createRoot(root).render(<StrictMode><GameProvider><AudioProvider><LetterScene letter={{
  status: 'draft', greeting: 'Тестовое письмо', paragraphs: ['Текст доступен и без записи.'],
  signature: 'Тестовый тон, не голос владельца', voiceSrc: './voice-tone.wav',
}} /></AudioProvider></GameProvider></StrictMode>);
