import { pouchIds, type GameEvent, type GameProgress, type Scene } from './types';
import { getGiftWallet, giftCatalog, giftRewardAmount } from './gifts';

export function createInitialProgress(contentRevision: number): GameProgress {
  return {
    schemaVersion: 1, contentRevision, completedPouches: [], foundSecrets: [],
    giftRewardEarned: false, purchasedGiftIds: [], drafts: {},
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
    case 'complete-pouch': {
      if (progress.completedPouches.includes(event.pouchId)) return progress;
      const completedPouches = [...progress.completedPouches, event.pouchId];
      return { ...progress, completedPouches,
        giftRewardEarned: progress.giftRewardEarned === true || pouchIds.every(id => completedPouches.includes(id)) };
    }
    case 'find-secret':
      return progress.foundSecrets.includes(event.secretId)
        ? progress : { ...progress, foundSecrets: [...progress.foundSecrets, event.secretId] };
    case 'purchase-gift': {
      const purchasedGiftIds = progress.purchasedGiftIds ?? [];
      const gift = giftCatalog.find(item => item.id === event.giftId);
      const wallet = getGiftWallet(progress);
      if (!progress.letterOpened || wallet.earned === 0 || !gift
        || purchasedGiftIds.includes(event.giftId) || gift.price > wallet.remaining) return progress;
      return { ...progress, giftRewardEarned: true, purchasedGiftIds: [...purchasedGiftIds, event.giftId] };
    }
    case 'open-chest':
      return canOpenChest(progress) ? { ...progress, chestOpened: true, scene: { kind: 'chest' } } : progress;
    case 'open-letter':
      return progress.chestOpened ? { ...progress, letterOpened: true, scene: { kind: 'letter' } } : progress;
    case 'show-finale':
    case 'open-second-bottom': // Legacy event and persisted flag remain compatible with existing saves.
      return progress.letterOpened ? { ...progress, secondBottomOpened: true, scene: { kind: 'finale' } } : progress;
    case 'restart':
      return { ...createInitialProgress(progress.contentRevision),
        giftRewardEarned: getGiftWallet(progress).earned === giftRewardAmount,
        purchasedGiftIds: [...(progress.purchasedGiftIds ?? [])] };
  }
}
