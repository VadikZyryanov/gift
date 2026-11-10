export const pouchIds = ['beginning', 'journey', 'proposal', 'family'] as const;

export type PouchId = (typeof pouchIds)[number];

export interface PouchPreview {
  title: string;
  subtitle: string;
  description: string;
}

export const secretIds = ['song', 'paw-seal', 'postcard'] as const;
export type SecretId = (typeof secretIds)[number];

export type Scene =
  | { kind: 'table' }
  | { kind: 'pouch'; pouchId: PouchId }
  | { kind: 'chest' | 'letter' | 'finale' };

export type QuizDraft = { kind: 'quiz'; questionId: string; selectedId: string | null; confirmed: boolean };
export type TaskDraft =
  | QuizDraft
  | { kind: 'photo'; selectedId: string | null }
  | { kind: 'phrase'; selectedWordIds: string[] }
  | { kind: 'detail'; inspectedIds: string[] };

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
