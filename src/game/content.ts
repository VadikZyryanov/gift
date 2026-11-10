import type { PouchId, PouchPreview, QuizTaskDefinition } from './types';

// Facts and order confirmed by the owner; hints, distractors and replies are draft copy.
const beginningTask: QuizTaskDefinition = {
  kind: 'quiz',
  questions: [
    {
      id: 'first-meeting',
      question: 'Где я впервые тебя увидел?',
      options: [
        { id: 'cafe', label: 'В кафе' },
        { id: 'beach', label: 'На пляже' },
        { id: 'friends', label: 'У друзей' },
      ],
      correctId: 'beach',
      hint: 'Подсказка: это было рядом с водой.',
      successMessage: 'В том воспоминании самое прекрасное — ты.',
    },
    {
      id: 'first-flowers',
      question: 'В какой день я впервые подарил тебе цветы?',
      options: [
        { id: 'march-8', label: '8 марта 2024' },
        { id: 'april-28', label: '28 апреля 2024' },
        { id: 'march-28', label: '28 марта 2024' },
      ],
      correctId: 'march-28',
      hint: 'Это было весной 2024-го, ближе к концу марта.',
      successMessage: 'Тот самый мартовский букет. А впереди ещё столько поводов дарить тебе цветы.',
    },
    {
      id: 'first-date',
      question: 'Когда мы впервые пошли на свидание?',
      options: [
        { id: 'february-14', label: '14 февраля 2025' },
        { id: 'february-16', label: '16 февраля 2025' },
        { id: 'february-20', label: '20 февраля 2025' },
      ],
      correctId: 'february-16',
      hint: 'В феврале 2025-го, через два дня после Дня всех влюблённых.',
      successMessage: '16 февраля — наше первое свидание. Как же хорошо, что у нас есть этот день.',
    },
    {
      id: 'song',
      question: 'Какая сладость спряталась в названии моей песни для тебя?',
      options: [
        { id: 'bueno', label: 'Bueno' },
        { id: 'kitkat', label: 'KitKat' },
        { id: 'bounty', label: 'Bounty' },
      ],
      correctId: 'kitkat',
      hint: 'Загляни в название нашей маленькой истории — там есть сладкая подсказка.',
      successMessage: 'Наша сладкая история — «KitKat в чемодане».',
    },
  ],
};

// Draft copy, not personal quotes. Remaining tasks and final memories arrive later.
export const gameContent = {
  revision: 2,
  status: 'draft',
  title: 'KitKat в чемодане',
  dedication: 'Для моей булочки',
  instruction: 'Выбери сумочку — в каждой маленькая тайна.',
  signature: 'Собрал с любовью. Для тебя.',
  beginning: {
    status: 'draft',
    task: beginningTask,
    rewardNote: 'Одна маленькая сладость стала названием песни для тебя. А ты — моей самой любимой историей. Первый ключ твой, булочка.',
  },
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
