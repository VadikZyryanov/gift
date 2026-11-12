# Family Story Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. The owner authorized implementation; execute inline without Git mutations or test execution. Updating the legacy detail component test is explicitly authorized.

**Goal:** Replace the fourth pouch's heart search with a personal family scene and three month/year memories.

**Architecture:** Add a discriminated family task and persisted draft; use a reusable FamilyPicture for both the task and earned reward. Animate a transparent two-pose atlas over a room illustration using CSS.

**Tech Stack:** Existing React, TypeScript, CSS, built-in imagegen, WebP.

**Spec:** docs/superpowers/specs/2026-11-12-family-story-design.md

## Global Constraints

- Thomas June 2025, Shelby October 2025 (joining the household), Svyatoslav October 2026.
- No production dependencies, test execution, Git mutations, publishing, or original reference photos in the build.
- Preserve existing uncommitted changes, earned keys, and other pouch progress.

## Review Focus

- Revision 3 and 4 saves migrate without discarding other progress.
- Invalid draft dates, unknown IDs, duplicate completions remain strictly validated.
- Switching people, revisiting and reloading retain selections and correct answers.
- A final correct answer remains visible before explicitly claiming the key.
- Missing art, keyboard interaction, narrow screens and reduced motion remain usable.

### Task 1: Illustration and content model

- [x] Generate and inspect room + transparent six-cell character atlas from reference photos.
- [x] Add FamilyTaskDefinition and FamilyDraft; keep legacy Detail types for existing code.
- [x] Define personal questions, hints, success messages, art positions and dates in src/game/family.ts.
- [x] Replace fourth-pouch task, update reward note and increment revision to 5.

### Task 2: Interaction and persistence

- [x] Implement FamilyPicture, FamilyTimeline and FamilyTask with month/year selects, any-order discovery, saved selections, hints and success states.
- [x] Connect the task and completed family picture/timeline to PouchScene without changing other pouches.
- [x] Validate family drafts and sequentially migrate revision 3→4→5 in storage.ts.
- [x] Add responsive styling, sprite animations, keyboard focus and reduced-motion support.

### Task 3: Verification and documentation

- [x] Document reference use, exact prompts, generated files and content migration.
- [x] Run npm run build and git diff --check; inspect resulting diff and generated art.
- [x] Request an independent read-only review of changed code, address material findings.
- [x] Update the legacy detail component test with the owner's explicit permission; do not execute tests.
- [x] Record completed work and verification; explicitly report test execution skipped.

## Execution record

- Owner's «давай делать» authorizes the previously discussed scene; execute directly.
- Existing checkout retained per owner's prohibition on creating branches and Git mutations.
- TDD steps omitted per the owner's explicit opt-in testing policy.
- Tasks 1–2 complete. Art generated with built-in imagegen, alpha retained in WebP.
- Final review: independent read-only reviewer found no Critical/Important issues.
  Minor about infinite animation addressed by finite two-pose animations; final
  review of that change and the component test reported no further issues.
- Owner explicitly authorized updating the old detail test without execution;
  replaced it with FamilyTask.test.tsx. Other test files remain untouched.
- Full npm run build (TypeScript + Vite) and git diff --check passed. Visual
  browser preview at 390 px and 320 px informed the layout and narrow select stacking.
- Tests intentionally not executed. Existing storage/E2E assertions for the old
  detail task and old revision behavior are outside the granted test-update scope.
- No dependencies, branches, worktrees, commits, pushes or publishing.
