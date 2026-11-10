import { beforeEach, describe, expect, it, vi } from 'vitest';
import { gameContent } from './content';
import { createInitialProgress } from './progress';
import { readProgress, writeProgress } from './storage';
import type { GameProgress } from './types';

const key = 'gift:progress:v1';
const revision = gameContent.revision;
const quizDraft = { kind: 'quiz', questionId: 'song', selectedId: 'kitkat', confirmed: true } as const;
const saved: GameProgress = {
  schemaVersion: 1, contentRevision: revision,
  completedPouches: ['family', 'beginning', 'journey', 'proposal'], foundSecrets: ['song', 'postcard'],
  drafts: { beginning: quizDraft },
  chestOpened: true, letterOpened: true, secondBottomOpened: true, scene: { kind: 'finale' },
};

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

describe('progress storage', () => {
  it('restores every task kind together without losing the existing quiz', () => {
    const progress: GameProgress = {
      ...createInitialProgress(revision),
      completedPouches: ['beginning'],
      drafts: {
        beginning: quizDraft,
        journey: { kind: 'photo', selectedId: 'turkey' },
        proposal: { kind: 'phrase', selectedWordIds: ['with', 'you'] },
        family: { kind: 'detail', inspectedIds: ['flowers', 'rings'] },
      },
      scene: { kind: 'pouch', pouchId: 'proposal' },
    };
    writeProgress(localStorage, progress);
    expect(readProgress(localStorage, revision)).toEqual({ progress, status: 'available' });
  });

  it.each([
    { journey: { kind: 'photo', selectedId: 'unknown' } },
    { journey: { kind: 'photo' } },
    { proposal: { kind: 'phrase', selectedWordIds: ['unknown'] } },
    { proposal: { kind: 'phrase', selectedWordIds: ['with', 'with'] } },
    { proposal: { kind: 'phrase', selectedWordIds: 'with' } },
    { family: { kind: 'detail', inspectedIds: ['unknown'] } },
    { family: { kind: 'detail', inspectedIds: [1] } },
    { family: { kind: 'photo', selectedId: null } },
  ])('rejects invalid drafts for the added tasks: %j', (drafts) => {
    localStorage.setItem(key, JSON.stringify({ ...saved, drafts }));
    expect(readProgress(localStorage, revision).status).toBe('recovered');
  });

  it('deduplicates inspected details without changing their order', () => {
    localStorage.setItem(key, JSON.stringify({ ...saved, drafts: { family: { kind: 'detail', inspectedIds: ['rings', 'flowers', 'rings'] } } }));
    expect(readProgress(localStorage, revision).progress.drafts.family).toEqual({ kind: 'detail', inspectedIds: ['rings', 'flowers'] });
  });

  it('round-trips all fields and starts normally without a save', () => {
    expect(readProgress(localStorage, revision).status).toBe('available');
    expect(writeProgress(localStorage, saved)).toBe(true);
    expect(readProgress(localStorage, revision)).toEqual({ progress: saved, status: 'available' });
  });

  it.each([
    ['broken JSON', '{broken'], ['null', 'null'], ['array', '[]'], ['missing fields', '{}'],
    ['unknown schema', JSON.stringify({ ...saved, schemaVersion: 2 })],
    ['old revision', JSON.stringify({ ...saved, contentRevision: revision - 1 })],
    ['future revision', JSON.stringify({ ...saved, contentRevision: revision + 1 })],
    ['unknown pouch', JSON.stringify({ ...saved, completedPouches: ['unknown'] })],
    ['unknown secret', JSON.stringify({ ...saved, foundSecrets: ['unknown'] })],
    ['wrong flag type', JSON.stringify({ ...saved, chestOpened: 'yes' })],
    ['unknown scene', JSON.stringify({ ...saved, scene: { kind: 'unknown' } })],
    ['unknown scene pouch', JSON.stringify({ ...saved, scene: { kind: 'pouch', pouchId: 'unknown' } })],
    ['unknown draft pouch', JSON.stringify({ ...saved, drafts: { unknown: { kind: 'quiz', selectedId: null } } })],
    ['wrong task kind', JSON.stringify({ ...saved, drafts: { beginning: { kind: 'photo', selectedId: null } } })],
    ['unknown answer', JSON.stringify({ ...saved, drafts: { beginning: { ...quizDraft, selectedId: 'unknown' } } })],
    ['unknown question', JSON.stringify({ ...saved, drafts: { beginning: { ...quizDraft, questionId: 'unknown' } } })],
    ['answer from another question', JSON.stringify({ ...saved, drafts: { beginning: { ...quizDraft, questionId: 'first-meeting' } } })],
    ['wrong confirmed answer', JSON.stringify({ ...saved, drafts: { beginning: { ...quizDraft, selectedId: 'bounty' } } })],
    ['confirmed without answer', JSON.stringify({ ...saved, drafts: { beginning: { ...quizDraft, selectedId: null } } })],
    ['wrong confirmation type', JSON.stringify({ ...saved, drafts: { beginning: { ...quizDraft, confirmed: 'yes' } } })],
    ['missing confirmation', JSON.stringify({ ...saved, drafts: { beginning: { kind: 'quiz', questionId: 'song', selectedId: 'kitkat' } } })],
    ['chest without keys', JSON.stringify({ ...saved, completedPouches: ['beginning'] })],
    ['letter without chest', JSON.stringify({ ...saved, chestOpened: false })],
    ['bottom without letter', JSON.stringify({ ...saved, letterOpened: false })],
    ['locked scene', JSON.stringify({ ...createInitialProgress(revision), scene: { kind: 'letter' } })],
  ])('recovers safely from %s', (_name, raw) => {
    localStorage.setItem(key, raw);
    expect(readProgress(localStorage, revision)).toEqual({ progress: createInitialProgress(revision), status: 'recovered' });
  });

  it('deduplicates valid saved IDs without creating extra keys', () => {
    localStorage.setItem(key, JSON.stringify({ ...saved, completedPouches: [...saved.completedPouches, 'beginning'], foundSecrets: ['song', 'song'] }));
    const { progress } = readProgress(localStorage, revision);
    expect(progress.completedPouches).toEqual(['family', 'beginning', 'journey', 'proposal']);
    expect(progress.foundSecrets).toEqual(['song']);
  });

  it('reports unavailable reads and writes without throwing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('private detail', 'SecurityError'); });
    expect(readProgress(localStorage, revision)).toEqual({ progress: createInitialProgress(revision), status: 'unavailable' });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('private detail', 'QuotaExceededError'); });
    expect(writeProgress(localStorage, saved)).toBe(false);
  });
});
