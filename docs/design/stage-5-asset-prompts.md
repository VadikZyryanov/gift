# Stage 5 asset prompts — 11 November 2026

Built-in `image_gen.imagegen`, four separate calls, transparent background requested.
All outputs inspected before resizing with `cwebp -q 85`. Existing front chest retained.
The original dress was an editorial stand-in. On 11 November 2026 it was replaced
with a reference-based illustration using the owner's IMG_2168.jpg. The same photograph
was later added to the proposal postcard as `content/proposal-evening.webp`.
The other stage-5 assets retain their original prompts below.

## back

- Source: `/Users/vadikzyranov/.codex/generated_images/01a1c085-d29f-73d2-beb2-c16ca768464f/exec-cfd103c1-8e96-4dea-9131-ac1fd9d74548.png`
- Project asset: `src/assets/scene/secret-chest-back.webp`
- Size: 840×480.

```text
Use case: precise-object-edit. Asset: back face of the romantic treasure chest for a CSS Y-axis turn in a mobile game. The input is the FRONT of the chest. Draw the SAME chest seen directly from the BACK: same wide straight-on silhouette, closed rounded lid, berry burgundy painted wood, fine gold botanical vine inlay, antique brass side bands/rivets. Replace front heart padlock with two small brass hinges at lid seam. No front lock, no car, no stickers, no text. Same warm storybook painterly material, object proportions and scale, centered with about 5% transparent margin. Orthographic head-on rear view, zero sideways perspective. One chest only, genuinely transparent background. Preserve the visual identity and front image bounding box.
```

## dress

- Source: `/Users/vadikzyranov/.codex/generated_images/01a1caa4-700e-7491-8cc7-4fd446017977/exec-3d178073-fc2e-48df-8868-d0d8cb7367da.png`
- Garment reference: owner-supplied `IMG_2168.jpg`; previous asset used for style only.
- Project asset: `src/assets/content/secret-green-dress.webp`
- Size: 512×768, 36 194 bytes; `cwebp -q 85 -resize 512 768`, alpha preserved.
- Built-in imagegen, `transparent_background: true`, two visible reference images.
  Direct local reference paths were unavailable to imagegen, so the same inspected
  images were supplied through `num_last_images_to_include: 2`.

```text
Create a replacement collectible dress illustration for an existing intimate romantic storybook game. Of the TWO provided images, the couple's seaside sunset PHOTO is the EXACT GARMENT reference; the isolated hanger illustration is STYLE/PRESENTATION ONLY. Draw the emerald green dress from the woman in the PHOTO ALONE on a simple elegant wooden hanger, preserving its recognizable construction: deep saturated emerald green, wide off-shoulder neckline with bare shoulders, short softly puffed draped sleeves, softly gathered fitted waist, flowing calf-to-ankle length skirt with a high slit on the viewer's RIGHT. Garment reference has smooth softly flowing fabric, not the gold-decorated formal gown in the illustration. NO thin straps, NO golden appliques, NO ornate gold flowers, NO floor-length train, NO layered ruffle cascade. Remove the current asset's shoulder straps and gold decorations. Use restrained painterly storybook rendering, natural soft folds, warm peach/lavender reflected light consistent with the current isolated illustration. Clean full garment silhouette centered in portrait 2:3 composition, simple wooden hanger fully visible, 6% transparent margin around the entire object. NO person, mannequin, limbs, face, shoes, sea, sunset, photo background, text, frame or card. The source photograph is only a reference for the green dress, do not recreate the people. Genuinely transparent background. Save the generated PNG to the filesystem and return its absolute path in output_hint so it can be installed into the project.
```

## bueno

- Source: `/Users/vadikzyranov/.codex/generated_images/01a1c085-d29f-73d2-beb2-c16ca768464f/exec-42a9d206-fc20-4f3b-b27a-5d5c2b71485b.png`
- Project asset: `src/assets/content/secret-white-bueno.webp`
- Size: 640×426.

```text
Use case: illustration-story. Asset: a single sweet collectible for a romantic painterly mobile game. One recognizable Kinder Bueno White white-chocolate wafer snack in an opened cream-and-white wrapper with a small red lower accent. One pale ivory segmented white chocolate wafer bar protrudes gently from the wrapper, with tiny hazelnut details on the packaging. Package marking only 'bueno' in soft dark script and small 'white', no other text. Warm storybook hand-painted illustration with detailed glossy white chocolate and delicately crinkled paper; gentle peach/lavender reflected light, romantic keepsake rather than commercial photo. Isolated diagonal snack, fully in frame, centered with transparent margin, no hands, no other objects, no card/frame, no watermark, genuinely transparent background.
```

## car

- Source: `/Users/vadikzyranov/.codex/generated_images/01a1c085-d29f-73d2-beb2-c16ca768464f/exec-8977cd7b-fc48-4ec6-a1ff-5ee06953edee.png`
- Project asset: `src/assets/content/secret-black-g-class.webp`
- Size: 640×426.

```text
Use case: illustration-story. Asset: a miniature black Mercedes-Benz G-Class / G-Wagen collectible for a romantic storybook mobile game. A recognizable glossy BLACK boxy G-Wagen SUV with round headlights, squared body, spare wheel at back and large wheels; elegant front three-quarter view facing left. Charming refined miniature model, detailed painterly illustration, soft warm peach/lavender reflected highlights, small gold details, gentle shading. One car fully visible, isolated centered with generous transparent margin. No person, no road, no landscape, no frame or text, no watermark. Genuinely transparent background. It will be used both as a tiny rear-of-chest sticker and as a larger keepsake illustration.
```
