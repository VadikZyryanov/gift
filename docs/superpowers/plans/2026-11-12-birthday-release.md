# Birthday Release Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation. User instructions override test and branch steps: do not create or run automated tests or create branches. The owner accepted the 30-second preview and subsequently authorized removing that preview, committing the release gate, and pushing to GitHub.

**Goal:** Open the QR gift on November 18, 2026 at 00:00 Moscow time.

**Architecture:** Add a release screen before App at the React entry point. Compare the device clock to an absolute timestamp, bypass in development, and lazy-load the existing App after the recipient opens the gift.

**Tech Stack:** Existing React, TypeScript, Vite, and CSS; no dependencies.

**Spec:** `docs/superpowers/specs/2026-11-12-birthday-release-design.md`.

**Review Focus:** Explicit Moscow offset; last second before release; resume from background; lazy import failure after deployment; existing progress remains untouched. Automated tests are disabled by user instructions.

### Task 1: Release screen and integration

**Files:** Create `src/release/ReleaseGate.tsx`, `src/release/release.css`; modify `src/main.tsx`, `README.md`.

**Interfaces:** `ReleaseGate(): React.JSX.Element` replaces App in main.tsx and dynamically imports the existing default App. Existing game modules and save data remain untouched.

- [x] Implement the production countdown to `2026-11-18T00:00:00+03:00`, with «Карамельная попка» in the dedication.
- [x] Refresh the clock every second and on visibilitychange, pageshow, and focus; clean up all subscriptions.
- [x] Show «Открыть подарок» at or after the deadline, recheck the clock on click, and lazy-load App with loading and recovery states.
- [x] Bypass the gate with `import.meta.env.DEV`; retain the release screen in production preview.
- [x] Add responsive styles using existing palette and fonts, accessible countdown and focus styles.
- [x] Document release time, development bypass, client clock limitation, and current deployment behavior in README.
- [x] Run `npm run build`, inspect generated entry point and App chunk, and review `git diff --check` and the final diff. Do not create or execute tests.

## Verification record

- `npm run build`: passed, including TypeScript checking. Entry HTML references
  only the entry script and global/release CSS; App JS and CSS are separate lazy chunks.
- `git diff --check`: passed.
- Independent source review: no blocking findings.
- Tests were neither created nor executed, as instructed. The owner reviewed
  the waiting and unlocked screens using a temporary 30-second development preview.
- The temporary preview was removed after acceptance. The only release deadline
  is `2026-11-18T00:00:00+03:00`; development still opens the game immediately.
- No branch or dependency changes. Commit/push scope is limited to the release
  gate and its documentation; unrelated finale/audio changes remain unstaged.
