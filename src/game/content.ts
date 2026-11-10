import type { PouchId, PouchPreview } from './types';

// Preview copy, not personal quotes. Tasks and real memories arrive in later stages.
export const gameContent = {
  revision: 1,
  status: 'draft',
  title: 'KitKat в чемодане',
  dedication: 'Для моей булочки',
  instruction: 'Выбери сумочку — в каждой маленькая тайна.',
  signature: 'Собрал с любовью. Для тебя.',
  pouches: {
    beginning: {
      title: 'Начало',
      subtitle: 'Сладкая маленькая тайна',
      description: 'Некоторые истории начинаются с маленькой сладости. А потом становятся целым миром.',
    },
    journey: {
      title: 'Далеко от дома',
      subtitle: 'Наши маленькие побеги',
      description: 'Важнее любого места на карте — тот, кто рядом. У этой сумочки есть своя история о нас.',
    },
    proposal: {
      title: 'Один вопрос',
      subtitle: 'Новая глава нашей истории',
      description: 'Есть вопросы, после которых начинается новая глава. Самая тёплая, самая наша.',
    },
    family: {
      title: 'Самое дорогое',
      subtitle: 'Больше, чем целый мир',
      description: 'Самые дорогие сокровища не спрячешь в сундук. Их просто очень хочется беречь.',
    },
  } satisfies Record<PouchId, PouchPreview>,
} as const;
