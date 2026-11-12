# Иллюстрации «Как росла наша семья»

Созданы 12 ноября 2026 года встроенным `image_gen.imagegen`.
Текущие ассеты панорамы и их prompts — в разделе обновления ниже.

## Источники и обработка

- IMG_1527.JPG — предоставленная владельцем фотография Томаса. Референс
  полосатой шерсти, круглой головы, вислоухих ушей и янтарных глаз.
- IMG_1216.HEIC — предоставленная владельцем фотография Шелби. Референс
  чёрно-белой шерсти, голубых глаз, розового носа с тёмными пятнами и синего ошейника.
  Для чтения HEIC локально декодирован FFmpeg в PNG и уменьшен через sips до 1400 px.
- family-keepsakes.webp — прежний натюрморт, только референс стиля и палитры.
- Святослав — условный нарисованный младенец; портретный референс не предоставлялся.
- Первая версия комнаты — художественный вымысел; текущая панорама создана
  по фотографиям настоящего дома (см. обновление ниже).
- Исходные личные фотографии не копируются в сайт. Люди, бутылки и фон
  фотографии Шелби не переносятся в иллюстрацию.

## Исходные ресурсы первой версии

| Ресурс в src/assets/content/ | Размер | Bytes | Прозрачность |
| --- | --- | ---: | --- |
| family-room.webp | 1536×1024 | 271266 | Нет |
| family-characters.webp | 1536×1024 | 386706 | Alpha сохранена |

Атлас: три столбца (Томас, Шелби, Святослав), две строки (исходная поза,
моргание/поднятый хвост/поднятая ручка), каждая ячейка 512×512.
Смена двух поз через CSS после правильного ответа; анимации конечные и
отключаются при prefers-reduced-motion. Координаты и масштабы в src/game/family.ts.
Фон: cwebp -q 86 -metadata none; атлас: cwebp -q 88 -metadata none.
Прозрачность углов и промежутков атласа проверена по canvas RGBA в браузере.

Оригиналы генерации сохранены в стандартном каталоге imagegen:
- Фон: exec-e44ab887-ba05-4ff6-835e-0b508c9f29a3.png
- Атлас: exec-d9638b2c-3dd8-4d4a-a007-c2369dbfcf6a.png

## Точный prompt фона

```text
Use case: illustration-story. Asset type: background layer for a small romantic family game, 1536x1024 landscape image, aspect ratio exactly 3:2.
Create a cozy, softly painted watercolor living room, matching the supplied style-reference image's peach, dusty rose, cream and muted lavender colors, delicate paper texture and gentle antique storybook illustration quality. View straight into a room. A cream sofa occupies the left half in the middle distance, a plain peach cushion on its left seat; a soft oval cream rug lies across the lower foreground, with uncluttered open space in its right half; on the right side stands a short low wooden bedside table and softly draped curtains framing a warm window. A small vase of pink peonies on an upper shelf, a folded lavender blanket, warm evening light, quiet and intimate, believable simple room perspective.
Composition is functional: leave the sofa seat region centered around x=28%, y=47% unobstructed for a cat layer; leave rug around x=65%, y=73% open for a dog layer; leave upper-right middle area around x=77%, y=43% open for a separate baby-in-bassinet layer. Render no characters at all, no animals, no people, no cradle/bassinet (it comes in a separate layer). No text, numbers, badges, hearts floating in air, labels, watermark or frame. The result must be one continuous painted room background, not a collage or UI mockup.
```

## Точный prompt атласа

```text
Use case: illustration-story. Asset type: transparent sprite atlas for a romantic family web game. Generate one image exactly 1536x1024, transparent background, organized as EXACTLY THREE EQUAL COLUMNS and TWO EQUAL ROWS of 512x512 cells. No cell borders or labels. Keep generous transparent padding inside each cell. All subjects fully visible and contained within their own cell.
Reference 1 is Thomas the cat: preserve his recognizability, round head, folded Scottish Fold ears, grey-brown tabby striped short fur, amber round eyes, pale chin. Reference 2 is Shelby the husky: preserve her black/grey back, bright white face/chest, black facial mask framing pale blue eyes, a distinctive pink nose with dark patches, blue collar; ignore all the reference photo background, people, bottles and furniture. Reference 3 is STYLE ONLY: soft watercolor with peach, cream, dusty pink and lavender palette, paper grain, delicate warm storybook brushwork. Animals retain their real fur colors.
TOP ROW, column 1: Thomas curled up comfortably looking toward viewer, eyes open, body and paws complete, centered at bottom of cell with transparent surround. Column 2: Shelby lying down facing slightly left toward viewer, with upright ears, front paws visible, happy relaxed mouth and a long visible fluffy tail extending along her RIGHT side (within this cell). Column 3: a tiny newborn boy sleeping safely on his back in a small low oval woven bassinet, light peach sleepsuit, head visible, baby has short soft dark hair and one little hand resting near his chest; bassinet side low enough to see the hand, no canopy, no loose toys near baby.
BOTTOM ROW has the EXACT SAME THREE SUBJECTS at EXACTLY THE SAME SCALE AND POSITION WITH IDENTICAL SILHOUETTES except ONE subtle animated detail per subject: column 1 same cat but eyes gently CLOSED (blink); column 2 same dog with tail angled a little higher (small wag); column 3 same bassinet and baby but one small hand lifted beside his head. Bodies, heads, faces, bassinet and shading must otherwise remain registered with top row; this is a two-frame animation, NOT different poses or angles. Reuse the same designs precisely. No shadows outside subject silhouettes, no ground plane, no text, numbers, grid lines, labels, decorative hearts, watermarks or other objects. Actual alpha transparency.
```

## Обновление: панорама настоящей комнаты

Владелец выбрал панораму со свайпом и уточнил место кроватки:
на ковре между маленьким комодом справа от балкона и деревянным разделителем
кухни и комнаты. Фотографии IMG_2194.JPG, IMG_2195.JPG, IMG_2196.JPG —
референсы планировки; IMG_1819.HEIC — референс комода, зеркала, растений и Томаса.
HEIC локально декодирован FFmpeg в PNG; исходные фотографии в сайт не включены.

Фон воспроизводит узнаваемые предметы и их взаимное расположение, но остаётся
художественной иллюстрацией. Вид самой кроватки условный: подтверждено место,
портретного референса ребёнка и отдельной фотографии кроватки нет.

### Текущие ресурсы

| Ресурс в src/assets/content/ | Размер | Bytes | Обработка |
| --- | --- | ---: | --- |
| family-room-panorama.webp | 1774×887 | 311310 | cwebp -q 85 -metadata none |
| family-crib.webp | 1024×512 | 105090 | cwebp -q 88 -resize 1024 512 -metadata none, alpha сохранена |
| family-characters.webp | 1536×1024 | 386706 | Повторно использованы столбцы Томаса и Шелби исходного атласа |

Оба новых исходника получены встроенным imagegen в размере 1774×887 (2:1);
фон оставлен в этом размере, атлас кроватки уменьшен до 1024×512.
В атласе кроватки два квадратных кадра расположены горизонтально: покой и поднятая ручка.
Старый фон family-room.webp и третий столбец старого атласа больше не используются интерфейсом.

Оригиналы генерации:
- Фон: exec-4916b37c-bd86-436f-b734-637c13a91d22.png
- Кроватка: exec-4328dac0-6891-4d03-8e2b-5919ab4381f6.png

### Точный prompt панорамы

```text
Use case: illustration-story. Asset type: a wide background painting for a horizontal swipe-to-search family web game, 3072x1536, EXACTLY 2:1 landscape.
Input images 1, 2 and 3 show the SAME real small studio living room and kitchen from different angles. Input 4 shows its long white dresser with oak countertop, large circular illuminated mirror, houseplants and cat: use it as a FURNITURE reference only. Input 5 is STYLE reference only.
Create a single coherent wide watercolor illustration faithfully based on this real home. Preserve the modern modest apartment's recognizable furniture, proportions, light grey floor, grey upholstered sofa, low white dresser with oak top and round mirror, broad grey curtains and sheer white curtains over a balcony door, pale grey/beige patterned rectangular rug, small white chest of drawers near the balcony, vertical natural-oak slat divider between living room and kitchen, white compact corner kitchen with undercabinet warm light, black oven, white small fridge, round oak dining table and grey upholstered dining chairs, and black geometric wire pendant lamp with warm amber bulb. Keep the real grey, white and oak colors, warmed gently by peach/cream light and soft lavender evening shadows. Do not turn it into a generic pink Victorian room.
Composition for a continuous horizontally panning scene: the left quarter contains the long white oak-topped dresser, a houseplant and a round mirror, with the grey sofa in the left foreground. Center-left shows the balcony and grey curtains. Center-right shows the SMALL white chest of drawers immediately to the RIGHT of the balcony; a clear small crib-sized floor gap on the patterned rug immediately to the RIGHT of this small chest; then the tall oak slat divider immediately to the RIGHT of that gap. This order is essential: balcony -> small dresser -> EMPTY CRIB SPACE ON RUG -> wooden divider -> kitchen. The baby crib will be added as a separate transparent sprite, so leave that floor space visible and EMPTY. Put the white kitchen and dining table in the right quarter. View slightly down from natural standing eye level so the rug, dresser tops and the future crib are visible. Show a complete inviting room, with moderate everyday objects (plants, books, folded throw, framed pictures, a mug), enough visual detail for a gentle hidden-object game.
Important functional composition: approximately x=18% is an open spot on the oak top of the left dresser, for a small cat sprite; approximately x=62–66%, y=72% is the empty crib floor space BETWEEN the small chest and slat divider on the rug; approximately x=88%, y=83% is floor near the dining chairs, for a small dog sprite. All these regions must be visible and accessible, without large objects covering them.
No animals, people, babies or crib anywhere: characters and the crib are separate layers. No text, labels, arrows, numbers, frames, UI or watermarks. No tiled panels, no multiple views, no fisheye distortion. Fine watercolor paper grain and delicately painted realistic household details consistent with reference 5.
```

### Точный prompt кроватки

```text
Use case: illustration-story. Asset type: transparent two-frame sprite sheet for a small hidden-object family game. Exactly 1024x512, TWO EQUAL SQUARE CELLS SIDE BY SIDE, each 512x512. Actual alpha transparency, no backgrounds or grid lines.
Input image is STYLE and CHARACTER reference: only the newborn boy in its third column is relevant. Replace the oval wicker basket with a proper small WHITE WOODEN RECTANGULAR BABY CRIB standing on four short legs, with slim vertical white rails, simple pale oak top rails, a fitted pale lavender mattress. Show the crib in a three-quarter view from slightly above, front long side visible, aligned to a room viewed from standing height. The crib must rest on the floor, and the entire crib including all legs must fit in each square cell with 25px transparent margins. The newborn lies on his back naturally in the crib, tiny relative to the crib, with short soft dark hair, peach sleepsuit, eyes peacefully closed and his face clearly visible above/through the rail; no loose pillows, toys or blankets. Retain the gentle warm watercolor illustration style with the reference baby's colors and fine paper grain. No canopy, wheels, bedding decorations or labels.
LEFT CELL is the resting pose: one tiny hand next to chest. RIGHT CELL is EXACTLY the same crib, perspective, scale, position, baby face and body, with only that tiny hand moved up gently beside his head. These are registered animation frames; don't change the crib silhouette or the baby's head between frames.
The crib should be realistically rendered as a floor-standing rectangular cot, NOT a wicker basket or bassinet. No other characters, furniture, scenery, text or ground/shadows outside the crib. The rest of the image must be genuinely transparent.
```
