import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReleaseGate } from './release/ReleaseGate';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element was not found');
}

createRoot(root).render(
  <StrictMode>
    <ReleaseGate />
  </StrictMode>,
);
