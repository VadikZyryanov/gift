# Implementation ledger — plan: docs/superpowers/plans/2026-11-10-romantic-gift-game-implementation.md

## Stage 6 / Beginning — technically complete, awaiting owner review

- Owner supplied beach, bouquet and cafe images; specified answer edits, success-photo slides and a left-to-right KitKat flight before the key. Clarified heart expands to reveal an ordinary question dialog.
- Scope: docs/superpowers/specs/2026-11-11-beginning-memories-design.md; execute the existing authorized plan inline in the current checkout. No Git operations, dependencies or other pouches/finale redesign.
- Pre-flight: QuizDraft already persists confirmed answers; complete-pouch saves synchronously and idempotently. Keep transient celebration in PouchScene so persistence never waits for animation.
- Ruling: preserve revision 2 and the existing distractor ID friends with its new display label «В зале» — correct answers/question order remain compatible; avoids discarding owner progress. Cost: the historical internal ID no longer describes its display label.
- Ruling: success photos replace choices within the existing dialog, rather than adding nested dialogs — matches the requested slides and keeps a single focus/scroll owner. Cost: answers are visible again only on a fresh playthrough.
- Implementation choices: 3-second flight, optional existing sound provider, immediate reduced-motion reveal; personal photos fitted whole, bouquet cutout includes wrapper and ribbon. Other content remains draft.
- RED: first content/component run 7 failed / 5 passed for old distractor/order, absent photos and unreplaced choices; GREEN 12/12 after optional successImage and memory presentation. Logs /private/tmp/gift-beginning-memories-{red,green}.log.
- Animation RED: 3 browser failures on missing flight and ordinary panel animation, /private/tmp/gift-beginning-animation-red.log. Heart mask/reveal, gesture-only optional paper sound and transient full-viewport flight now implemented; WebKit 7/7 at the first checkpoint.
- Visual inspection found layout growth after photo decode: aspect-ratio:auto removed the intrinsic placeholder, initially leaving zero height. A held-response E2E reproduced 0→413px (RED /private/tmp/gift-beginning-layout-red.log). Explicit source dimensions/aspect ratio now reserve the photo region; targeted GREEN /private/tmp/gift-beginning-layout-green.log.
- Final unit suite 125/125 in 12 files; full E2E 157 passed + 2 expected CDP-only skips in all three projects, including typecheck/build. Logs /private/tmp/gift-beginning-final-unit.log, /private/tmp/gift-beginning-full-e2e.log. git diff --check passed.
- WebKit screenshots inspected: /private/tmp/gift-beginning-{heart,flight,narrow}.png and /private/tmp/gift-beginning-{beach,bouquet,cafe}-final.png. Whole photos, text above, Next below, no horizontal dialog overflow; desktop/mobile interactions and failed media exercised by E2E. Device chrome/physical iPhone/Yandex/audio quality remain owner checks.
- Concurrent unrelated chest work was committed as 5251af8 while this task ran. This task never changed RotatingChest.tsx/rotating-chest.css; final review is the current uncommitted Beginning diff against that HEAD. No commit/push/deployment by this executor.
- Independent fresh read-only final reviewer found no Critical/Important/Minor issues. Reviewed diff against 5251af8, new files, screenshots and green logs; ran diff check only, did not repeat suites or mutate the checkout. No fix pass needed. Review package /private/tmp/gift-beginning-review.md.
- Final: Ruling: other pouches and full stage 6 remain outside this checkpoint because the owner chose sequential personalization — cost: those materials and final readiness are still pending.
- Final: Ruling: deferred finale redesign/gifts remain separate, and final letter/voice/other draft content await their own checkpoint — cost: this is not a finished gift-release build.
- Final: minor (previously deferred): second-bottom paper effect may be cancelled by LetterScene unmount. Outside Beginning diff and retained for the authorized future sound/finale rework.
- Final: Ruling: no visual hover/focus effects per owner; focus restoration remains functional — cost: no visible keyboard ring.
- Final: Ruling: completed Beginning reopens its key, not a new memory-gallery mode; no automatic progress reset — cost: manually replaying new photos requires the existing confirmed whole-game restart.
- Final: Ruling: exact bouquet cutout likeness and final personal copy approval belong to owner review; source/edit provenance is disclosed — cost: generative cutout may need adjustment after visual feedback.
- Final: Ruling: physical iPhone/Yandex/native chrome/VoiceOver/acoustics remain manual acceptance, not an automation claim — cost: real device appearance/sound still need checking.
- Final: Ruling: unrelated chest changes already committed in 5251af8 are excluded from this review — cost: this checkpoint judges only the Beginning change. No commit, push or deployment by this executor.
- Task 6.Beginning complete: 125/125 unit, 157 E2E passed + 2 expected skips, typecheck/build and diff/text/link/metadata checks green. Stage 6 overall remains incomplete; stop here for owner manual review before the next pouch.

## Owner refinement — Bueno behind flowers on the table

- Owner requested moving white Bueno from the Beginning pouch to the main scene behind flowers. Same secret ID/note/save; no content revision or progress reset.
- Moved the existing SecretSpot through a table prop, outside aria-hidden decorative markup. The lower-right flowers cover part of the wrapper while allowing taps through; the ornament is anchored beside the chest so large footer text does not collide with the target.
- Updated existing secret E2E for the new table location, draft restoration after a visit to the table, rereading/reload, Escape focus/scroll return, and narrow text layout. Placement RED on the old pouch location; mobile GREEN: 23 passed, 1 expected CDP-only skip. Logs: /private/tmp/gift-bueno-move-{red,e2e}.log. Unit suite: 118/118, /private/tmp/gift-bueno-move-unit.log.
- Additional visual inspection found an existing WebKit compositing defect: the inactive rear artwork painted over the front despite backface-visibility, exposing the G-Class sticker in reverse. Removing the new flowers/wrapper did not change it; individual filter/transform changes did not fix it either. Explicit inactive-face visibility fixed the observed rendering.
- Added a real pixel-occlusion E2E: a screenshot of each visible side must stay identical when the opposing side is explicitly hidden. RED confirmed leakage on both sides in WebKit, /private/tmp/gift-chest-face-red.log. CSS now synchronizes visibility with existing aria-hidden side state while preserving the mounted images and touch rotation. GREEN: pixel-occlusion checks in all three projects; full npm run test:e2e passed 133 scenarios with 2 expected CDP-only skips, plus build/typecheck. Log: /private/tmp/gift-bueno-move-final-e2e.log.
- Inspected WebKit 440px and 320px/200% text: wrapper's clipped visible target width exceeds 44px, its bounds do not overlap the chest control, no horizontal page overflow, tap and close work. Screenshots /private/tmp/gift-bueno-flowers-{440,320}.png and final front /private/tmp/gift-bueno-chest-fixed.png. Device appearance still awaits owner review; no new assets/dependencies or Git operations.

## Stage 5 — technically complete, awaiting owner review

- Owner selected green dress, white Bueno and black G-Class instead of the earlier draft secrets; approved their locations and chest rotation directly on the table. Temporarily illustrated dress is delegated to the implementer, personal photo replacement later. Scope: docs/superpowers/specs/2026-11-11-stage-5-secrets-design.md.
- Ruling: continue the already-authorized stage 5 in this checkout after the location/interaction discussion; the owner delegated the last artwork choice. No additional design questionnaire, Git operations or deferred finale redesign.
- Pre-flight: find-secret already persists idempotently; new themed IDs replace unused draft IDs. Narrow migration drops only known legacy secret IDs while preserving revision 2, keys, drafts and stable scenes. Unknown data still recovers safely.
- Ruling: prepared front/back artwork with CSS perspective and side faces, no WebGL/dependencies; gestures rotate only after horizontal intent and never synthesize an opening click. Cost if wrong: illustration-based depth may need visual refinement after device review.
- 5.1 RED: storage migration lost all progress before implementation (1 failed, 38 passed); actual UI failed on missing Bueno spot and rotating group. Logs: /private/tmp/gift-stage5-{storage,ui,rotation}-red.log. SecretSpot component RED initially failed on the missing module, not a behavior assertion.
- 5.2–5.3: three themed IDs, narrow legacy migration, reusable SecretSpot/SecretNote, peek-out keepsakes in two pouches, persistent idempotent discoveries, finale-only count/collection and bonus. Notes preserve current task drafts and focus. Front art remains the same DOM image throughout checks and turns.
- 5.4: local illustrated rear, dress, white Bueno and black G-Class generated with built-in imagegen, inspected and optimized as transparent WebP; exact prompts/paths in docs/design/stage-5-asset-prompts.md. Existing optional found effect only; owner's larger audio/finale changes remain deferred, including the known stage-4 second-bottom sound cancellation.
- Gesture regression: vertical intent discarded its gesture too early, leaving suppression active after pointercancel. RED in WebKit and Chromium (2 failed), then retained vertical state through cancellation and added pointer-leave cleanup. GREEN: 3 targeted passed, 1 CDP-only skip; real Chromium touch scroll and horizontal touchCancel also passed.
- 5.5: npm run test:unit -> 118/118 (11 files); npm run test:e2e -> 115 passed, 2 expected CDP-only skips in WebKit/desktop, with typecheck/build and all three projects. Logs: /private/tmp/gift-stage5-unit-green.log, /private/tmp/gift-stage5-full-e2e.log. git diff --check passed. No production dependencies added.
- Visual inspection: actual WebKit screenshots /private/tmp/gift-stage5-{table,back,car-note,bueno-spot,bueno-note,dress-spot,dress-note}.png, all illustrations loaded, no JS errors, source focus/body scrolling restored. Pouch secret target bounds exceeded 44px. Physical iPhone/Yandex/VoiceOver/flicker/acoustic quality remain manual.
- Local dev server was not running; started Vite for owner review at http://192.168.0.160:5173/gift/ (session 38140). No commit, push or deployment. Fresh final review and fix pass recorded below.
- Fresh read-only final reviewer confirmed two Important findings, no Critical/Minor: portalled cancel bubbled into the pouch and left scroll locked; long 60×55px diagonal movement stayed pending and generated press. Implementer's additional visual check found 320px/200% note-header overflow. All reproduced in new E2E (10/10 RED on WebKit/Chromium), /private/tmp/gift-stage5-review-red.log.
- One fix pass: ScenePanel stops cancel propagation; chest suppresses click beyond movement slop independently of axis choice; back-label span can shrink/wrap inside the header. Targeted regression GREEN: 10/10 in WebKit/Chromium, /private/tmp/gift-stage5-review-green.log. Final full suite: 118/118 unit and 130 E2E passed + 2 expected CDP-only skips, including fresh build/typecheck. Logs: /private/tmp/gift-stage5-final-unit.log and /private/tmp/gift-stage5-final-e2e.log. No second review dispatched.
- Final: Ruling: deferred finale/envelope/gift redesign stays out of stage 5 by explicit owner instruction — cost: the current letter still uses the earlier modal/second-bottom flow and no gift catalogue yet.
- Final: Ruling: real dress photo, final notes/bonus/letter/voice remain later content work; current art and copy are editorial drafts — cost: personal release still needs owner materials/approval.
- Final: Ruling: physical iPhone/Yandex/VoiceOver/acoustics/compositor behavior are not established by browser tests — cost: owner's device review remains required.
- Final: Ruling: visual hover/focus effects stay excluded by owner's explicit choice; keyboard interaction/focus restoration remain functional — cost: no visible keyboard focus ring.
- Final: minor (previously deferred): second-bottom paper sound can be cancelled by leaving-letter cleanup. Retained under owner's deferred sound/finale rework; new secret-found effects are wired to the existing optional provider.

- Final verification: all 29 changed/new text files checked for whitespace/EOF and Markdown local links; no issues. Post-fix WebKit narrow-note screenshot /private/tmp/gift-stage5-narrow-note-fixed.png has no horizontal overflow. Finale/bonus screenshots also inspected.
- Stage 5 tasks 5.1–5.5 complete for manual checkpoint. Owner should inspect subtlety of the three spots, illustrated CSS depth/turning, scroll and repeated touches on the actual iPhone/Yandex. Stage 6 not started. No commit, branch, push or publication.

## Owner feedback after stage 4 — recorded, implementation deferred

- Stage 4 committed as 2d1fc8a. Owner explicitly requested documentation only, with implementation later.
- Requested: after the fourth key, lock flies off, chest opens/enlarges to full screen and letter flies forward; rotatable envelope that must be flipped and tapped; letter as a standalone sheet instead of a modal; replace second-bottom action with a transition to the eventual real gift-selection sheet; replace/refine sounds.
- Full notes: docs/design/2026-11-10-finale-feedback.md, linked from the plan. These supersede the old final-flow direction for future work but are not implemented. Gift content/budget/rules remain undecided. No application code or tests changed; no commit, branch, push or deployment.

## Stage 4 — technically complete, awaiting owner review

- Owner requested the next checkpoint after committing stage 3. Scope: chest, envelope, draft letter, second bottom and optional audio. No Git operations or publication.
- Pre-flight 3→4: existing opening events/flags and storage already model stable scenes; reconnect the table callback only with real finale components. Audio owns transient playback, never progress storage. Stage 5 alone adds secret totals; stage 7 adds gift selection.
- Ruling: preserve revision 2 and the existing reducer — opening guards and all three reload round-trips pass new tests already; no save migration is necessary. Cost if wrong: incompatible content would need a later explicit revision.
- Ruling: show an explicitly marked editorial letter draft, with no voice player until a real voiceSrc exists — the plan permits draft copy and requires a complete text fallback. Cost if wrong: the owner must replace/approve wording and provide voice before final release.
- 4.1: 39/39 reducer tests pass, including new 0–3 key guards, ordered opening round-trips and revisits without secrets. UI RED failed on the absent chest dialog after four keys and a deliberate tap (/private/tmp/gift-stage4-finale-red.log).
- 4.2: ChestScene, LetterScene and FinaleScene now consume the existing events. All openings save synchronously before presentation, no animationend/timer owns progression. Chest callback reconnected, stable locked-chest art and focus behavior preserved. New transparent artwork inspected and saved in src/assets/scene/; exact prompts recorded in docs/design/stage-4-asset-prompts.md.
- 4.3: initial component run reported the missing modules (not a behavior assertion); after implementation, jsdom's missing dialog methods required a test-local shim. Corrected unsupported RTL role option caught by typecheck. A meaningful additional RED reproduced an older pending play() pausing a newer request (1 failed / 5 passed); generation check now discards that old completion. Log: /private/tmp/gift-stage4-play-race-red.log.
- 4.4: local Web Audio paper/unlock/found effects are off on fresh mount; HTML audio is separate and registered with the provider. Voice stops on hidden/pagehide, back and unmount; pending operations cannot resume themselves. Play rejection/media error leave text and retry controls. No production dependencies or real voice file added.
- Ruling: test browser media failures in an isolated Vite fixture using the real LetterScene and a generated CC0 test tone; keep the ordinary game on the production preview. The fixture and WAV are outside dist, with no runtime override in the game. Cost if wrong: test runs also need local port 4174; acoustic quality still needs a real phone.
- 4.5: npm run test:unit -> 114/114 (10 files). Targeted mobile finale checks -> 8/8; npm run test:e2e -> 96/96 across WebKit/mobile Chromium/desktop Chromium, including typecheck and production build. Logs: /private/tmp/gift-stage4-unit-green.log, /private/tmp/gift-stage4-audio-e2e.log, /private/tmp/gift-stage4-full-e2e.log. git diff --check passed.
- Visual inspection: WebKit 440×956 screenshots /private/tmp/gift-stage4-{chest,letter,ending}.png; 400px panels with no horizontal overflow. Letter scrollHeight 1518, viewport panel 922; chest/ending fit. Existing LAN Vite preserved at http://192.168.0.160:5173/gift/. Native browser chrome, physical iPhone/Yandex, VoiceOver and audio quality remain manual.
- Additional browser check: 320×480 / 200% text screenshots inspected; sound toggle does not overlap dedication, the signature and second-bottom action remain reachable. Real Web Audio toggle and opening actions produced no JavaScript errors. New-file whitespace/EOF and relative Markdown links validated; fixture HTML/WAV are absent from dist.
- Final review: fresh read-only reviewer found no Critical/Important and one confirmed Minor. It inspected the diff/new files, screenshots and green logs, and reproduced the sound issue with real Web Audio on the production build. No implementation fix pass required.
- Final: minor (deferred to stage 5): LetterScene schedules paper on opening the second bottom, but its unmount cleanup calls stopVoice/stopEffects and cancels the pending effect. The transition and save work; align transition SFX with leaving-scene cleanup during animation polish without adding reload autoplay.
- Final: Ruling: secret totals and gift sheet set aside by review — retain the approved stage 5/7 boundary; no fake catalogue or disabled gift action — cost: gift selection is not playable in this checkpoint.
- Final: Ruling: final letter and real voice set aside by review — keep the explicitly labelled editorial draft and null voiceSrc until owner materials arrive — cost: the game is not ready for personal release yet.
- Final: Ruling: physical iPhone/Yandex/VoiceOver/acoustic quality set aside by review — browser automation verifies behavior, while device acceptance stays with the owner — cost: no real-device/audio-quality acceptance is claimed.
- Final: Ruling: visual hover/focus effects set aside by review — preserve the owner's explicit exclusion with functional keyboard navigation/focus restoration — cost: no visual keyboard ring by deliberate owner choice.
- Stage 4 complete for manual acceptance: 114/114 unit/component and 96/96 E2E plus build/typecheck; no blocking review findings. No branch, commit, push or deployment. Stage 5 has not started.

## Scope and decisions

- Current checkpoint: stage 5, secrets and rotating chest; stages 1–4 are committed. Stages 6–7 remain pending.
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

## Stage 2 — first task and persistence

- Owner accepted the previous result and explicitly requested the next checkpoint. Stage 1 is accepted for continuation; this does not establish any additional physical-device checks.
- Implemented the shared progress/events/session contracts, a pure reducer and one GameProvider. Keys are derived from completed pouch IDs. Consecutive synchronous events use the latest ref; each result is written before React renders rewards.
- Storage validates schema/content revision, known IDs, quiz answers, task kind, flags and scene prerequisites. Repeated IDs are deduplicated. Invalid snapshots recover to a clean start; denied reads/writes/getters keep the game usable in memory with a short notice.
- Only the beginning quiz is defined in this revision; drafts for unimplemented tasks are rejected until stage 3 defines their valid IDs and mechanics. Other pouches remain previews. Future scene/flag contracts are validated now, while the corresponding UI remains scheduled for stage 4.
- First question uses the confirmed song title, with source content marked draft. A correct answer saves completion before a brief pouch/key animation. Reload/revisit shows the stable reward; animation is not persisted or required to grant a key.
- Restart is inside a separate menu, with cancel/confirm. Menu visibility is transient; confirming immediately saves a clean table. Restoring a pouch after reload has a concrete table-button focus target.
- RED: reducer/storage and quiz/provider tests failed because the corresponding modules were absent. The first WebKit integration test failed on the absent quiz radio before scene integration. Read/write-error tests caught a prematurely cleared unavailable status; it now remains truthful for that session.
- Final GREEN: `npm run test:unit` 49/49; `npm run test:e2e` 63/63 across mobile-webkit, mobile-chromium and desktop-chromium, including typecheck/build. `git diff --check` passed.
- Independent review found one Important defect: storage notices outside a modal became inert and invisible while playing; the menu also promised saving unconditionally. RED: the WebKit assertion for a notice inside the active dialog failed. Fixed with a shared StorageNotice placed in the active scene, a live region and status-aware menu copy. GREEN: the whole unit/E2E suite above; E2E checks the warning in the question, reward, table and menu.
- Visual check: inspected WebKit screenshots of the quiz, reward and restart at 440×956. Corrected the cascade order of the compact pouch-art override so the task illustration uses its intended size. No image replacement or new assets needed.
- Final: minor (deferred): confirm reward announcement with physical VoiceOver in stage 6; mounting a live region with its text may not announce consistently. WebKit runtime keeps activeElement on the dialog after the form disappears; navigation remains available. This is not a claim of VoiceOver acceptance.
- Review scope follows the staged plan: other task mechanics (3), chest/letter/audio and media errors (4/6), secrets (5), real content/device/native chrome (6), gifts (7) remain intentionally pending. Cost of these boundaries: this checkpoint offers one obtainable key, not a complete playable finale.
- Stage 2: technical implementation complete, awaiting the owner's manual review using docs/testing/manual-checks.md. Stage 3 not started.
- No production dependencies, generated assets, Git operations or publication added. Stage 3 will start only after the owner's manual checkpoint.

## Stage 2 refinement — four memories

- Owner accepted the sequential four-question proposal and supplied the order/answers: beach; first flowers 28 March 2024; first date 16 February 2025; KitKat fourth. The short design is recorded in the existing spec and task 2.6 in the existing plan.
- Ruling: store questionId, selectedId and confirmed, derive the question position from the ordered content — no duplicated key counter or answer-history engine is needed. Confirmed feedback survives reload before Next. Cost: no answer-history review UI, which was not requested.
- Ruling: contentRevision becomes 2, using the existing incompatible-save recovery for the old single question — its previous key cannot count as completing four questions. Cost: old development progress starts again with the visible recovery notice.
- The optional bouquet photo has not been supplied; no substitute personal photo or event is invented. Wrong options, hints and success copy remain editorial drafts. No dependency, branch or commit is needed.

- RED: new component/storage tests failed against the single-question implementation (10 failed / 21 passed); questions/progress were absent and the parser discarded or ignored new draft fields. Log: /private/tmp/gift-four-questions-red.log.
- GREEN: typed nonempty questions, confirmed current-question draft, strict per-question validation, revision 2, feedback/Next and legend focus implemented; 56/56 unit/component and 66/66 E2E passed before review.
- Final review: fresh read-only reviewer found one Important, no further Critical/Important/Minor: saving final confirmed draft before completion could leave an unusable Next after a partial storage failure.
- Final: fixed final-save dead end — two tests (failed completion write + remount/retry; existing final-confirmed draft completion) observed 2 RED / 3 GREEN before the fix, then 58/58 unit/component passed. Final answer now calls only onSolved, so reward uses one save; existing confirmed final states can also finish. Logs: /private/tmp/gift-four-questions-review-red.log and /private/tmp/gift-four-questions-final-unit.log.
- A test callback required an explicit this: Storage annotation; typecheck caught it and it was corrected before the final build. No any or suppressions added.
- Final verification: npm run test:e2e → 66/66, including typecheck and production build, WebKit/mobile Chromium/desktop Chromium. Log: /private/tmp/gift-four-questions-final-e2e.log. The existing stage1 feedback/animation/background checks remain green.
- Visual inspection: /private/tmp/gift-four-questions-first.png and /private/tmp/gift-four-questions-flowers.png, WebKit 440×956, 400px dialog, all controls fit/reachable. Original localhost Vite processes were preserved; no server or browser from this refinement remains running.
- Final review boundaries: real iPhone/native chrome/VoiceOver are still manual stage6 acceptance; automatic 320px/200%/reduced-motion checks pass. Draft editorial copy is for the owner's review, and stages3–7 remain pending. Cost: no claim of physical-device acceptance or a complete game.
- Stage 2 refinement: technically complete, waiting for the owner's phone review. No production dependencies, commit, push, branch or deployment added.


## Stage 3 — remaining tasks (technically complete, awaiting owner review)

- Owner explicitly requested the next part, accepting the stage 2 checkpoint for continuation. Work remains in the current checkout; no branch, commit, push or deployment is authorized by this request.
- Pre-flight: stage 2 quiz draft/IDs stay unchanged; stage 3 extends TaskDefinition and per-pouch content, storage validation consumes those same definitions, and PouchScene dispatches the existing save-draft/complete-pouch events. Stage 4 consumes the derived four-key readiness; its UI remains pending.
- Ruling: keep contentRevision 2 because stage 2 saves remain valid with the added task definitions — preserve the existing quiz key and partial answers. Cost if wrong: an incompatible old draft would need recovery; explicit round-trip/compatibility tests cover the unchanged quiz shape.
- Ruling: use generated illustrated travel postcards, the clearly labelled game phrase «С тобой навсегда», and a draft family still life with a heart on a swaddle blanket. These are reviewable placeholders allowed by the plan, not invented photos, personal possessions or a proposal quote. Cost if wrong: the owner will replace/edit the draft content before final publication.
- 3.1 RED: storage rejects photo/phrase/detail drafts and drops inspected details (2 failed / 70 passed across storage and progress). All 24 reducer orders already pass, requiring no reducer rewrite. Log: /private/tmp/gift-stage3-storage-red.log.

- 3.1 RED: component files were absent on their first run; the browser-level travel test failed on the absent Turkey radio after a successful build. Logs: /private/tmp/gift-stage3-components-red.log and /private/tmp/gift-stage3-ui-red.log. Initial localhost EPERM was resolved by the approved sandbox escalation, not by changing test expectations.
- 3.2 GREEN: PhotoTask, PhraseTask and DetailTask are controlled, storage-independent components. Shared per-pouch content contains task/reward and draft status. PouchScene uses the existing event contract for all four tasks. Native labelled radios/buttons remain usable without images; phrase words use IDs, support removal/clear and duplicate labels.
- 3.3 GREEN: all 24 permutations and repeated completions yield exactly four keys without modifying the existing reducer. Browser helpers solve through real UI; two orders, wrong guesses, partial phrase/photo/detail restore, missing media and 320px/200%/reduced motion all pass.
- Preserved contentRevision 2 and the unchanged quiz draft shape, as above. Parser validates each kind against its own task IDs; repeated detail visits deduplicate, repeated word-token IDs reject. Newly generated assets live in src/assets/content/; prompts and personal-material checklist are recorded in docs/design/stage-3-asset-prompts.md and docs/content/personal-materials.md.
- Found an integration boundary before final review: the previous App callback saved chestOpened without any opening scene. RED: new WebKit check read true after collecting four keys and pressing the chest. Removed the callback until stage 4, leaving readiness visible and the flag false. Log: /private/tmp/gift-stage3-chest-red.log. The existing TableScene optional callback still works in its unit contract.
- 3.4 GREEN: npm run test:unit -> 99/99 (8 files), targeted mobile puzzles/progress -> 24/24, npm run test:e2e -> 84/84 (WebKit/mobile Chromium/desktop Chromium), typecheck/build and git diff --check pass. Logs: /private/tmp/gift-stage3-final-unit.log, /private/tmp/gift-stage3-mobile-e2e.log, /private/tmp/gift-stage3-full-e2e.log.
- No production dependencies, branch, commit, push or deployment. Stage 3 awaits owner phone review; stage 4 remains pending.

- Visual check: inspected WebKit screenshots at 440×956 after panel-arrive finished (opacity 1), saved as /private/tmp/gift-stage3-{journey,proposal,family}.png. All panels are 400 CSS px wide; journey scrolls to the check button, phrase and detail fit within the available height. Heart hotspot aligns with the visible embroidery. Existing developer Vite process on *:5173 is preserved; screenshot browser closed normally. This does not establish physical iPhone or VoiceOver acceptance.
- Final fresh-context review requested via requesting-code-review, read-only against base c95c45b plus all current/untracked additions. No per-task implementer agents or Git changes.

- Final review: fresh read-only reviewer found no Critical, Important or Minor findings; no fix pass required. It reviewed the current diff/new files, artwork and screenshots without rerunning the already green suite.
- Final: Ruling: future chest/letter/audio/secrets/gift flows set aside by the reviewer — these are explicitly later checkpoints; stage 3 correctly stops at four-key readiness and does not save an unshown opening — cost: this checkpoint has no playable finale yet.
- Final: Ruling: physical iPhone/Yandex/VoiceOver set aside by the reviewer — WebKit/Chromium and screenshots verify the browser implementation, while device/native chrome/assistive behavior remains the owner's manual gate — cost: no physical-device acceptance is claimed.
- Final: Ruling: final personal assets/editorial wording set aside by the reviewer — sources and UI label the invented visual/phrase drafts, while real memories remain limited to supplied facts — cost: owner approval/replacement remains necessary before the final personal release.
- Stage 3 complete for manual acceptance: 99/99 unit/component and 84/84 E2E plus build/typecheck, independent review clean. See docs/testing/manual-checks.md, stage 3. Local Vite is available at http://192.168.0.160:5173/gift/ (en0 IPv4 verified through Node). No stage 4 implementation or Git mutation performed.
