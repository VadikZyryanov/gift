import journeyPhoto01 from '../assets/content/journey-photo-01.webp';
import journeyPhoto02 from '../assets/content/journey-photo-02.webp';
import journeyPhoto03 from '../assets/content/journey-photo-03.webp';
import journeyPhoto04 from '../assets/content/journey-photo-04.webp';
import journeyPhoto05 from '../assets/content/journey-photo-05.webp';
import journeyPhoto06 from '../assets/content/journey-photo-06.webp';
import journeyPhoto07 from '../assets/content/journey-photo-07.webp';
import journeyPhoto08 from '../assets/content/journey-photo-08.webp';
import type { QuizTaskDefinition } from './types';

const journeyQuestion = {
  question: 'Где сделана эта фотография?',
  options: [
    { id: 'turkey', label: 'Турция' },
    { id: 'dubai', label: 'Дубай' },
    { id: 'egypt', label: 'Египет' },
    { id: 'russia', label: 'Россия' },
  ],
  hint: 'Посмотри на детали снимка и попробуй ещё раз. Мы никуда не спешим.',
  successMessage: 'Угадала! Ещё одно наше тёплое воспоминание.',
} as const;

// The source filenames define both the answer and the fixed question order.
export const journeyTask: QuizTaskDefinition = {
  kind: 'quiz',
  questions: [
    {
      ...journeyQuestion, id: 'journey-01', correctId: 'turkey',
      questionImage: { src: journeyPhoto01, alt: 'Наше путешествие — фотография 1', width: 900, height: 1600 },
    },
    {
      ...journeyQuestion, id: 'journey-02', correctId: 'dubai',
      questionImage: { src: journeyPhoto02, alt: 'Наше путешествие — фотография 2', width: 900, height: 1600 },
    },
    {
      ...journeyQuestion, id: 'journey-03', correctId: 'turkey',
      questionImage: { src: journeyPhoto03, alt: 'Наше путешествие — фотография 3', width: 900, height: 1600 },
    },
    {
      ...journeyQuestion, id: 'journey-04', correctId: 'russia',
      questionImage: { src: journeyPhoto04, alt: 'Наше путешествие — фотография 4', width: 1200, height: 1600 },
    },
    {
      ...journeyQuestion, id: 'journey-05', correctId: 'turkey',
      questionImage: { src: journeyPhoto05, alt: 'Наше путешествие — фотография 5', width: 900, height: 1600 },
    },
    {
      ...journeyQuestion, id: 'journey-06', correctId: 'egypt',
      questionImage: { src: journeyPhoto06, alt: 'Наше путешествие — фотография 6', width: 1200, height: 1600 },
    },
    {
      ...journeyQuestion, id: 'journey-07', correctId: 'dubai',
      questionImage: { src: journeyPhoto07, alt: 'Наше путешествие — фотография 7', width: 1600, height: 900 },
    },
    {
      ...journeyQuestion, id: 'journey-08', correctId: 'russia',
      questionImage: { src: journeyPhoto08, alt: 'Наше путешествие — фотография 8', width: 1200, height: 1600 },
    },
  ],
};
