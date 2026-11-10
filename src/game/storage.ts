import { gameContent } from './content';
import { canOpenChest, createInitialProgress, isSceneAllowed } from './progress';
import { pouchIds, secretIds, type GameProgress, type GameSession, type PouchId, type Scene, type SecretId } from './types';

const storageKey = 'gift:progress:v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPouchId(value: unknown): value is PouchId {
  return pouchIds.some(id => id === value);
}

function isSecretId(value: unknown): value is SecretId {
  return secretIds.some(id => id === value);
}

function parseScene(value: unknown): Scene | null {
  if (!isRecord(value)) return null;
  if (value.kind === 'pouch') return isPouchId(value.pouchId) ? { kind: 'pouch', pouchId: value.pouchId } : null;
  if (value.kind === 'table' || value.kind === 'chest' || value.kind === 'letter' || value.kind === 'finale') {
    return { kind: value.kind };
  }
  return null;
}

function parseProgress(value: unknown, contentRevision: number): GameProgress | null {
  if (!isRecord(value) || value.schemaVersion !== 1 || value.contentRevision !== contentRevision) return null;
  if (!Array.isArray(value.completedPouches) || !value.completedPouches.every(isPouchId)) return null;
  if (!Array.isArray(value.foundSecrets) || !value.foundSecrets.every(isSecretId)) return null;
  if (typeof value.chestOpened !== 'boolean' || typeof value.letterOpened !== 'boolean' || typeof value.secondBottomOpened !== 'boolean') return null;
  const scene = parseScene(value.scene);
  if (!scene || !isRecord(value.drafts)) return null;
  const drafts: GameProgress['drafts'] = {};
  for (const [id, draft] of Object.entries(value.drafts)) {
    // Other tasks have no definitions yet; their drafts become valid in stage 3.
    if (id !== 'beginning' || !isRecord(draft) || draft.kind !== 'quiz') return null;
    const question = gameContent.beginning.task.questions.find(item => item.id === draft.questionId);
    if (!question || typeof draft.confirmed !== 'boolean') return null;
    const selectedId = draft.selectedId;
    if (selectedId !== null && !question.options.some(option => option.id === selectedId)) return null;
    if (draft.confirmed && selectedId !== question.correctId) return null;
    drafts.beginning = { kind: 'quiz', questionId: question.id, selectedId: typeof selectedId === 'string' ? selectedId : null, confirmed: draft.confirmed };
  }
  const progress: GameProgress = {
    schemaVersion: 1, contentRevision,
    completedPouches: [...new Set(value.completedPouches)], foundSecrets: [...new Set(value.foundSecrets)],
    drafts, chestOpened: value.chestOpened, letterOpened: value.letterOpened,
    secondBottomOpened: value.secondBottomOpened, scene,
  };
  if (progress.chestOpened && !canOpenChest(progress)) return null;
  if (progress.letterOpened && !progress.chestOpened) return null;
  if (progress.secondBottomOpened && !progress.letterOpened) return null;
  return isSceneAllowed(progress, scene) ? progress : null;
}

export function readProgress(storage: Storage, contentRevision: number): Pick<GameSession, 'progress'> & { status: GameSession['storageStatus'] } {
  let raw: string | null;
  try {
    raw = storage.getItem(storageKey);
  } catch {
    return { progress: createInitialProgress(contentRevision), status: 'unavailable' };
  }
  if (raw === null) return { progress: createInitialProgress(contentRevision), status: 'available' };
  try {
    const progress = parseProgress(JSON.parse(raw), contentRevision);
    if (progress) return { progress, status: 'available' };
  } catch { /* Invalid JSON follows the same safe recovery as an invalid snapshot. */ }
  return { progress: createInitialProgress(contentRevision), status: 'recovered' };
}

export function writeProgress(storage: Storage, progress: GameProgress): boolean {
  try {
    storage.setItem(storageKey, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
