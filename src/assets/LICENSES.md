# Происхождение и лицензии ресурсов

## Локальные шрифты

Шрифты скачаны 10 ноября 2026 года из официального Google Fonts без изменений.
Во время работы приложения запросы к Google Fonts не нужны.

Официальный CSS, из которого взяты URL файлов и точные `unicode-range`:
[Google Fonts CSS API — Caveat и Literata, normal 400–700](https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Literata:wght@400..700&display=swap).
Ответ получен с User-Agent Chrome 131, чтобы выбрать WOFF2.

Для каждой семьи использовать два `@font-face`: Cyrillic и Latin. Значения
из CSS Google Fonts: `font-style: normal`, `font-weight: 400 700`,
`font-display: swap`, формат `woff2`. Диапазон включает Regular 400 и
SemiBold 600. Literata предназначена для основного текста, Caveat — для
коротких рукописных акцентов; для длинного текста нужен читаемый serif fallback.

| Семья | Файл | Subset | Размер | Официальный источник WOFF2 |
| --- | --- | --- | ---: | --- |
| Literata | `fonts/literata-cyrillic.woff2` | Cyrillic | 21 008 bytes | [fonts.gstatic.com, Literata v40](https://fonts.gstatic.com/s/literata/v40/or3aQ6P12-iJxAIgLa78DkrbXsDgk0oVDaDPYLanFLHpPf2TbBG_df3-vbgKBM6YoggA-vpK-7cVMA.woff2) |
| Literata | `fonts/literata-latin.woff2` | Latin | 38 996 bytes | [fonts.gstatic.com, Literata v40](https://fonts.gstatic.com/s/literata/v40/or3aQ6P12-iJxAIgLa78DkrbXsDgk0oVDaDPYLanFLHpPf2TbBG_df3-vbgKBM6YoggA-vpO-7c.woff2) |
| Caveat | `fonts/caveat-cyrillic.woff2` | Cyrillic | 77 216 bytes | [fonts.gstatic.com, Caveat v23](https://fonts.gstatic.com/s/caveat/v23/Wnz6HAc5bAfYB2Q7YjYYmg8.woff2) |
| Caveat | `fonts/caveat-latin.woff2` | Latin | 74 932 bytes | [fonts.gstatic.com, Caveat v23](https://fonts.gstatic.com/s/caveat/v23/Wnz6HAc5bAfYB2Q7ZjYY.woff2) |

Суммарный размер WOFF2: **212 152 bytes, около 207 KiB**.

Точный `unicode-range` для обоих файлов **Cyrillic**:

```text
U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116
```

Точный `unicode-range` для обоих файлов **Latin**:

```text
U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
```

Cyrillic включает `Ё/ё` и `№`, Latin — кавычки, длинное тире и многоточие.
Cyrillic-ext и Latin-ext для русского текста и обычной латиницы не требуются.
Проверены WOFF2-заголовки, чтение fontTools, ось `wght` и наличие символов
`ЁёАаЯя№́` / `Aa09«»—…!?` в соответствующих subsets. В файлах Literata
фактическая ось `wght` равна 400–900, в Caveat — 400–700; для подключения
используется общий диапазон **400–700** из полученного CSS.

### Literata

- Семья: [Literata в Google Fonts](https://fonts.google.com/specimen/Literata).
- Авторы: Copyright 2017 The Literata Project Authors
  ([официальный проект](https://github.com/googlefonts/literata)); дизайнер — TypeTogether.
- Лицензия: SIL Open Font License 1.1; полный исходный текст с copyright
  находится в [fonts/Literata-OFL.txt](fonts/Literata-OFL.txt).
- Официальный источник лицензии:
  [google/fonts — ofl/literata/OFL.txt](https://github.com/google/fonts/blob/main/ofl/literata/OFL.txt).

### Caveat

- Семья: [Caveat в Google Fonts](https://fonts.google.com/specimen/Caveat).
- Авторы: Copyright 2014 The Caveat Project Authors
  ([официальный проект](https://github.com/googlefonts/caveat)); дизайнер — Impallari Type.
- Лицензия: SIL Open Font License 1.1; полный исходный текст с copyright
  находится в [fonts/Caveat-OFL.txt](fonts/Caveat-OFL.txt).
- Официальный источник лицензии:
  [google/fonts — ofl/caveat/OFL.txt](https://github.com/google/fonts/blob/main/ofl/caveat/OFL.txt).

## Иллюстрации игры

Сгенерированы встроенным `image_gen.imagegen` для этого проекта по утверждённому
пользователем художественному направлению. Это не фотографии реальных вещей
или семейных событий. Текст не запечён в иллюстрации, прозрачность предметов
сохранена при преобразовании PNG в WebP через `cwebp`.

- `scene/pouch-beginning.webp`, `scene/pouch-journey.webp`,
  `scene/pouch-proposal.webp`, `scene/pouch-family.webp` — сумочки.
- `scene/chest.webp` — закрытый сундук; `scene/decor.webp` — цветочный декор.
- `scene/table-background.webp` — отдельный нарисованный фон.
- [Точные prompts предметов](../../docs/design/stage-1-asset-prompts.md).
- [Точный prompt фона](../../docs/design/stage-1-background-prompt.md).
- [Утверждённый макет](../../docs/design/assets/main-scene-approved.png).

Сторонние предметные фотографии и платные stock-ресурсы не использованы.

## Иллюстрации заданий — этап 3

Четыре отдельных изображения созданы встроенным `image_gen.imagegen` 10 ноября
2026 года, затем уменьшены до 800×600 и преобразованы в WebP через `cwebp -q 82`.
Это нарисованные черновики, не фотографии поездок и не реальные семейные вещи.

- `content/journey-dubai.webp`, `content/journey-turkey.webp`, `content/journey-egypt.webp` — открытки для задания о первой поездке.
- `content/family-keepsakes.webp` — семейный натюрморт с сердечком на пелёнке.
- [Точные prompts](../../docs/design/stage-3-asset-prompts.md).
- [Ожидаемые личные материалы](../../docs/content/personal-materials.md).

## Финал и звуковые эффекты — этап 4

- `scene/chest-open.webp` — открытое состояние существующего сундука.
- `scene/envelope.webp` — нарисованный конверт, без запечённого текста.
- Оба созданы встроенным `image_gen.imagegen`, прозрачность сохранена в WebP.
  [Точные prompts и источники](../../docs/design/stage-4-asset-prompts.md).
- Короткие эффекты синтезируются локально через Web Audio, внешних семплов нет.
- Тестовый `e2e/fixtures/voice-tone.wav` — синтетический тон CC0-1.0,
  [описание](../../e2e/fixtures/LICENSE.md). Не входит в production-сборку.
- Настоящее личное голосовое ещё не предоставлено; `voiceSrc` остаётся `null`.

## Пасхалки — этап 5

- `scene/secret-chest-back.webp` — задняя сторона того же сундука по его лицевой иллюстрации.
- `content/secret-green-dress.webp` — временный рисунок изумрудного платья; это не точное личное платье.
- `content/secret-white-bueno.webp` — нарисованный белый Bueno.
- `content/secret-black-g-class.webp` — нарисованная миниатюра чёрного Mercedes Гелика.
- Созданы встроенным `image_gen.imagegen`, проверены визуально и преобразованы
  в WebP через `cwebp -q 85` с сохранением прозрачности.
  [Prompts, оригиналы и размеры](../../docs/design/stage-5-asset-prompts.md).
- Сторонние фотографии или рекламные изображения не скачивались.

## Личные воспоминания — этап 6, «Начало»

- `content/beginning-beach.webp` и `content/beginning-cafe.webp` — предоставленные
  владельцем файлы IMG_2163.jpg и IMG_2166.jpg, уменьшенные для телефона без metadata.
  Содержимое не перерисовывалось, надпись 2GIS на фото кафе сохранена.
- `content/beginning-bouquet.webp` — генеративное выделение букета из предоставленного
  IMG_2165.JPG через встроенный imagegen, с удалением фона/человека и прозрачностью.
- `content/beginning-kitkat.webp` — отдельная нарисованная шоколадка, созданная
  встроенным imagegen для пролёта. Это иллюстрация, не личная фотография.
- [Источники, точные prompts, размеры и обработка](../../docs/design/stage-6-beginning-assets.md).
