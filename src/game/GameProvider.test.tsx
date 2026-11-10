import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gameContent } from './content';
import { GameProvider, useGame } from './GameProvider';
import { readProgress } from './storage';

function Consumer() {
  const { progress, send, storageStatus } = useGame();
  return <>
    <output aria-label="Session">{JSON.stringify({ progress, storageStatus })}</output>
    <button onClick={() => {
      send({ type: 'save-draft', pouchId: 'beginning', draft: { kind: 'quiz', questionId: 'song', selectedId: 'kitkat', confirmed: true } });
      send({ type: 'complete-pouch', pouchId: 'beginning' });
      send({ type: 'navigate', scene: { kind: 'pouch', pouchId: 'beginning' } });
      // Read before React can render: a save performed only in an effect is too late.
      document.getElementById('immediate-save')!.textContent = JSON.stringify(readProgress(localStorage, gameContent.revision).progress);
    }}>Solve now</button>
    <output id="immediate-save" aria-label="Immediate save" />
    <button onClick={() => send({ type: 'save-draft', pouchId: 'beginning', draft: { kind: 'quiz', questionId: 'first-meeting', selectedId: 'cafe', confirmed: false } })}>Choose again</button>
    <button onClick={() => send({ type: 'navigate', scene: { kind: 'table' } })}>Back</button>
    <button onClick={() => send({ type: 'restart' })}>Restart</button>
  </>;
}

function getSession() {
  return JSON.parse(screen.getByLabelText('Session').textContent ?? '{}');
}

beforeEach(() => { localStorage.clear(); });
afterEach(() => { vi.restoreAllMocks(); });

describe('GameProvider', () => {
  it('saves consecutive events immediately and restores them on remount', () => {
    const first = render(<StrictMode><GameProvider><Consumer /></GameProvider></StrictMode>);
    fireEvent.click(screen.getByText('Solve now'));
    const immediate = JSON.parse(screen.getByLabelText('Immediate save').textContent ?? '{}');
    expect(immediate.completedPouches).toEqual(['beginning']);
    expect(immediate.drafts).toEqual({ beginning: { kind: 'quiz', questionId: 'song', selectedId: 'kitkat', confirmed: true } });
    expect(immediate.scene).toEqual({ kind: 'pouch', pouchId: 'beginning' });
    first.unmount();
    render(<GameProvider><Consumer /></GameProvider>);
    expect(getSession().progress).toEqual(immediate);
    fireEvent.click(screen.getByText('Restart'));
    expect(readProgress(localStorage, gameContent.revision).progress.completedPouches).toEqual([]);
    expect(getSession().progress.scene).toEqual({ kind: 'table' });
  });

  it.each(['getter', 'getItem', 'setItem'] as const)('keeps answers and navigation working after a failing %s', (failure) => {
    if (failure === 'getter') {
      vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new DOMException('private detail', 'SecurityError'); });
    } else {
      vi.spyOn(Storage.prototype, failure).mockImplementation(() => { throw new DOMException('private detail', 'SecurityError'); });
    }
    render(<GameProvider><Consumer /></GameProvider>);
    fireEvent.click(screen.getByText('Choose again'));
    expect(getSession().storageStatus).toBe('unavailable');
    expect(getSession().progress.drafts.beginning.selectedId).toBe('cafe');
    fireEvent.click(screen.getByText('Back'));
    expect(getSession().progress.scene).toEqual({ kind: 'table' });
  });

  it('reports a recovered save while allowing a fresh session', () => {
    localStorage.setItem('gift:progress:v1', '{broken');
    render(<GameProvider><Consumer /></GameProvider>);
    expect(getSession().storageStatus).toBe('recovered');
    fireEvent.click(screen.getByText('Choose again'));
    expect(readProgress(localStorage, gameContent.revision).progress.drafts.beginning).toEqual({ kind: 'quiz', questionId: 'first-meeting', selectedId: 'cafe', confirmed: false });
  });
});
