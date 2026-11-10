import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioProvider } from '../audio/AudioProvider';
import { GameProvider } from '../game/GameProvider';
import { LetterScene } from './LetterScene';

const letter = {
  status: 'draft' as const, greeting: 'Булочка,', paragraphs: ['Текст письма остаётся доступным.'],
  signature: 'С любовью', voiceSrc: '/test-tone.wav',
};
const pause = vi.fn();
const play = vi.fn<() => Promise<void>>();

function openLetter(voiceSrc: string | null = letter.voiceSrc) {
  return render(<GameProvider><AudioProvider><LetterScene letter={{ ...letter, voiceSrc }} /></AudioProvider></GameProvider>);
}

beforeEach(() => {
  localStorage.clear();
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause);
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  play.mockResolvedValue(undefined);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.clearAllMocks(); });

describe('LetterScene', () => {
  it('always shows the text, without an empty player or autoplay', () => {
    const { container } = openLetter(null);
    expect(screen.getByRole('article', { name: 'Письмо для тебя' })).toHaveTextContent(letter.paragraphs[0]!);
    expect(container.querySelector('audio')).toBeNull();
    expect(play).not.toHaveBeenCalled();
  });

  it('plays only by request, pauses without losing text and can retry rejected play', async () => {
    const user = userEvent.setup();
    play.mockRejectedValueOnce(new DOMException('blocked', 'NotAllowedError'));
    openLetter();
    expect(play).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Послушать послание' }));
    expect(screen.getByRole('status')).toHaveTextContent('прочитать');
    expect(screen.getByRole('article')).toHaveTextContent(letter.paragraphs[0]!);
    await user.click(screen.getByRole('button', { name: 'Попробовать ещё раз' }));
    expect(play).toHaveBeenCalledTimes(2);
    await user.click(screen.getByRole('button', { name: 'Пауза' }));
    expect(pause).toHaveBeenCalled();
    expect(screen.getByRole('article')).toBeVisible();
  });

  it('keeps the letter after a media error and retries loading on the next tap', async () => {
    const user = userEvent.setup();
    const { container } = openLetter();
    const audio = container.querySelector('audio')!;
    fireEvent.error(audio);
    expect(screen.getByRole('status')).toHaveTextContent('прочитать');
    await user.click(screen.getByRole('button', { name: 'Попробовать ещё раз' }));
    expect(audio.load).toHaveBeenCalledOnce();
    expect(play).toHaveBeenCalledOnce();
  });

  it('cancels pending playback when hidden and never resumes automatically', async () => {
    const user = userEvent.setup();
    let finishPlay: (() => void) | undefined;
    play.mockImplementationOnce(() => new Promise<void>(resolve => { finishPlay = resolve; }));
    openLetter();
    await user.click(screen.getByRole('button', { name: 'Послушать послание' }));
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    await act(async () => { finishPlay?.(); });
    expect(screen.queryByRole('button', { name: 'Пауза' })).not.toBeInTheDocument();
    expect(pause).toHaveBeenCalled();
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    fireEvent(document, new Event('visibilitychange'));
    expect(play).toHaveBeenCalledOnce();
  });

  it('pauses on unmount and ignores a late play completion', async () => {
    const user = userEvent.setup();
    let finishPlay: (() => void) | undefined;
    play.mockImplementationOnce(() => new Promise<void>(resolve => { finishPlay = resolve; }));
    const view = openLetter();
    await user.click(screen.getByRole('button', { name: 'Послушать послание' }));
    view.unmount();
    await act(async () => { finishPlay?.(); });
    expect(pause).toHaveBeenCalled();
    expect(play).toHaveBeenCalledOnce();
  });

  it('does not let an old play request pause a newer request', async () => {
    const user = userEvent.setup();
    let first: (() => void) | undefined;
    let second: (() => void) | undefined;
    play.mockImplementationOnce(() => new Promise<void>(resolve => { first = resolve; }))
      .mockImplementationOnce(() => new Promise<void>(resolve => { second = resolve; }));
    openLetter();
    await user.click(screen.getByRole('button', { name: 'Послушать послание' }));
    await user.click(screen.getByRole('button', { name: 'Отменить воспроизведение' }));
    await user.click(screen.getByRole('button', { name: 'Продолжить послание' }));
    const pausesBefore = pause.mock.calls.length;
    await act(async () => { first?.(); });
    expect(pause).toHaveBeenCalledTimes(pausesBefore);
    await act(async () => { second?.(); });
    expect(screen.getByRole('button', { name: 'Пауза' })).toBeVisible();
  });
});
