import { journeyTask } from './journey';
import familyImage from '../assets/content/family-keepsakes.webp';
import beachImage from '../assets/content/beginning-beach.webp';
import bouquetImage from '../assets/content/beginning-bouquet.webp';
import cafeImage from '../assets/content/beginning-cafe.webp';
import { secretImages } from '../secrets/assets';
import type { LetterContent, PouchContent, PouchId, QuizTaskDefinition, SecretContent, SecretId } from './types';

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
        { id: 'friends', label: 'В зале' },
      ],
      correctId: 'beach',
      hint: 'Подсказка: это было рядом с водой.',
      successMessage: 'В том воспоминании самое прекрасное — ты.',
      successImage: { src: beachImage, alt: 'Настя на том самом пляже', width: 1080, height: 1336 },
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
      successImage: { src: bouquetImage, alt: 'Букет, который я подарил тебе впервые', width: 768, height: 1024 },
    },
    {
      id: 'first-date',
      question: 'Когда мы впервые пошли на свидание?',
      options: [
        { id: 'february-16', label: '16 февраля 2025' },
        { id: 'february-14', label: '14 февраля 2025' },
        { id: 'february-20', label: '20 февраля 2025' },
      ],
      correctId: 'february-16',
      hint: 'В феврале 2025-го, через два дня после Дня всех влюблённых.',
      successMessage: '16 февраля — наше первое свидание, помню как сильно я волновался. Кафе Happy, символично что так называлось наше первое место, ведь впереди столько счастья.',
      successImage: { src: cafeImage, alt: 'Кафе нашего первого свидания', width: 1080, height: 710 },
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

// Beginning and journey use owner-supplied photos; remaining copy/art still need personal review.
export const gameContent = {
  revision: 3,
  status: 'draft',
  title: 'KitKat в чемодане',
  dedication: 'Для моей булочки',
  instruction: 'Выбери сумочку — в каждой маленькая тайна.',
  signature: 'Собрал с любовью. Для тебя.',
  // Editorial drafts from confirmed facts; no personal photo has been supplied yet.
  secrets: {
    'green-dress': {
      title: 'То самое зелёное платье',
      text: 'Турция, 17 октября 2025-го. Ты в зелёном платье, а у нас впереди — новая глава. Как же я люблю, что в нашей истории есть этот день. И ты.',
      image: { src: secretImages.dress, alt: 'Нарисованное изумрудно-зелёное платье на вешалке' },
    },
    'white-bueno': {
      title: 'Белый Bueno',
      text: 'У меня есть маленький способ сказать, что я о тебе думаю: принести тебе твой любимый белый Bueno. Люблю радовать тебя даже в самый обычный день, булочка.',
      image: { src: secretImages.bueno, alt: 'Белый Bueno в приоткрытой светлой обёртке' },
    },
    'black-g-class': {
      title: 'Одна мечта на будущее',
      text: 'Чёрный Гелик — очень в твоём стиле. Есть у меня мечта: однажды подарить тебе такой. А пока здесь спряталась его маленькая версия. Пусть у нас будет ещё много красивых мечт на двоих.',
      image: { src: secretImages.car, alt: 'Нарисованная миниатюра чёрного Mercedes Гелика' },
    },
  } satisfies Record<SecretId, SecretContent>,
  bonusMessage: 'Все маленькие тайны нашлись. А мою главную ты давно знаешь: я люблю тебя. Мне хочется, чтобы в нашей жизни всегда оставалось место для таких маленьких радостей — и для больших мечт на двоих.',
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
      rewardNote: 'Одна маленькая сладость стала названием песни для тебя. А ты — моей самой любимой историей. Этот ключ твой.',
    },
    journey: {
      status: 'draft',
      title: 'Далеко от дома',
      subtitle: 'Наши маленькие побеги',
      description: 'Важнее любого места на карте — тот, кто рядом. У этой сумочки есть своя история о нас.',
      task: journeyTask,
      rewardNote: 'Столько мест и столько воспоминаний на двоих. С тобой любое место становится особенным. Пусть впереди будет ещё много наших маленьких побегов. Этот ключ твой.',
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
