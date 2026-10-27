/**
 * Safe Speech Recognition Service
 *
 * Wraps native speech recognition safely so that:
 * 1. In Development Builds / Standalone APKs (where native binary exists),
 *    it runs real on-device native speech recognition via Android SpeechRecognizer.
 * 2. In Expo Go (where native binary modules are not compiled into the prebuilt client),
 *    it gracefully detects that the native module is unavailable without throwing
 *    an unhandled top-level exception that crashes the entire router/app.
 */

import { requireOptionalNativeModule } from 'expo';

// Safely require native module; returns null if not installed/linked (e.g. in Expo Go)
const NativeModule: any = requireOptionalNativeModule('ExpoSpeechRecognition');

export const isSpeechRecognitionNativeAvailable = (): boolean => {
  return NativeModule !== null && NativeModule !== undefined;
};

export async function requestSpeechPermissionsAsync(): Promise<{
  granted: boolean;
  canAskAgain?: boolean;
  status?: string;
}> {
  if (!NativeModule) {
    return { granted: false, status: 'unavailable', canAskAgain: false };
  }
  try {
    if (typeof NativeModule.requestPermissionsAsync === 'function') {
      return await NativeModule.requestPermissionsAsync();
    }
  } catch (err) {
    console.warn('requestSpeechPermissionsAsync error:', err);
  }
  return { granted: false, status: 'denied', canAskAgain: true };
}

export async function getSpeechPermissionsAsync(): Promise<{
  granted: boolean;
  canAskAgain?: boolean;
  status?: string;
}> {
  if (!NativeModule) {
    return { granted: false, status: 'unavailable', canAskAgain: false };
  }
  try {
    if (typeof NativeModule.getPermissionsAsync === 'function') {
      return await NativeModule.getPermissionsAsync();
    }
  } catch (err) {
    console.warn('getSpeechPermissionsAsync error:', err);
  }
  return { granted: false, status: 'denied', canAskAgain: true };
}

export function startSpeechRecognition(options: {
  lang?: string;
  interimResults?: boolean;
  maxAlternatives?: number;
}): void {
  if (!NativeModule) {
    throw new Error('Native speech recognition module is unavailable.');
  }
  NativeModule.start(options);
}

export function stopSpeechRecognition(): void {
  if (!NativeModule) return;
  try {
    NativeModule.stop();
  } catch (e) {
    console.warn('stopSpeechRecognition error:', e);
  }
}

export function abortSpeechRecognition(): void {
  if (!NativeModule) return;
  try {
    NativeModule.abort();
  } catch (e) {
    console.warn('abortSpeechRecognition error:', e);
  }
}

export function addSpeechEventListener(
  eventName: string,
  listener: (...args: any[]) => void
): () => void {
  if (!NativeModule || typeof NativeModule.addListener !== 'function') {
    return () => {};
  }
  try {
    const subscription = NativeModule.addListener(eventName, listener);
    return () => {
      try {
        if (subscription && typeof subscription.remove === 'function') {
          subscription.remove();
        } else if (typeof NativeModule.removeListener === 'function') {
          NativeModule.removeListener(eventName, listener);
        }
      } catch (e) {}
    };
  } catch (err) {
    console.warn(`addSpeechEventListener error for ${eventName}:`, err);
    return () => {};
  }
}
