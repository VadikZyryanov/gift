import dubaiImage from '../assets/content/journey-dubai.webp';
import turkeyImage from '../assets/content/journey-turkey.webp';
import egyptImage from '../assets/content/journey-egypt.webp';
import familyImage from '../assets/content/family-keepsakes.webp';
import type { LetterContent, PouchContent, PouchId, QuizTaskDefinition } from './types';

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

// Draft copy and illustrations, not personal photos, belongings or proposal quotes.
export const gameContent = {
  revision: 2,
  status: 'draft',
  title: 'KitKat в чемодане',
  dedication: 'Для моей булочки',
  instruction: 'Выбери сумочку — в каждой маленькая тайна.',
  signature: 'Собрал с любовью. Для тебя.',
  letter: {
    status: 'draft',
    greeting: 'Булочка моя,',
    paragraphs: [
      'В этих сумочках — несколько маленьких историй о нас. Но самое важное никогда не помещается ни в чемодан, ни даже в большой сундук.',
      'Пляж, первые цветы, наше свидание и песня — столько тёплых воспоминаний. Были дороги, Дубай и Турция. А потом — тот самый вопрос, наша свадьба и целый мир, который мы создаём вместе.',
      'Теперь в нашем мире есть Святослав. Мне хочется, чтобы за всеми новыми заботами у тебя оставалось место и для себя: выдохнуть, отдохнуть, почувствовать тепло и просто побыть в тишине.',
      'Этот маленький подарок — приглашение к такому дню. Без спешки и списка дел. С заботой о тебе, о твоём отдыхе и о том, что делает тебя счастливой.',
      'Я люблю нашу большую историю, но ещё больше — тебя. И мне хочется продолжать собирать для тебя маленькие радости. Просто потому, что ты моя любимая булочка.',
    ],
    signature: 'Собрал с любовью. Для тебя.',
    voiceSrc: null,
  } satisfies LetterContent,
  pouches: {
    beginning: {
      status: 'draft',
      title: 'Начало',
      subtitle: 'Сладкая маленькая тайна',
      description: 'Некоторые истории начинаются с маленькой сладости. А потом становятся целым миром.',
      task: beginningTask,
      rewardNote: 'Одна маленькая сладость стала названием песни для тебя. А ты — моей самой любимой историей. Этот ключ твой, булочка.',
    },
    journey: {
      status: 'draft',
      title: 'Далеко от дома',
      subtitle: 'Наши маленькие побеги',
      description: 'Важнее любого места на карте — тот, кто рядом. У этой сумочки есть своя история о нас.',
      task: {
        kind: 'photo',
        question: 'Куда мы впервые отправились вместе?',
        caption: 'Пока здесь нарисованные открытки. Позже появятся наши фотографии.',
        options: [
          { id: 'turkey', label: 'Турция', image: { src: turkeyImage, alt: 'Турция: морская бухта и цветущая бугенвиллея' } },
          { id: 'dubai', label: 'Дубай', image: { src: dubaiImage, alt: 'Дубай: небоскрёбы у воды в персиковом закате' } },
          { id: 'egypt', label: 'Египет', image: { src: egyptImage, alt: 'Египет: пирамиды среди золотистых песков' } },
        ],
        correctId: 'dubai',
        hint: 'Эта поездка тоже была, но не первой. Вспомни город с высокими небоскрёбами.',
      },
      rewardNote: 'Дубай — наша первая поездка. С тобой любое место становится особенным. Пусть впереди будет ещё много наших маленьких побегов.',
    },
    proposal: {
      status: 'draft',
      title: 'Один вопрос',
      subtitle: 'Новая глава нашей истории',
      description: 'Есть вопросы, после которых начинается новая глава. Самая тёплая, самая наша.',
      task: {
        kind: 'phrase',
        question: 'Собери маленькое обещание',
        caption: 'Фраза для этой игры, не дословные слова предложения. Коснись слов по порядку; чтобы убрать слово, коснись его ещё раз в собранной фразе.',
        words: [
          { id: 'forever', label: 'навсегда' },
          { id: 'together', label: 'вместе' },
          { id: 'you', label: 'тобой' },
          { id: 'with', label: 'С' },
        ],
        answerIds: ['with', 'you', 'forever'],
        hint: 'Все слова рядом. Попробуй другой порядок: начни с «С». Одно слово здесь лишнее.',
      },
      rewardNote: '17 октября 2025 года, наша вторая поездка в Турцию. Там я сделал тебе предложение. А теперь у нас есть целая жизнь, чтобы наполнять её нашими историями.',
    },
    family: {
      status: 'draft',
      title: 'Самое дорогое',
      subtitle: 'Больше, чем целый мир',
      description: 'Самые дорогие сокровища не спрячешь в сундук. Их просто очень хочется беречь.',
      task: {
        kind: 'detail',
        question: 'Найди сердечко на детской пелёнке',
        caption: 'Нарисованный семейный натюрморт для игры. Коснись детали, в которой спряталось сердечко.',
        image: { src: familyImage, alt: 'Пионы, обручальные кольца, пелёнка с вышитым сердечком и детские пинетки' },
        spots: [
          { id: 'flowers', label: 'Пионы', x: 25, y: 25 },
          { id: 'rings', label: 'Обручальные кольца', x: 76, y: 25 },
          { id: 'heart', label: 'Сердечко на пелёнке', x: 28, y: 70 },
          { id: 'booties', label: 'Детские пинетки', x: 76, y: 72 },
        ],
        targetId: 'heart',
        hint: 'Здесь тоже есть своя нежность. А сердечко спряталось на пелёнке — посмотри внизу слева.',
      },
      rewardNote: '20 февраля 2026 года мы стали семьёй. А 26 октября появился Святослав. Вы — самое дорогое, что у меня есть. Спасибо тебе за наш маленький мир, булочка.',
    },
  } satisfies Record<PouchId, PouchContent>,
} as const;
