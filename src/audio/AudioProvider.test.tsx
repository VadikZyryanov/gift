import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioProvider, useAudio } from './AudioProvider';

const started = vi.fn();
const stopped = vi.fn();
const suspended = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
const closed = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
const resumed = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

class TestAudioContext {
  currentTime = 0;
  sampleRate = 8000;
  destination = {};
  state = 'running';
  resume = resumed;
  suspend = suspended;
  close = closed;
  createGain() { return { gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn() }; }
  createBuffer(_channels: number, length: number) { return { getChannelData: () => new Float32Array(length) }; }
  createBufferSource() { return { buffer: null, connect: vi.fn(), disconnect: vi.fn(), start: started, stop: stopped }; }
  createOscillator() { return { type: 'sine', frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn(), start: started, stop: stopped }; }
}

function Controls() {
  const audio = useAudio();
  return <>
    <button onClick={() => audio.setEffectsEnabled(!audio.effectsEnabled)}>{audio.effectsEnabled ? 'Disable' : 'Enable'}</button>
    <button onClick={() => audio.playEffect('paper')}>Paper</button>
    <button onClick={() => audio.playEffect('unlock')}>Unlock</button>
    <button onClick={() => audio.playEffect('found')}>Found</button>
    <audio ref={audio.registerVoice} />
  </>;
}

beforeEach(() => {
  vi.stubGlobal('AudioContext', TestAudioContext);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe('AudioProvider', () => {
  it('starts with effects off on every mount and plays only after enabling', async () => {
    const user = userEvent.setup();
    const view = render(<AudioProvider><Controls /></AudioProvider>);
    await user.click(screen.getByText('Paper'));
    expect(started).not.toHaveBeenCalled();
    await user.click(screen.getByText('Enable'));
    for (const name of ['Paper', 'Unlock', 'Found']) await user.click(screen.getByText(name));
    expect(started).toHaveBeenCalledTimes(3);
    await user.click(screen.getByText('Disable'));
    const stops = stopped.mock.calls.length;
    await user.click(screen.getByText('Paper'));
    expect(started).toHaveBeenCalledTimes(3);
    expect(stops).toBeGreaterThan(0);
    view.unmount();
    render(<AudioProvider><Controls /></AudioProvider>);
    expect(screen.getByText('Enable')).toBeVisible();
  });

  it('stops effects for voice playback, hiding, and unmount without auto-resume', async () => {
    const user = userEvent.setup();
    const view = render(<AudioProvider><Controls /></AudioProvider>);
    await user.click(screen.getByText('Enable'));
    await user.click(screen.getByText('Unlock'));
    const voice = view.container.querySelector('audio')!;
    Object.defineProperty(voice, 'paused', { configurable: true, value: false });
    fireEvent.play(voice);
    expect(stopped).toHaveBeenCalled();
    await user.click(screen.getByText('Found'));
    expect(started).toHaveBeenCalledOnce();
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    expect(voice.pause).toHaveBeenCalled();
    expect(suspended).toHaveBeenCalled();
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    fireEvent(document, new Event('visibilitychange'));
    expect(started).toHaveBeenCalledOnce();
    view.unmount();
    expect(closed).toHaveBeenCalled();
  });

  it('does not play a pending effect after the page was hidden', async () => {
    const user = userEvent.setup();
    render(<AudioProvider><Controls /></AudioProvider>);
    await user.click(screen.getByText('Enable'));
    let finishResume: (() => void) | undefined;
    resumed.mockImplementationOnce(() => new Promise<void>(resolve => { finishResume = resolve; }));
    await user.click(screen.getByText('Paper'));
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    await act(async () => { finishResume?.(); });
    expect(started).not.toHaveBeenCalled();
  });

  it('keeps controls usable when the browser rejects Web Audio', async () => {
    const user = userEvent.setup();
    resumed.mockRejectedValue(new DOMException('blocked', 'NotAllowedError'));
    render(<AudioProvider><Controls /></AudioProvider>);
    await user.click(screen.getByText('Enable'));
    await user.click(screen.getByText('Paper'));
    expect(started).not.toHaveBeenCalled();
    resumed.mockResolvedValue(undefined);
  });
});
