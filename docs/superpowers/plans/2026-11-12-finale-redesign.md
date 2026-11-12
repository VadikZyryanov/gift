# Finale Redesign Implementation Plan

> Use superpowers:executing-plans in the current checkout. The owner's current instructions override test, commit, branch and approval steps: implement the confirmed deferred finale; do not create, modify or run tests or perform Git mutations.

**Goal:** Replace the old chest/dialog/second-bottom flow with an animated opening, a sealed envelope opened by a single click and a standalone letter.

**Architecture:** Keep existing persisted scenes and revision 5; add a fullscreen scene shell, transient entrance state and envelope interaction. Audio cleanup separates voice and effects. Owner authorized a provisional gift catalogue with persistent selection pending the actual list.

**Tech Stack:** Existing React 19, TypeScript, CSS, Web Audio, Vite; no dependencies.

**Spec:** `docs/superpowers/specs/2026-11-12-finale-redesign-design.md`.

## Global Constraints

- Work in the existing checkout; preserve birthday-release changes, revision 5 and all progress.
- No tests, dependencies, Git mutations or publication.
- Keep four-key guards, optional secrets, muted default, manual-only voice.
- No fabricated personal copy, prices or budget. A clearly marked sample catalogue is authorized by the owner.

## Review Focus

- Fourth pouch reward remains readable; a return starts the opening once.
- Reload, background interruption and reduced motion leave the envelope usable.
- The envelope starts seal-side up, opens directly and has no flip controls or visible hints.
- Fullscreen focus/scroll work at 320px and 200% font size.
- A scene cleanup does not cancel the next gesture's audio effect; voice never resumes itself.

### Task 1: Artwork and fullscreen finale

- [x] Add separate address-side envelope and unlocked open-chest assets; record provenance.
- [x] Add `FinaleLayout({ title, onBack, children, className? })` for fullscreen main/focus/scroll.
- [x] Add `Envelope({ onOpen })` with the seal visible and native button activation; remove rotation and hints per the owner's follow-up.
- [x] Replace ChestScene content with lock/chest/envelope entrance, interruption handling and reduced motion.

### Task 2: Progress, letter and audio

- [x] Start the new reveal when leaving the final reward; save before animating, with no timer-owned progression.
- [x] Keep old saves/events compatible and add `show-finale`; no revision bump.
- [x] Render LetterScene/FinaleScene in FinaleLayout, remove second-bottom UI, retain secret results and voice.
- [x] Rework procedural sound envelopes and split voice pause from effect cancellation.
- [x] Add four sample gifts in content, typed selection events and backward-compatible persisted IDs; restart clears the selection.
- [x] Add multi-selection and copy/fallback UI to FinaleScene; letter leads there with «Перейти к подаркам».

### Task 3: Review and handoff

- [x] Run `npm run build` and `git diff --check`; inspect the final diff.
- [x] Inspect the initial flow manually in the browser, including rotation, reload and narrow letter. Later rotation removal is recorded separately in the ledger.
- [x] Update the original plan, feedback, manual checklist and ledger with actual results/limitations.
- [x] Report the result and note actual catalogue/prices/budget/delivery rules remain owner content work.
