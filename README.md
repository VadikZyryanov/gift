# Gift

«KitKat в чемодане» — личная романтическая мини-игра на React, TypeScript и Vite.

Реализован этап 2: иллюстрированный стол, четыре вопроса в «Начале», ключ и записка,
локальное сохранение вопроса/ответа/сцены/результата и перезапуск с подтверждением.
Остальные три сумочки пока доступны для осмотра; их задания, письмо, аудио и секреты
добавляются следующими частями. Ответы четырёх вопросов подтверждены владельцем;
подсказки, реплики и записка пока черновые. Фото первого букета можно добавить позже.

- [План реализации](docs/superpowers/plans/2026-11-10-romantic-gift-game-implementation.md).
- [Концепция и макет](docs/superpowers/specs/2026-11-10-romantic-gift-game-design.md).
- [Ручная проверка на телефоне](docs/testing/manual-checks.md).

## Локальная разработка

Требуется Node.js `^20.19.0 || >=22.12.0` и npm.

```bash
npm ci
npm run dev
```

Открой адрес, который Vite выведет в терминале, обычно `http://localhost:5173/gift/`.

Для проверки на iPhone в той же Wi-Fi-сети:

```bash
npm run dev -- --host 0.0.0.0
```

На телефоне открой Network URL из терминала с путём `/gift/`.
Шрифты и графика локальные; работающая страница не обращается к Google Fonts.

Прохождение сохраняется автоматически в `localStorage` того же браузера и origin.
LAN и GitHub Pages не разделяют сохранение; приватный режим или очистка данных
браузера могут его удалить. При переходе со старого одного вопроса на четыре
тестовое прохождение начинается заново из-за новой ревизии контента. При отказе хранилища игра работает в памяти и сообщает
об ограничении. «Меню игры» внизу стола позволяет начать заново с подтверждением.

## Проверка и сборка

```bash
npm run typecheck
npm run build
npm run preview
```

`npm run build` проверяет типы и создаёт статические файлы в `dist/`.
`npm run preview` позволяет посмотреть собранную страницу локально.

## Автоматические тесты

```bash
npm run test:unit
npm run test:watch
```

Перед первым запуском E2E установить браузеры Playwright:

```bash
npx playwright install chromium webkit
npm run test:e2e
```

E2E сначала проверяет типы и собирает приложение, затем запускает production preview
на `http://127.0.0.1:4173/gift/`. Проекты: `mobile-webkit`, `mobile-chromium`,
`desktop-chromium`. Для одного проекта:

```bash
npm run test:e2e -- --project=mobile-webkit
```

Мобильные параметры браузерных тестов не заменяют проверку настоящего iPhone
и мобильного Яндекс Браузера. Отчёты и traces находятся в игнорируемом `test-results/`.

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

- `src/App.tsx` — переключение между столом и крупным планом.
- `src/game/` — контент, модель прогресса, валидация сохранения и React-контекст.
- `src/tasks/` — компоненты заданий, сейчас вопрос с вариантами ответа.
- `src/scene/` — сцены, иллюстрации предметов и их стили.
- `src/components/ScenePanel.tsx` — доступная панель осмотра на native dialog.
- `src/assets/` — локальные WebP, WOFF2 и лицензии.
- `src/index.css` — шрифты, общие стили и reduced motion.
- `src/main.tsx` — точка входа React.
- `vite.config.ts` — настройки Vite и базовый путь для GitHub Pages.
- `e2e/` — браузерные пользовательские сценарии; `src/**/*.test.ts(x)` — unit/component tests.
