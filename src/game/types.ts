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
export type TaskDraft =
  | QuizDraft
  | PhotoDraft
  | PhraseDraft
  | DetailDraft;

export interface QuizQuestion {
  id: string;
  question: string;
  options: readonly { id: string; label: string }[];
  correctId: string;
  hint: string;
  successMessage: string;
}

export interface QuizTaskDefinition {
  kind: 'quiz';
  questions: readonly [QuizQuestion, ...QuizQuestion[]];
}

export interface TaskImageSource {
  src: string;
  alt: string;
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

export type TaskDefinition = QuizTaskDefinition | PhotoTaskDefinition | PhraseTaskDefinition | DetailTaskDefinition;

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
  | { type: 'open-chest' | 'open-letter' | 'open-second-bottom' }
  | { type: 'restart' };

export interface GameSession {
  progress: GameProgress;
  send: (event: GameEvent) => void;
  storageStatus: 'available' | 'unavailable' | 'recovered';
}
