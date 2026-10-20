"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const isSupported = () => "speechSynthesis" in window;

/** Талаффузи калимаҳо бо Web Speech API (бе сервер ва бе пул). */
export function useSpeech(lang = "en-US") {
  // Дар сервер false, дар браузер — мавҷудияти speechSynthesis
  const supported = useSyncExternalStore(noopSubscribe, isSupported, () => false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!supported) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((v) => v.lang === lang && /natural|google|samantha|aria|jenny/i.test(v.name)) ??
        voices.find((v) => v.lang === lang) ??
        voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) ??
        null;
    };
    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
      window.speechSynthesis.cancel();
    };
  }, [lang, supported]);

  const speak = useCallback(
    (text: string, rate = 0.9) => {
      if (!supported) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = rate;
        if (voiceRef.current) u.voice = voiceRef.current;
        window.speechSynthesis.speak(u);
      } catch {
        // Баъзе браузерҳо овозро манъ мекунанд: дарс бе овоз идома меёбад
      }
    },
    [lang, supported],
  );

  return { speak, supported };
}
