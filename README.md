# Gift

Базовый проект на React, TypeScript и Vite с одной стартовой страницей.

## Локальная разработка

Требуется Node.js `^20.19.0 || >=22.12.0` и npm.

```bash
npm ci
npm run dev
```

Открой адрес, который Vite выведет в терминале, обычно `http://localhost:5173/gift/`.

## Проверка и сборка

```bash
npm run typecheck
npm run build
npm run preview
```

`npm run build` проверяет типы и создаёт статические файлы в `dist/`.
`npm run preview` позволяет посмотреть собранную страницу локально.

## GitHub Pages

В `vite.config.ts` задан `base: '/gift/'` для размещения проекта по адресу
`https://vadikzyryanov.github.io/gift/`. При переименовании репозитория нужно
обновить `base`.

Публикация ещё не настроена. После push следующим шагом будет включение GitHub
Pages и добавление GitHub Actions workflow для сборки и публикации `dist/`.

## Структура

- `src/App.tsx` — стартовая страница.
- `src/index.css` — стили страницы.
- `src/main.tsx` — точка входа React.
- `vite.config.ts` — настройки Vite и базовый путь для GitHub Pages.
