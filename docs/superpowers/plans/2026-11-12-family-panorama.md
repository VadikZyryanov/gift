# Family Panorama Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans. Execute the owner-approved extension inline, without Git mutations or test execution.

**Goal:** Turn the family memory puzzle into a small-character search across a panorama of the real room.

**Architecture:** Keep the family draft, answer validation and revision 5. Reuse FamilyPicture in search and reward; add native horizontal panning, an optional search hint and an in-scene answer card. Replace the background and baby art; keep the animal atlas.

**Tech Stack:** Existing React, TypeScript, native scrolling, CSS, built-in imagegen/WebP.

**Spec:** docs/superpowers/specs/2026-11-12-family-story-design.md (panorama extension)

## Global Constraints

- Baby's crib stands on the rug between the small dresser and the wooden kitchen divider.
- No dependencies, Git mutations, publishing, test execution, or reference photos in the site.
- Preserve partial answers and all earned keys; revision remains 5.

## Review Focus

- Swiping a character must pan without accidentally opening its answer card.
- Small art must retain 48 px touch targets and keyboard access without visible search spoilers.
- Closing a card must preserve its date and allow returning to the same part of the panorama.
- Missing art must retain readable named choices and the complete puzzle.
- Narrow screens, large text, reduced motion and saved completed answers remain usable.

### Task 1: Room and crib art

- [x] Generate and inspect a wide room painting from the four supplied references.
- [x] Generate a transparent two-pose crib atlas; keep the cat/dog atlas unchanged.
- [x] Add image/atlas metadata and search hints to family content; adjust placements to the final background.

### Task 2: Panoramic interaction

- [x] Add a family fullscreen variant to ScenePanel and omit the decorative pouch in this variant.
- [x] Add native horizontal viewport, arrow navigation and keyboard panning to FamilyPicture.
- [x] Hide tags until selection/confirmation; guard taps against drag gestures and retain accessible buttons.
- [x] Put the date card in an accessible overlay, with dismissal, focus return and saved partial answers.
- [x] Add an optional location hint for an unconfirmed character and preserve completion/reward behavior.

### Task 3: Verification and documentation

- [x] Update the previously authorized FamilyTask component test for card navigation; do not execute it.
- [x] Inspect the layout in a local browser; run npm run build and git diff --check.
- [x] Obtain a read-only independent review and address material findings.
- [x] Document exact prompts, asset provenance, implementation decisions and verification limits.

## Execution record

- Owner approved the panorama and corrected the crib location; proceed without another approval gate.
- Existing checkout retained per owner's Git restrictions. No TDD execution per explicit test policy.

- Art complete: room 1774×887, crib atlas 1024×512 with alpha, animal atlas reused.
  Final crib is on the rug between the small dresser and the wooden divider.
- Native pan and compact modal date card implemented; tags hidden until a find.
  A saved selected member does not auto-open the card on mount: this preserves
  the search and avoids nested modal ordering before the scene dialog opens.
- Revision 5 and the existing draft schema retained; dates and earned keys unchanged.
- Independent read-only review found a reward width specificity issue, wide-screen
  aspect distortion and missing fullscreen safe-area padding. All three corrected.
- Component test updated within prior authorization, with native browser API doubles
  matching the existing test conventions. Tests intentionally not executed.
- Browser visual preview at 390 and 320 px: room, crib position, compact question
  card, arrow navigation and Escape return. Physical touchscreen swipes not verified.
- npm run build and git diff --check passed; no Git mutations, dependencies or publishing.
