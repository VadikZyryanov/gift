# Implementation ledger — plan: docs/superpowers/plans/2026-11-10-romantic-gift-game-implementation.md

## Scope and decisions

- Current checkpoint: stage 1, illustrated scene and close-up navigation. Stages 2–7 remain pending.
- Ruling: work in the current checkout, without creating a branch/worktree — the approved plan explicitly selects this checkout and reserves Git operations for a separate request.
- Ruling: pause after this checkpoint for the owner's manual review — the approved staged workflow takes precedence over the execution skill's continuous-run default.
- Ruling: keep this durable ledger in docs, without skill scripts that stage/commit Git changes — Git operations require a separate owner request.
- Pre-flight 1→2: table and pouch IDs remain beginning/journey/proposal/family; preview callbacks are replaced by GameProvider only in stage 2. No competing progress state in stage 1.
- Pre-flight 2→3: TaskDraft and complete-pouch events are shared contracts; keys are derived from unique completed IDs.
- Pre-flight 3→4: canOpenChest depends on all four completed IDs; reward transitions persist before animation.
- Pre-flight 4→5: the finale owns the only aggregate secret counter; searching remains accessible from the table.
- Pre-flight 5→6: content stays marked draft until personal materials are supplied and approved.

## Stage 1

- Stage 1: technical implementation complete; awaiting owner's manual review before stage 2.
- Production dependencies remain unchanged.
- Owner authorized a local commit after stage 1. Push and deploy are not requested.

### Evidence

- RED: `npm run test:unit` failed on missing `TableScene`, after Vitest/jsdom setup loaded correctly.
- GREEN: `npm run test:unit` — 7 tests passed.
- Final: `npm run test:e2e` — 33/33 passed across mobile-webkit, mobile-chromium and desktop-chromium; includes TypeScript checking and production build.
- `git diff --check` and Markdown local link/whitespace validation passed.
- Built resources total about 0.84 MiB before HTTP compression, below the 2 MiB scene target. No runtime requests for remote fonts.
- Artwork saved in `src/assets/scene/`; fonts and OFL licenses in `src/assets/fonts/`. Exact built-in imagegen prompts and sources recorded in `docs/design/stage-1-asset-prompts.md` and `stage-1-background-prompt.md`.
- Inspected actual WebKit screenshots of the table, close-up and 320px/200% text layout.
- Existing Vite servers belong to this repository; they were preserved. Verified the current scene at `http://192.168.0.160:5173/gift/` from the local browser. This does not establish connectivity from the owner's phone.

### Fixes found during verification

- Typecheck caught unsupported RTL `exact` options; removed them because string role names already match exactly. Component semantics and assertions preserved.
- WebKit focus restoration: RED in five navigation tests; capture the opening button explicitly, then restore focus when the native dialog unmounts. GREEN in all engines.
- Enlarged text: RED at 320px/200%; move labels into document flow when space is limited. Chromium production needed query containment on a regular layout wrapper instead of the native button; isolated DOM comparison reproduced the difference. Existing strict browser regression tests then GREEN in all three projects.
- Added keyboard Enter/Escape, short-height scrolling and enlarged-text tests following independent review. Review did not identify other confirmed blocking stage-1 defects.
- Review deferrals are intentional later stages: persistence/tasks/keys (2–3), audio/letter/finale (4), secrets (5), real personal assets/device acceptance (6), gift sheet (7). No stage-1 code polish findings are deferred.

### Manual checkpoint

- Awaiting the owner's iPhone 17 Pro Max / Yandex Browser review using `docs/testing/manual-checks.md`.
- Stage 2 not started: no progress persistence, active puzzles, key rewards, hidden secrets or audio yet.
- Suggested branch: `feature/romantic-gift-game`; suggested commit: `feat: add illustrated mobile game scene`.

## Stage 1 — owner's feedback corrections

- User supplied iPhone screenshots and requested continuous page background, removal of hover/focus effects, and a visible response when pressing a locked chest. Additional decoration stays in the polish stage.
- Changed mobile canvas from a flat root color plus isolated scene texture to body-owned texture with a transparent root and scene wrappers. Desktop framed composition preserved; theme-color fallback matches the texture base.
- Removed hover/press highlights and visual focus rings as explicitly requested. Existing focus restoration and Enter/Escape navigation are retained and still covered by E2E.
- Chest press now checks the lock: closed state replays a short image-only shake and updates an accessible status hint with the remaining key count. Open callback is still guarded by all four keys. Reduced motion keeps the hint without shaking; repeated presses do not grant progress.
- RED: new unit assertions failed on missing status response; 8 regression E2E checks on the old implementation failed on disabled chest, hover/focus effects and flat root canvas.
- GREEN: `npm run test:unit` — 9/9; `npm run test:e2e` — 45/45 across all three projects, including typecheck/build. `git diff --check` passed. Independent read-only review found no remaining issues.
- Inspected updated mobile WebKit screenshots. Native iOS toolbar/status-area appearance still requires the owner's device recheck; desktop emulation does not render browser chrome. Updated manual checklist records this limit.
- Background rationale: [WebKit safe areas](https://webkit.org/blog/7929/designing-websites-for-iphone-x/), [W3C body background propagation](https://www.w3.org/TR/css-backgrounds-3/#special-backgrounds).
- No new dependencies, assets, commit, push or deploy for these corrections. Stage 2 remains pending manual acceptance.

## Stage 1 — Safari / Yandex retry

- Owner confirmed pale top/bottom areas remain and only the chest flickers in both mobile Safari and Yandex.
- Root-cause evidence: a MutationObserver saw IMG removal/addition on every lock press; original image became disconnected while body/table heights stayed unchanged at 430×932. The numeric React key introduced this remount.
- Replaced remounts with a stable IMG inside a persistent wrapper. Web Animations animates only wrapper transforms, cancels the previous run before replay and on unmount, and skips movement for reduced motion. Repeated presses only set an already-true hint flag, avoiding unnecessary scene renders.
- Root/body canvas fallback and meta theme-color now agree on #e6bfd7; an 88px edge gradient blends the texture into this solid color. The prior body-only texture propagation did not fix the owner's native browser areas and is not considered sufficient.
- Rationale: [WebKit documentBackgroundColor source](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/page/LocalFrameView.cpp) excludes images from the document color, while [WebKit #301756 comment 2](https://bugs.webkit.org/show_bug.cgi?id=301756#c2) describes solid extension for viewport edges. Current upstream code informs the fix but does not prove behavior of the owner's unknown installed iOS version. No fake fixed strips or speculative GPU CSS hacks added.
- RED: persistent-image unit assertion failed; WebKit regression tests failed on image identity and root color mismatch. GREEN: `npm run test:unit` 10/10; `npm run test:e2e` 48/48 across all three projects with typecheck/build. Independent review found no confirmed defects.
- Rechecked the dev page at 430×932: same image after three presses, one animation, root/body colors equal, no horizontal overflow. Screenshot inspected. Physical compositor flicker and native chrome appearance remain awaiting owner confirmation.
- New dependencies/assets, commit, push and deploy: none. Stage 2 remains pending.
