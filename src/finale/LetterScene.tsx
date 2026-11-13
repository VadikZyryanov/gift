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
      <p className="love-letter__greeting">{letter.greeting}</p>
      {letter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      <p className="love-letter__signature">{letter.signature}</p>
    </article>
    {letter.voiceSrc && <section className="voice-message" aria-label="Голосовое послание">
      <audio key={letter.voiceSrc} ref={attachVoice} src={letter.voiceSrc} preload="none"
        onPause={() => { setVoiceState(current => current === 'playing' ? 'paused' : current); }}
        onEnded={() => setVoiceState('paused')}
        onError={() => { requestRef.current++; setVoiceState('error'); }} />
      <button className="story-button story-button--quiet" type="button" onClick={() => { void toggleVoice(); }}>
        {voiceState === 'playing' ? 'Пауза' : voiceState === 'loading' ? 'Отменить воспроизведение' : voiceState === 'error' ? 'Попробовать ещё раз' : voiceState === 'paused' ? 'Продолжить послание' : 'Послушать послание'}
      </button>
      <p className="voice-message__status" role="status">{voiceState === 'error' ? 'Запись пока не удалось включить. Письмо можно прочитать, а голос попробовать ещё раз.' : voiceState === 'loading' ? 'Открываю послание…' : voiceState === 'playing' ? 'Послание звучит. Можно поставить на паузу.' : 'Голос включается только по твоему нажатию.'}</p>
    </section>}
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
