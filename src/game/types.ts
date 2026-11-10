export const pouchIds = ['beginning', 'journey', 'proposal', 'family'] as const;

export type PouchId = (typeof pouchIds)[number];

export interface PouchPreview {
  title: string;
  subtitle: string;
  description: string;
}
