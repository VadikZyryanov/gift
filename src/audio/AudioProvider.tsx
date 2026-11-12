import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { playSound, type EffectName } from './sounds';

interface AudioSession {
  effectsEnabled: boolean;
  setEffectsEnabled: (enabled: boolean) => void;
  playEffect: (name: EffectName) => void;
  registerVoice: (audio: HTMLAudioElement | null) => void;
  stopVoice: () => void;
  stopEffects: () => void;
}

const AudioContextValue = createContext<AudioSession | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [effectsEnabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const contextRef = useRef<AudioContext | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const cancelEffectRef = useRef<(() => void) | null>(null);
  const generationRef = useRef(0);

  const stopEffects = useCallback(() => {
    generationRef.current++;
    cancelEffectRef.current?.();
    cancelEffectRef.current = null;
  }, []);

  const stopVoice = useCallback(() => {
    voiceRef.current?.pause();
  }, []);

  const onVoicePlay = useCallback(() => {
    stopEffects();
    if (document.visibilityState === 'hidden') voiceRef.current?.pause();
  }, [stopEffects]);

  const registerVoice = useCallback((audio: HTMLAudioElement | null) => {
    const previous = voiceRef.current;
    if (previous === audio) return;
    previous?.removeEventListener('play', onVoicePlay);
    previous?.pause();
    voiceRef.current = audio;
    audio?.addEventListener('play', onVoicePlay);
  }, [onVoicePlay]);

  function getContext(): AudioContext | null {
    try {
      if (!contextRef.current) contextRef.current = new AudioContext();
      return contextRef.current;
    } catch { return null; }
  }

  function setEffectsEnabled(enabled: boolean) {
    enabledRef.current = enabled;
    setEnabled(enabled);
    if (!enabled) {
      stopEffects();
      void contextRef.current?.suspend().catch(() => {});
    } else {
      // Called directly by a gesture so WebKit can unlock its audio context.
      void getContext()?.resume().catch(() => {});
    }
  }

  function playEffect(name: EffectName) {
    if (!enabledRef.current || document.visibilityState === 'hidden' || (voiceRef.current && !voiceRef.current.paused)) return;
    const context = getContext();
    if (!context) return;
    stopEffects();
    const generation = generationRef.current;
    void context.resume().then(() => {
      if (generation !== generationRef.current || !enabledRef.current || document.visibilityState === 'hidden' || (voiceRef.current && !voiceRef.current.paused)) return;
      cancelEffectRef.current = playSound(context, name);
    }).catch(() => { /* Unsupported or denied audio never blocks the game. */ });
  }

  useEffect(() => {
    const stop = () => {
      stopVoice();
      stopEffects();
      void contextRef.current?.suspend().catch(() => {});
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') stop(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', stop);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', stop);
      stopVoice();
      stopEffects();
      const context = contextRef.current;
      contextRef.current = null;
      void context?.close().catch(() => {});
    };
  }, [stopVoice, stopEffects]);

  return <AudioContextValue value={{ effectsEnabled, setEffectsEnabled, playEffect, registerVoice, stopVoice, stopEffects }}>{children}</AudioContextValue>;
}

export function useAudio(): AudioSession {
  const session = useContext(AudioContextValue);
  if (!session) throw new Error('useAudio must be used within AudioProvider');
  return session;
}
