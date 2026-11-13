# Pupsicoin Gifts Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить черновой список согласованными подарками за пупсикоины с необратимой покупкой и калькулятором.

**Architecture:** Отдельный типизированный каталог и вычисляемый кошелёк; reducer отвечает за одноразовое начисление и покупку. localStorage сохраняет начисление и ID покупок, финал раскрывает описания только купленных подарков.

**Tech Stack:** Existing React 19, TypeScript, Vite 8, CSS, npm; no new dependencies.

**Spec:** [Approved gift design](../specs/2026-11-13-pupscoin-gifts-design.md).

## Global Constraints

- Награда 1 000 000 за четыре задания, один раз; секреты не влияют.
- Точные 12 пунктов, порядок, цены и описания определены спецификацией.
- Покупки необратимы, остаток неотрицателен, машина за 1 000 001 недоступна.
- Бесплатный пункт можно получить даже с нулевым остатком.
- Сохранить revision 5, задания, секреты, локальное сохранение и copy fallback.
- Перезапуск сохраняет кошелёк; старые черновые отметки не становятся покупками.
- Не создавать, не менять и не запускать тесты. Разрешены typecheck/build и diff check.
- Текущий checkout, без Git-мутаций, публикации и dependencies.

## Review Focus

1. Быстрые повторные нажатия: один подарок покупается один раз, баланс не уходит ниже нуля.
2. Reload, возврат и перезапуск: покупки не отменяются, миллион не начисляется повторно.
3. Старые сохранения: прохождение сохраняется, черновые отметки не списывают монеты.
4. Нулевой остаток: бесплатный подарок доступен; машина недоступна при любом остатке.
5. Маленький экран, крупный текст и Clipboard API failure: читаемые суммы, доступная прокрутка и ручное копирование.

## Task 1: Catalogue, wallet and persistence

**Files:** create `src/game/gifts.ts`; modify `src/game/{types,content,progress,storage}.ts` and `src/game/GameProvider.tsx`.

**Interfaces:** `giftCatalog: readonly GiftContent[]`, `giftRewardAmount: number`,
`getGiftWallet(progress: GameProgress): { earned: number; spent: number; remaining: number }`,
`formatPupsicoins(amount: number): string`; optional `giftRewardEarned`, `purchasedGiftIds`;
event `{ type: 'purchase-gift'; giftId: GiftId }`; shared
`normalizeGiftPurchases(ids: readonly string[], rewardEarned: boolean): GiftId[]`.

- [x] Add the approved catalogue and prices; mark gifts ready without changing the overall draft content.
- [x] Derive wallet totals; persist one-time reward on the fourth completion and enforce purchase guards in reducer.
- [x] Restore legacy completed games, discard draft selections, sanitize persisted purchases and retain the wallet on restart.
- [x] Refresh/merge the wallet before every write, synchronize via storage events and serialize writes with Web Locks when available.
- [x] Read the resulting changes against the spec; leave test files untouched.

## Task 2: Gift purchase interface and documentation

**Files:** modify `src/finale/GiftSelection.tsx`, `src/finale/finale.css`,
`src/components/GameMenu.tsx`, `docs/testing/manual-checks.md`,
`docs/superpowers/plans/2026-11-10-romantic-gift-game-implementation.md`.

**Interfaces:** consumes Task 1 wallet/catalogue and purchase event through existing GameProvider.

- [x] Show reward, spent and remaining; explain irreversible choice before cards.
- [x] Render only names/prices before purchase; reveal descriptions after purchase and block repeat/unaffordable choices.
- [x] Copy purchased gifts with prices/totals and preserve asynchronous stale-request protection and manual fallback.
- [x] Update restart wording and the original stage-7 status/manual checklist.
- [x] Run `npm run build` (includes typecheck) and `git diff --check`; inspect full diff and review without running tests.
- [x] Record verification results and remaining device/runtime limitations in the progress document.

## Task 3: Purchase confirmation, coin sound and currency rename

Owner requested implementation directly after reviewing the existing purchase flow.

**Files:** create `src/finale/GiftPurchaseDialog.tsx`; modify `GiftSelection.tsx`,
`finale.css`, `src/audio/{AudioProvider.tsx,sounds.ts}`, `src/game/{types.ts,GameProvider.tsx,gifts.ts}`,
`src/components/GameMenu.tsx` and current gift documentation.

- [x] Rename visible currency and formatter to pupsicoins without changing persisted IDs or balances.
- [x] Open a native modal before purchase; show title, price, remaining balance and irreversible-purchase rule without description. Support cancel/Escape and focus restoration.
- [x] Return whether a dispatched event applied; confirm once, await the transaction, then reveal the gift and play the coins effect. Respect mute/background/voice and unlock audio on the confirmation gesture.
- [x] Handle changed balances/remote purchases while confirmation is open and block repeated submits.
- [x] Run build/typecheck and diff check; manually inspect confirmation/cancellation/commit and mobile layout. Do not create, modify or run tests.
