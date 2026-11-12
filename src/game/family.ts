import roomImage from '../assets/content/family-room-panorama.webp';
import characterSprites from '../assets/content/family-characters.webp';
import cribImage from '../assets/content/family-crib.webp';
import type { FamilyMember, FamilyTaskDefinition } from './types';

const animalSprites: FamilyMember['sprites'] = {
  image: { src: characterSprites, alt: 'Томас и Шелби, нарисованные по нашим фотографиям', width: 1536, height: 1024 },
  columns: 3, rows: 2,
};

const cribSprites: FamilyMember['sprites'] = {
  image: { src: cribImage, alt: 'Святослав в белой детской кроватке', width: 1024, height: 512 },
  columns: 2, rows: 1,
};

export const familyMonths = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
] as const;

export function formatFamilyDate(month: number, year: number): string {
  return `${familyMonths[month - 1]} ${year}`;
}

export const familyTask: FamilyTaskDefinition = {
  kind: 'family',
  question: 'Как росла наша семья',
  caption: 'Загляни в разные уголки нашего дома. Найди Томаса, Шелби и Святослава и вспомни их истории.',
  image: { src: roomImage, alt: 'Наша комната: серый диван, комоды, балкон, ковёр и кухня за деревянным разделителем', width: 1774, height: 887 },
  years: [2024, 2025, 2026],
  members: [
    {
      id: 'thomas', name: 'Томас',
      question: 'Когда Томас появился у нас?',
      hint: 'Наш вислоухий появился в начале лета 2025-го.',
      searchHint: 'Томас любит смотреть на себя. Загляни к круглому зеркалу, среди растений и маленьких вещей.',
      successMessage: 'Июнь 2025-го. В нашем доме поселились мягкие лапы, любопытные глаза и мурчание Томаса.',
      month: 6, year: 2025, sprites: animalSprites, spriteColumn: 0, x: 16, y: 53.5, width: 5.5,
    },
    {
      id: 'shelby', name: 'Шелби',
      question: 'Когда Шелби стал жить с нами?',
      hint: 'Он уже был частью твоей жизни. А жить с нами начал в октябре того года, когда я сделал тебе предложение.',
      searchHint: 'Шелби устроился там, где вы сидите за круглым столом. Посмотри поближе к стульям.',
      successMessage: 'Октябрь 2025-го. Шелби уже был твоим, а теперь стал частью нашего общего дома. И дома стало ещё живее.',
      month: 10, year: 2025, sprites: animalSprites, spriteColumn: 1, x: 79.5, y: 92, width: 9.2,
    },
    {
      id: 'svyatoslav', name: 'Святослав',
      question: 'Когда родился наш Святослав?',
      hint: 'Наш малыш появился осенью 2026-го — в том же месяце, в котором годом раньше к нам переехал Шелби.',
      searchHint: 'Самый маленький отдыхает в своей кроватке. Она стоит на ковре между комодом и деревянным разделителем.',
      successMessage: 'Октябрь 2026-го. Самые маленькие ладошки — и столько новой любви. С появлением Святослава наш мир изменился навсегда.',
      month: 10, year: 2026, sprites: cribSprites, spriteColumn: 0, x: 64.5, y: 67, width: 10.5,
    },
  ],
};
