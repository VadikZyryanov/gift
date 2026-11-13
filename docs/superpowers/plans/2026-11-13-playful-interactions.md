# Playful Interactions Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for integration and superpowers:dispatching-parallel-agents for independent UI tasks. Track completion below.

**Goal:** Add the eight selected playful interactions without changing game progress.

**Architecture:** Small local React components and CSS animations. A shared reduced-motion hook coordinates browser preferences; pending key presentation stays in App and does not enter persisted progress.

**Tech Stack:** React, TypeScript, CSS, Web Animations API, Web Audio API.

**Spec:** `docs/superpowers/specs/2026-11-13-playful-interactions-design.md`

## Global Constraints

- No dependencies, branches, commits, changes to secrets, or external writes.
- No tests created, changed or executed. Use `npm run typecheck`, `npm run build`, and diff review.
- Preserve search, scrolling, voice lifecycle, progress saves and existing story content.
- Decorative animations must respect reduced motion, have bounded resources, and clean up on navigation.

## Review Focus

- Rapid taps remain bounded and do not block controls.
- Reduced motion still gives visible feedback and never waits on animationend.
- Touch petting and double taps preserve scrolling and family search.
- Fourth-key flight finishes before chest entry; navigation cancels presentation only.
- Voice and purr stop on scene exit, hidden pages and sound-toggle changes.

### Task 1: Motion preference and table delights
- [x] Add `src/animation/useReducedMotion.ts` exporting `useReducedMotion(): boolean`.
- [x] Add focused table components/CSS and integrate `TableScene.tsx`: heart, bun after five taps, flower petals; native accessible buttons and bounded one-shot effects.

### Task 2: Family petting
- [x] Extend `FamilyPicture.tsx` and local CSS with stroke interaction for Thomas, tap/keyboard alternative and hearts. Preserve unfound member selection and panorama panning.
- [x] Add a bounded `purr` effect through existing sound APIs. Sound is injected with optional `onPetThomas`; `playEffect` returns a generation-scoped cancel function so navigation cleanup cannot cancel a newer reveal.

### Task 3: Finale and voice
- [x] Add a car ride component integrated into `FinaleScene.tsx`, replacing only the found car's static collection rendering with an accessible button.
- [x] Add playback hearts beside the voice button in `LetterScene.tsx`; actual playing state starts motion, pause freezes it, navigation unmounts it.

### Task 4: Photos and keys
- [x] Extend `TaskImage.tsx` with opt-in photo affection and enable only actual photo locations; preserve missing-image fallback.
- [x] Propagate newly earned key/return origin from `PouchScene` to `App`, animate to a stable table slot, then open the chest for the fourth key.

### Task 5: Integration and verification
- [x] Review all diffs for lifecycle, keyboard and reduced-motion behavior.
- [x] Run type checking and production build. Do not run test commands or browser-driven test flows.
- [x] Obtain an independent code review and address actionable findings. Fixed Thomas's changing wrapper so the native family dialog keeps its focus-return target; scoped re-review accepted the fix.

## Verification

- `npm run typecheck`: passed.
- `npm run build`: passed after integration and the focus fix (includes TypeScript checking).
- `git diff --check`: passed.
- Tests intentionally untouched and unexecuted. Browser/device gestures, purr sound and animation composition still need manual verification.
