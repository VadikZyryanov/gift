import { pouchIds, type GameProgress, type GiftContent, type GiftId } from './types';

export const giftRewardAmount = 1_000_000;

export const giftCatalog: readonly GiftContent[] = [
  { id: 'breakfast', title: 'Булочка для булочки', price: 50_000,
    description: 'Любимый завтрак в постель: всё приготовлю и принесу.' },
  { id: 'massage', title: 'Массаж без спешки', price: 100_000,
    description: 'Масло, приглушённый свет и мои руки в твоём распоряжении.' },
  { id: 'dinner', title: 'Столик на двоих', price: 150_000,
    description: 'Красивый ужин вне дома и вечер без телефонов.' },
  { id: 'experience', title: 'Впервые вместе', price: 200_000,
    description: 'Попробуем что-нибудь новое вдвоём: выберем совместный мастер-класс или другое впечатление.' },
  { id: 'day-off', title: 'Сегодня ты отдыхаешь', price: 250_000,
    description: 'День для себя: домашние заботы и организацию беру на себя.' },
  { id: 'blind-date', title: 'Свидание вслепую', price: 300_000,
    description: 'Я придумываю маршрут и всё организую. Тебе скажу только время и дресс-код.' },
  { id: 'wishlist', title: 'Хочу вот эту штучку', price: 350_000,
    description: 'Покупка из твоего списка желаний в оговорённом бюджете.' },
  { id: 'lingerie', title: 'Подарок с секретом', price: 400_000,
    description: 'Красивое бельё, которое выберешь ты. Полюбоваться приглашён я.' },
  { id: 'private-evening', title: 'У меня на тебя планы', price: 500_000,
    description: 'Приватный вечер с флиртом и сюрпризами, которые я подготовлю специально для тебя.' },
  { id: 'overnight', title: 'Украду тебя на ночь', price: 800_000,
    description: 'Ночь в красивом отеле: ужин, неспешное утро и время только для нас.' },
  { id: 'car', title: 'Чёрный Гелик', price: 1_000_001,
    description: 'Описание остаётся секретом.' },
  { id: 'hugs', title: 'Обнимашки и целовашки каждый день', price: 0,
    description: 'Каждый день, сколько захочешь. С любовью и без выходных.' },
];

const coinFormatter = new Intl.NumberFormat('ru-RU');

export function formatPupsicoins(amount: number): string {
  return coinFormatter.format(amount);
}

export function normalizeGiftPurchases(ids: readonly string[], rewardEarned: boolean): GiftId[] {
  const purchased: GiftId[] = [];
  if (!rewardEarned) return purchased;
  let remaining = giftRewardAmount;
  for (const id of new Set(ids)) {
    const gift = giftCatalog.find(item => item.id === id);
    if (gift && gift.price <= remaining) {
      purchased.push(gift.id);
      remaining -= gift.price;
    }
  }
  return purchased;
}

export function getGiftWallet(progress: GameProgress): { earned: number; spent: number; remaining: number } {
  const earned = progress.giftRewardEarned || pouchIds.every(id => progress.completedPouches.includes(id))
    ? giftRewardAmount : 0;
  const spent = giftCatalog.reduce((total, gift) =>
    total + (progress.purchasedGiftIds?.includes(gift.id) ? gift.price : 0), 0);
  return { earned, spent, remaining: earned - spent };
}
