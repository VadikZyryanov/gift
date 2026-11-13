# Playful interactions

Implement the eight ideas selected by the owner: 1, 2, 4, 5, 6, 7, 8, 10.

- Table: repeatable floating heart, a bun revealed after five dedication taps, petals from the flowers.
- Photos: double tap/click displays a heart and «Люблю нас»; provide keyboard activation.
- Rewards: each newly earned key flies to its table slot on return. The last arrival lights the lock before the existing chest entrance.
- Family: stroke Thomas for hearts and a short synthetic purr, with a keyboard/tap alternative. Preserve search and panorama gestures.
- Finale: tapping the collected car lights its headlights and sends a miniature across the bottom with hearts.
- Letter: a heart by the voice button pulses and emits hearts only during actual playback; pause freezes it.

Use existing React, CSS, SVG and browser animation/audio APIs; no new dependencies or raster assets. Keep progress persistence unchanged: animations are presentation state and never prerequisites for earning rewards. Respect reduced motion, the sound toggle, fast repeated input, scene cleanup and keyboard focus.

Implementation choice: local components rather than an animation package, with one shared reduced-motion hook. Keep the current checkout, do not create branches or commits, and do not create, modify or run tests per the owner's global instructions. Verify with type checking, a production build and diff review.
