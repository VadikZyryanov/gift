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

Публикация выполняется через `.github/workflows/deploy.yml`: после push в `master`
workflow устанавливает зависимости, собирает проект и публикует содержимое `dist/`.

1. В настройках репозитория открой **Settings → Pages**.
2. В разделе **Build and deployment → Source** выбери **GitHub Actions**.
3. Сделай commit и push файла workflow в `master`.
4. Во вкладке **Actions** дождись успешного завершения **Deploy to GitHub Pages**.
5. Открой `https://vadikzyryanov.github.io/gift/`.

Workflow также можно запустить вручную через **Actions → Deploy to GitHub Pages →
Run workflow**. Публиковать исходный `index.html` из корня репозитория нельзя:
браузеру нужны JavaScript и CSS из production build.

Подробнее: [публикация Vite на GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).

## Структура

- `src/App.tsx` — стартовая страница.
- `src/index.css` — стили страницы.
- `src/main.tsx` — точка входа React.
- `vite.config.ts` — настройки Vite и базовый путь для GitHub Pages.
