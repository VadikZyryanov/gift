import { describe, expect, it } from 'vitest';
import { gameContent } from './content';

describe('Beginning memories', () => {
  const { questions } = gameContent.pouches.beginning.task;

  it('keeps the beach second, replaces the friends distractor, and puts the date first', () => {
    expect(questions[0].options.map(option => option.label)).toEqual(['В кафе', 'На пляже', 'В зале']);
    expect(questions[0].correctId).toBe('beach');
    expect(questions[2].options[0]).toEqual({ id: 'february-16', label: '16 февраля 2025' });
    expect(questions.map(question => question.id)).toEqual(['first-meeting', 'first-flowers', 'first-date', 'song']);
  });

  it('connects each supplied photograph to its memory instead of a question option', () => {
    for (const [index, alt] of ['Настя на том самом пляже', 'Букет, который я подарил тебе впервые', 'Кафе нашего первого свидания'].entries()) {
      expect(questions[index]).toMatchObject({ successImage: { src: expect.stringMatching(/\.webp(?:\?.*)?$/), alt } });
    }
    expect(questions[3]).not.toHaveProperty('successImage');
  });
});
