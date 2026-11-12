import { gameContent } from './content';
import { canOpenChest, createInitialProgress, isSceneAllowed } from './progress';
import { pouchIds, secretIds, type GameProgress, type GameSession, type PouchId, type Scene, type SecretId, type TaskDefinition, type TaskDraft } from './types';

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

// These were scaffolding-only themes before playable secrets were introduced.
const legacySecretIds: readonly string[] = ['song', 'paw-seal', 'postcard'];

function parseScene(value: unknown): Scene | null {
  if (!isRecord(value)) return null;
  if (value.kind === 'pouch') return isPouchId(value.pouchId) ? { kind: 'pouch', pouchId: value.pouchId } : null;
  if (value.kind === 'table' || value.kind === 'chest' || value.kind === 'letter' || value.kind === 'finale') {
    return { kind: value.kind };
  }
  return null;
}

function parseDraft(task: TaskDefinition, draft: unknown): TaskDraft | null {
  if (!isRecord(draft) || draft.kind !== task.kind) return null;
  switch (task.kind) {
    case 'quiz': {
      const question = task.questions.find(item => item.id === draft.questionId);
      if (!question || typeof draft.confirmed !== 'boolean') return null;
      const selectedId = draft.selectedId;
      if (selectedId !== null && !question.options.some(option => option.id === selectedId)) return null;
      if (draft.confirmed && selectedId !== question.correctId) return null;
      return { kind: 'quiz', questionId: question.id, selectedId: typeof selectedId === 'string' ? selectedId : null, confirmed: draft.confirmed };
    }
    case 'photo': {
      const selectedId = draft.selectedId;
      if (selectedId !== null && (typeof selectedId !== 'string' || !task.options.some(option => option.id === selectedId))) return null;
      return { kind: 'photo', selectedId };
    }
    case 'phrase': {
      const ids: unknown = draft.selectedWordIds;
      if (!Array.isArray(ids) || !ids.every((id: unknown): id is string => typeof id === 'string' && task.words.some(word => word.id === id))) return null;
      if (new Set(ids).size !== ids.length) return null;
      return { kind: 'phrase', selectedWordIds: [...ids] };
    }
    case 'detail': {
      const ids: unknown = draft.inspectedIds;
      if (!Array.isArray(ids) || !ids.every((id: unknown): id is string => typeof id === 'string' && task.spots.some(spot => spot.id === id))) return null;
      return { kind: 'detail', inspectedIds: [...new Set(ids)] };
    }
    case 'family': {
      const selectedMember = task.members.find(member => member.id === draft.selectedMemberId);
      if (draft.selectedMemberId !== null && !selectedMember) return null;
      if (!isRecord(draft.answers)) return null;
      const answers: Extract<TaskDraft, { kind: 'family' }>['answers'] = {};
      for (const [id, answer] of Object.entries(draft.answers)) {
        const member = task.members.find(item => item.id === id);
        if (!member || !isRecord(answer) || typeof answer.confirmed !== 'boolean') return null;
        const { month, year, confirmed } = answer;
        if (month !== null && (typeof month !== 'number' || !Number.isInteger(month) || month < 1 || month > 12)) return null;
        if (year !== null && (typeof year !== 'number' || !task.years.includes(year))) return null;
        if (confirmed && (month !== member.month || year !== member.year)) return null;
        answers[member.id] = { month, year, confirmed };
      }
      return { kind: 'family', selectedMemberId: selectedMember?.id ?? null, answers };
    }
  }
}

function parseProgress(value: unknown, contentRevision: number): GameProgress | null {
  if (!isRecord(value) || value.schemaVersion !== 1 || value.contentRevision !== contentRevision) return null;
  if (!Array.isArray(value.completedPouches) || !value.completedPouches.every(isPouchId)) return null;
  if (!Array.isArray(value.foundSecrets) || !value.foundSecrets.every((id: unknown) =>
    isSecretId(id) || (typeof id === 'string' && legacySecretIds.includes(id)))) return null;
  if (typeof value.chestOpened !== 'boolean' || typeof value.letterOpened !== 'boolean' || typeof value.secondBottomOpened !== 'boolean') return null;
  const scene = parseScene(value.scene);
  if (!scene || !isRecord(value.drafts)) return null;
  const drafts: GameProgress['drafts'] = {};
  for (const [id, draft] of Object.entries(value.drafts)) {
    if (!isPouchId(id)) return null;
    const parsed = parseDraft(gameContent.pouches[id].task, draft);
    if (!parsed) return null;
    drafts[id] = parsed;
  }
  const progress: GameProgress = {
    schemaVersion: 1, contentRevision,
    completedPouches: [...new Set(value.completedPouches)], foundSecrets: [...new Set(value.foundSecrets.filter(isSecretId))],
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
    const value: unknown = JSON.parse(raw);
    // Apply known content migrations in order, retaining earned keys and other drafts.
    if (isRecord(value) && value.schemaVersion === 1 && isRecord(value.drafts)) {
      if (value.contentRevision === 3 && (contentRevision === 4 || contentRevision === 5)) {
        value.contentRevision = 4;
        delete value.drafts.proposal;
      }
      if (value.contentRevision === 4 && contentRevision === 5) {
        value.contentRevision = 5;
        delete value.drafts.family;
      }
    }
    const progress = parseProgress(value, contentRevision);
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
