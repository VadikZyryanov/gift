import beginning from '../assets/scene/pouch-beginning.webp';
import journey from '../assets/scene/pouch-journey.webp';
import proposal from '../assets/scene/pouch-proposal.webp';
import family from '../assets/scene/pouch-family.webp';
import chest from '../assets/scene/chest.webp';
import decor from '../assets/scene/decor.webp';
import type { PouchId } from '../game/types';

export const pouchImages: Record<PouchId, string> = { beginning, journey, proposal, family };
export const sceneImages = { chest, decor };
