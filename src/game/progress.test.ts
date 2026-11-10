import { describe, expect, it } from 'vitest';
import { canOpenChest, createInitialProgress, gameReducer, getKeyCount } from './progress';
import { pouchIds, type GameEvent } from './types';

describe('game progress', () => {
  it('awards one key per pouch despite repeated completion', () => {
    const initial = createInitialProgress(1);
    const solved = gameReducer(initial, { type: 'complete-pouch', pouchId: 'beginning' });
    const repeated = gameReducer(solved, { type: 'complete-pouch', pouchId: 'beginning' });
    expect(getKeyCount(repeated)).toBe(1);
    expect(repeated.completedPouches).toEqual(['beginning']);
    expect(initial.completedPouches).toEqual([]);
    expect(canOpenChest(repeated)).toBe(false);
  });

  it.each<GameEvent>([
    { type: 'navigate', scene: { kind: 'chest' } },
    { type: 'navigate', scene: { kind: 'letter' } },
    { type: 'navigate', scene: { kind: 'finale' } },
    { type: 'open-chest' }, { type: 'open-letter' }, { type: 'open-second-bottom' },
  ])('keeps locked routes safe for $type', (event) => {
    const result = gameReducer(createInitialProgress(1), event);
    expect(result.scene).toEqual({ kind: 'table' });
    expect(result.chestOpened || result.letterOpened || result.secondBottomOpened).toBe(false);
  });

  it('opens the chest, letter and second bottom only in order', () => {
    let progress = createInitialProgress(1);
    for (const pouchId of [...pouchIds].reverse()) {
      progress = gameReducer(progress, { type: 'complete-pouch', pouchId });
    }
    expect(getKeyCount(progress)).toBe(4);
    expect(canOpenChest(progress)).toBe(true);
    expect(gameReducer(progress, { type: 'open-letter' }).letterOpened).toBe(false);
    progress = gameReducer(progress, { type: 'open-chest' });
    expect(progress.scene).toEqual({ kind: 'chest' });
    expect(gameReducer(progress, { type: 'open-second-bottom' }).secondBottomOpened).toBe(false);
    progress = gameReducer(progress, { type: 'open-letter' });
    progress = gameReducer(progress, { type: 'open-second-bottom' });
    expect(progress.scene).toEqual({ kind: 'finale' });
  });

  it('keeps draft, navigation and secret events independent from key rewards', () => {
    let progress = gameReducer(createInitialProgress(1), {
      type: 'save-draft', pouchId: 'beginning', draft: { kind: 'quiz', questionId: 'first-meeting', selectedId: 'cafe', confirmed: false },
    });
    progress = gameReducer(progress, { type: 'navigate', scene: { kind: 'pouch', pouchId: 'beginning' } });
    progress = gameReducer(progress, { type: 'find-secret', secretId: 'song' });
    progress = gameReducer(progress, { type: 'find-secret', secretId: 'song' });
    expect(progress.drafts.beginning).toEqual({ kind: 'quiz', questionId: 'first-meeting', selectedId: 'cafe', confirmed: false });
    expect(progress.scene).toEqual({ kind: 'pouch', pouchId: 'beginning' });
    expect(progress.foundSecrets).toEqual(['song']);
    expect(getKeyCount(progress)).toBe(0);
  });

  it('restarts with the same content revision and no previous rewards or drafts', () => {
    let progress = gameReducer(createInitialProgress(3), { type: 'complete-pouch', pouchId: 'beginning' });
    progress = gameReducer(progress, { type: 'save-draft', pouchId: 'beginning', draft: { kind: 'quiz', questionId: 'song', selectedId: 'kitkat', confirmed: true } });
    progress = gameReducer(progress, { type: 'navigate', scene: { kind: 'pouch', pouchId: 'beginning' } });
    expect(gameReducer(progress, { type: 'restart' })).toEqual({
      schemaVersion: 1, contentRevision: 3, completedPouches: [], foundSecrets: [], drafts: {},
      chestOpened: false, letterOpened: false, secondBottomOpened: false, scene: { kind: 'table' },
    });
  });
});
