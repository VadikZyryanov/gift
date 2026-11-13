export const pouchIds = ['beginning', 'journey', 'proposal', 'family'] as const;

export type PouchId = (typeof pouchIds)[number];

export interface LetterContent {
  status: 'draft' | 'ready';
  greeting: string;
  paragraphs: readonly string[];
  signature: string;
  voiceSrc: string | null;
}

export interface PouchPreview {
  title: string;
  subtitle: string;
  description: string;
}

export const secretIds = ['green-dress', 'white-bueno', 'black-g-class'] as const;
export type SecretId = (typeof secretIds)[number];

export const giftIds = [
  'breakfast', 'massage', 'dinner', 'experience', 'day-off', 'blind-date',
  'wishlist', 'lingerie', 'private-evening', 'overnight', 'car', 'hugs',
] as const;
export type GiftId = (typeof giftIds)[number];

export interface GiftContent {
  id: GiftId;
  title: string;
  price: number;
  description: string;
}

export interface SecretContent {
  title: string;
  text: string;
  image: TaskImageSource;
}

export type Scene =
  | { kind: 'table' }
  | { kind: 'pouch'; pouchId: PouchId }
  | { kind: 'chest' | 'letter' | 'finale' };

export type QuizDraft = { kind: 'quiz'; questionId: string; selectedId: string | null; confirmed: boolean };
export type PhotoDraft = { kind: 'photo'; selectedId: string | null };
export type PhraseDraft = { kind: 'phrase'; selectedWordIds: string[] };
export type DetailDraft = { kind: 'detail'; inspectedIds: string[] };
export type FamilyMemberId = 'thomas' | 'shelby' | 'svyatoslav';
export interface FamilyDateAnswer {
  month: number | null;
  year: number | null;
  confirmed: boolean;
}
export interface FamilyDraft {
  kind: 'family';
  selectedMemberId: FamilyMemberId | null;
  answers: Partial<Record<FamilyMemberId, FamilyDateAnswer>>;
}
export type TaskDraft =
  | QuizDraft
  | PhotoDraft
  | PhraseDraft
  | DetailDraft
  | FamilyDraft;

export interface QuizQuestion {
  id: string;
  question: string;
  questionImage?: TaskImageSource;
  options: readonly { id: string; label: string }[];
  correctId: string;
  hint: string;
  successMessage: string;
  successImage?: TaskImageSource;
}

export interface QuizTaskDefinition {
  kind: 'quiz';
  questions: readonly [QuizQuestion, ...QuizQuestion[]];
}

export interface TaskImageSource {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface PhotoTaskDefinition {
  kind: 'photo';
  question: string;
  caption: string;
  options: readonly { id: string; label: string; image: TaskImageSource }[];
  correctId: string;
  hint: string;
}

export interface PhraseTaskDefinition {
  kind: 'phrase';
  question: string;
  caption: string;
  words: readonly { id: string; label: string }[];
  answerIds: readonly string[];
  hint: string;
}

export interface DetailTaskDefinition {
  kind: 'detail';
  question: string;
  caption: string;
  image: TaskImageSource;
  spots: readonly {
    id: string;
    label: string;
    // Percentages of the uncropped illustration, independent of screen size.
    x: number;
    y: number;
  }[];
  targetId: string;
  hint: string;
}

export interface FamilyMember {
  id: FamilyMemberId;
  name: string;
  question: string;
  hint: string;
  successMessage: string;
  searchHint: string;
  month: number;
  year: number;
  spriteColumn: 0 | 1 | 2;
  sprites: {
    image: TaskImageSource;
    columns: 2 | 3;
    rows: 1 | 2;
  };
  // Position and width of a square sprite, in percentages of the whole scene.
  x: number;
  y: number;
  width: number;
}

export interface FamilyTaskDefinition {
  kind: 'family';
  question: string;
  caption: string;
  image: TaskImageSource;
  years: readonly number[];
  members: readonly [FamilyMember, ...FamilyMember[]];
}

export type TaskDefinition = QuizTaskDefinition | PhotoTaskDefinition | PhraseTaskDefinition | DetailTaskDefinition | FamilyTaskDefinition;

export interface PouchContent extends PouchPreview {
  status: 'draft' | 'ready';
  task: TaskDefinition;
  rewardNote: string;
}

export interface GameProgress {
  schemaVersion: 1;
  contentRevision: number;
  completedPouches: PouchId[];
  foundSecrets: SecretId[];
  // Optional in legacy schema-v1 snapshots; storage restores the earned reward and purchases.
  giftRewardEarned?: boolean;
  purchasedGiftIds?: GiftId[];
  drafts: Partial<Record<PouchId, TaskDraft>>;
  chestOpened: boolean;
  letterOpened: boolean;
  secondBottomOpened: boolean;
  scene: Scene;
}

export type GameEvent =
  | { type: 'navigate'; scene: Scene }
  | { type: 'save-draft'; pouchId: PouchId; draft: TaskDraft }
  | { type: 'complete-pouch'; pouchId: PouchId }
  | { type: 'find-secret'; secretId: SecretId }
  | { type: 'purchase-gift'; giftId: GiftId }
  | { type: 'open-chest' | 'open-letter' | 'show-finale' | 'open-second-bottom' }
  | { type: 'restart' };

export interface GameSession {
  progress: GameProgress;
  // Resolves after dispatch; false means the reducer rejected or ignored the event.
  send: (event: GameEvent) => Promise<boolean>;
  storageStatus: 'available' | 'unavailable' | 'recovered';
}
