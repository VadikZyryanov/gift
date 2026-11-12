# Proposal Memory Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. The owner authorized implementation; execute inline without Git operations or tests.

**Goal:** Personalize the third pouch with the eighty-year wish, original speech, and a reference-based dress illustration.

**Architecture:** Keep PhraseTask and the existing reward scene. Store the speech in gameContent; migrate revision 3 to 4 by dropping only the old proposal draft before normal validation.

**Tech Stack:** Existing React, TypeScript, CSS, WebP; built-in imagegen.

**Spec:** docs/superpowers/specs/2026-11-11-proposal-memory-design.md

## Global Constraints

- Preserve the owner's wording and stanza breaks; no decoy words.
- Preserve existing keys and other pouch progress; no dependencies or Git operations.
- Do not create, modify, or execute tests, per the owner's instructions.

## Review Focus

- Old proposal draft must not invalidate the rest of a revision-3 save.
- Completed proposal still reveals the full speech on reopening.
- Invalid storage must still pass through the existing strict validator.
- Long lines wrap on mobile, with stanza breaks preserved.
- Dress asset retains transparency and matches the supplied garment.

### Task 1: Phrase, speech, and save compatibility

Files: src/game/content.ts, src/game/storage.ts, src/tasks/PhraseTask.tsx,
src/scene/PouchScene.tsx, src/tasks/tasks.css.

- [x] Update phrase, prompt, hint, placeholder, reward, and full speech.
- [x] Render the speech only in the completed proposal reward.
- [x] Add the narrow revision-3 migration; retain all earned keys and secrets.

### Task 2: Dress and verification

Files: src/assets/content/secret-green-dress.webp, docs/design/stage-5-asset-prompts.md,
docs/content/personal-materials.md.

- [x] Generate and inspect a transparent dress using the provided photo and current asset for style.
- [x] Convert to the existing 512×768 WebP format and update asset provenance/material notes.
- [x] Run npm run build and git diff --check; review the final diff. Tests intentionally skipped.

## Execution record

- Task 1: implementation complete; `npm run build` and `git diff --check` passed.
- Tests are not created, changed, or run, per the owner's opt-in policy. Existing
  assertions for the old phrase and rejection of the previous revision are stale.
- Ruling: use the existing checkout, without branches, worktrees, commits, or pushes,
  per the owner's Git restrictions. Execute the approved work directly.
- Independent read-only code review: no Critical/Important findings in the phrase,
  letter rendering, and migration. Asset generation/documentation reviewed separately.
- Task 2: generated dress inspected after WebP conversion; 512×768 with alpha,
  36 194 bytes. Final `npm run build` and `git diff --check` passed.
- Remaining verification: owner preview on a phone; tests intentionally skipped.

### Task 3: Photo postcard (owner-selected extension)

Files: src/assets/content/proposal-evening.webp, src/game/content.ts,
src/scene/PouchScene.tsx, src/tasks/tasks.css, related asset/material documentation.

- [x] Convert the original attached IMG_2168.jpg to WebP without metadata or cropping.
- [x] Add typed photo content and render it above the complete speech in the existing paper card.
- [x] Preserve image proportions and TaskImage's existing failure fallback.
- [x] Verify npm run build, git diff --check, and review the extension diff; no tests or Git mutations.

Task 3 complete: Downloads source was unavailable; recovered the same JPEG attachment
from this conversation. Added 1290×1679 WebP (144 714 bytes), without cropping or metadata.
Build/typecheck and diff check passed. Revision remains 4; saved progress is unaffected.
Mobile visual preview and automated tests were not run.
