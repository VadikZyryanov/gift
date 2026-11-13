import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudio } from '../audio/AudioProvider';
import { FinaleLayout } from './FinaleLayout';
import { StorageNotice } from '../components/StorageNotice';
import { gameContent } from '../game/content';
import { useGame } from '../game/GameProvider';
import type { LetterContent } from '../game/types';

type VoiceState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function LetterScene({ letter = gameContent.letter }: { letter?: LetterContent }) {
  const { send } = useGame();
  const { registerVoice, stopVoice, stopEffects, playEffect } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef(0);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const voiceActive = voiceState === 'playing' || voiceState === 'loading';
  const voiceActionLabel = voiceState === 'playing' ? 'Пауза' : voiceState === 'loading' ? 'Отменить воспроизведение' : voiceState === 'error' ? 'Попробовать ещё раз' : voiceState === 'paused' ? 'Продолжить послание' : 'Послушать послание';
  const attachVoice = useCallback((element: HTMLAudioElement | null) => {
    audioRef.current = element;
    registerVoice(element);
  }, [registerVoice]);

  useEffect(() => {
    const pause = () => {
      requestRef.current++;
      stopVoice();
      setVoiceState(current => current === 'idle' || current === 'error' ? current : 'paused');
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') pause(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', pause);
    return () => {
      requestRef.current++;
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', pause);
      stopVoice();
    };
  }, [stopVoice]);

  async function toggleVoice() {
    const audio = audioRef.current;
    if (!audio) return;
    const request = ++requestRef.current;
    if (voiceState === 'playing' || voiceState === 'loading') {
      audio.pause();
      setVoiceState('paused');
      return;
    }
    if (voiceState === 'error') audio.load();
    setVoiceState('loading');
    try {
      await audio.play();
      // A cancelled request must not pause a newer play() on this element.
      if (request !== requestRef.current) return;
      if (document.visibilityState === 'hidden') {
        audio.pause();
        return;
      }
      setVoiceState('playing');
    } catch {
      if (request === requestRef.current) setVoiceState('error');
    }
  }

  return <FinaleLayout title="Для моей любимки" className="letter-page" onBack={() => {
    stopVoice();
    stopEffects();
    send({ type: 'navigate', scene: { kind: 'table' } });
  }}>
    <StorageNotice />
    {letter.status === 'draft' && <p className="content-draft">Черновик письма — окончательные слова ещё впереди.</p>}
    <article className="love-letter" aria-label="Письмо для тебя">
      <header className="love-letter__header">
        <p className="love-letter__greeting">{letter.greeting}</p>
        {letter.voiceSrc && <div className="voice-message">
          <audio key={letter.voiceSrc} ref={attachVoice} src={letter.voiceSrc} preload="none"
            onPause={() => { setVoiceState(current => current === 'playing' ? 'paused' : current); }}
            onEnded={() => setVoiceState('paused')}
            onError={() => { requestRef.current++; setVoiceState('error'); }} />
          <button className="voice-message__button" type="button" aria-label={voiceActionLabel} title={voiceActionLabel}
            onClick={() => { void toggleVoice(); }}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={voiceActive ? 'M6 5h4v14H6zM14 5h4v14h-4z' : 'm8 5 11 7-11 7V5Z'} />
            </svg>
          </button>
          <span className="voice-message__status" role="status">{voiceState === 'loading' ? 'Открываю послание…' : voiceState === 'playing' ? 'Послание звучит.' : voiceState === 'paused' ? 'Послание на паузе.' : ''}</span>
        </div>}
      </header>
      {letter.voiceSrc && voiceState === 'error' && <p className="voice-message__error" role="status">Запись пока не удалось включить. Письмо можно прочитать, а голос попробовать ещё раз.</p>}
      {letter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      <p className="love-letter__signature">{letter.signature}</p>
    </article>
    <section className="letter-afterword" aria-label="Продолжение истории">
      <span className="letter-afterword__heart" aria-hidden="true">♡</span>
      <p className="finale-handwriting">А теперь — немного радости для тебя.</p>
      <button className="story-button" type="button" onClick={() => {
        stopVoice();
        send({ type: 'show-finale' });
        playEffect('gifts');
      }}>Перейти к подаркам</button>
    </section>
  </FinaleLayout>;
}
