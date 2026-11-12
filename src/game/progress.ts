import { pouchIds, type GameEvent, type GameProgress, type Scene } from './types';

export function createInitialProgress(contentRevision: number): GameProgress {
  return {
    schemaVersion: 1, contentRevision, completedPouches: [], foundSecrets: [], selectedGiftIds: [], drafts: {},
    chestOpened: false, letterOpened: false, secondBottomOpened: false, scene: { kind: 'table' },
  };
}

export function getKeyCount(progress: GameProgress): number {
  return pouchIds.filter(id => progress.completedPouches.includes(id)).length;
}

export function canOpenChest(progress: GameProgress): boolean {
  return getKeyCount(progress) === pouchIds.length;
}

export function isSceneAllowed(progress: GameProgress, scene: Scene): boolean {
  switch (scene.kind) {
    case 'table': case 'pouch': return true;
    case 'chest': return canOpenChest(progress) && progress.chestOpened;
    case 'letter': return canOpenChest(progress) && progress.chestOpened && progress.letterOpened;
    case 'finale': return canOpenChest(progress) && progress.chestOpened && progress.letterOpened && progress.secondBottomOpened;
  }
}

export function gameReducer(progress: GameProgress, event: GameEvent): GameProgress {
  switch (event.type) {
    case 'navigate':
      return { ...progress, scene: isSceneAllowed(progress, event.scene) ? event.scene : { kind: 'table' } };
    case 'save-draft':
      return { ...progress, drafts: { ...progress.drafts, [event.pouchId]: event.draft } };
    case 'complete-pouch':
      return progress.completedPouches.includes(event.pouchId)
        ? progress : { ...progress, completedPouches: [...progress.completedPouches, event.pouchId] };
    case 'find-secret':
      return progress.foundSecrets.includes(event.secretId)
        ? progress : { ...progress, foundSecrets: [...progress.foundSecrets, event.secretId] };
    case 'toggle-gift': {
      if (!progress.letterOpened) return progress;
      const selectedGiftIds = progress.selectedGiftIds ?? [];
      return { ...progress, selectedGiftIds: selectedGiftIds.includes(event.giftId)
        ? selectedGiftIds.filter(id => id !== event.giftId)
        : [...selectedGiftIds, event.giftId] };
    }
    case 'open-chest':
      return canOpenChest(progress) ? { ...progress, chestOpened: true, scene: { kind: 'chest' } } : progress;
    case 'open-letter':
      return progress.chestOpened ? { ...progress, letterOpened: true, scene: { kind: 'letter' } } : progress;
    case 'show-finale':
    case 'open-second-bottom': // Legacy event and persisted flag remain compatible with existing saves.
      return progress.letterOpened ? { ...progress, secondBottomOpened: true, scene: { kind: 'finale' } } : progress;
    case 'restart':
      return createInitialProgress(progress.contentRevision);
  }
}
