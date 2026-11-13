import { journeyTask } from './journey';
import { familyTask } from './family';
import beachImage from '../assets/content/beginning-beach.webp';
import bouquetImage from '../assets/content/beginning-bouquet.webp';
import cafeImage from '../assets/content/beginning-cafe.webp';
import proposalImage from '../assets/content/proposal-evening.webp';
import { secretImages } from '../secrets/assets';
import type { GiftContent, LetterContent, PouchContent, PouchId, QuizTaskDefinition, SecretContent, SecretId } from './types';

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
  revision: 5,
  status: 'draft',
  title: 'KitKat в чемодане',
  dedication: 'Для моей булочки',
  instruction: 'Выбери сумочку — в каждой маленькая тайна.',
  signature: 'Собрал с любовью. Для тебя.',
  // Editorial notes from confirmed facts; the dress illustration uses the owner's photo.
  secrets: {
    'green-dress': {
      title: 'То самое зелёное платье',
      text: 'Турция, 17 октября 2025-го. Ты в зелёном платье, а у нас впереди — новая глава. Как же я люблю, что в нашей истории есть этот день. И ты.',
      image: { src: secretImages.dress, alt: 'Зелёное платье с открытыми плечами, короткими объёмными рукавами и разрезом — рисунок по фотографии с предложения' },
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
  proposalLetter: {
    title: 'Слова того вечера',
    date: '17 октября 2025 · Турция',
    image: { src: proposalImage, alt: 'Мы обнимаемся у моря на закате в тот вечер, когда я сделал тебе предложение', width: 1290, height: 1679 },
    stanzas: [
      'ты знаешь, тут так красиво и тепло\nИногда я не верю, что мне так повезло\nЧто я именно с тобой могу все эти классные моменты разделять\nА потом пересматривать фотки, с улыбкой вспоминать',
      'А кстати помнишь? бабушка что мимо проходила дала совет\nЧтоб вместе так и было до 80 лет\nИ я подумал почему б и нет?',
      'и вот перед тобою я стою\nв твои глаза зеленые глядя\nхочу сказать, что я тебя люблю,\nи спросить, ты выйдешь за меня?',
    ],
  },
  gifts: {
    status: 'draft',
    items: [
      { id: 'spa', title: 'День для себя', description: 'Отдых, тишина и забота о себе. Немного времени, которое принадлежит только тебе.' },
      { id: 'dinner', title: 'Ужин вдвоём', description: 'Выбрать уютное место и провести вечер вместе, без спешки.' },
      { id: 'experience', title: 'Новое впечатление', description: 'Попробовать что-нибудь новое и сохранить ещё одно тёплое воспоминание.' },
      { id: 'surprise', title: 'Маленький сюрприз', description: 'Оставить одну радость секретом — до самого момента вручения.' },
    ] satisfies readonly GiftContent[],
  },
  letter: {
    status: 'draft',
    greeting: 'Любимая!',
    paragraphs: [
      'В этих сумочках — несколько маленьких историй о нас. Но самое важное никогда не помещается ни в чемодан, ни даже в большой сундук.',
      'Пляж, первые цветы, наше свидание и песня — столько тёплых воспоминаний. Были дороги, Дубай и Турция. А потом — тот самый вопрос, наша свадьба и целый мир, который мы создаём вместе.',
      'Теперь в нашем мире есть Святослав. Мне хочется, чтобы за всеми новыми заботами у тебя оставалось место и для себя: выдохнуть, отдохнуть, почувствовать тепло и просто побыть в тишине.',
      'Этот маленький подарок — приглашение к такому дню. Без спешки и списка дел. С заботой о тебе, о твоём отдыхе и о том, что делает тебя счастливой.',
      'Я люблю нашу большую историю, но ещё больше — тебя. И мне хочется продолжать собирать для тебя маленькие радости. Просто потому, что ты моя любимая булочка.',
    ],
    signature: 'Собрал с любовью) Для тебя!',
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
        question: 'Помнишь, что нам пожелали?',
        caption: 'Собери то самое пожелание из слов. Коснись их по порядку; чтобы убрать слово, коснись его ещё раз в собранной фразе. Здесь пригодятся все слова.',
        words: [
          { id: 'eighty', label: '80' },
          { id: 'together', label: 'вместе' },
          { id: 'would-be', label: 'было' },
          { id: 'wish', label: 'Чтоб' },
          { id: 'years', label: 'лет' },
          { id: 'until', label: 'до' },
          { id: 'and', label: 'и' },
          { id: 'so', label: 'так' },
        ],
        answerIds: ['wish', 'together', 'so', 'and', 'would-be', 'until', 'eighty', 'years'],
        hint: 'Помнишь совет бабушки, которая проходила мимо? Начни с «Чтоб вместе», а в конце — «до 80 лет».',
      },
      rewardNote: 'И я подумал почему б и нет?\n\n17 октября 2025 года, наша вторая поездка в Турцию. В тот вечер я задал тебе самый важный вопрос. А теперь у нас есть целая жизнь, чтобы наполнять её нашими историями.',
    },
    family: {
      status: 'draft',
      title: 'Самое дорогое',
      subtitle: 'Больше, чем целый мир',
      description: 'Мягкие лапы, верный хвост и самые маленькие ладошки. У каждого — своё место в нашей истории.',
      task: familyTask,
      rewardNote: 'Сначала нас стало больше на четыре лапы. Потом — ещё на четыре. А потом появились самые маленькие ладошки. И целый новый мир.\n\nСпасибо тебе за наш дом, за Томаса, Шелби и Святослава. За всю эту жизнь, которую мы создаём вместе.',
    },
  } satisfies Record<PouchId, PouchContent>,
} as const;
