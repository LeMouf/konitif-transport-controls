import { defineKonitifToolModule } from '@konitif/tools';

export type TransportPlaybackState = 'stopped' | 'playing' | 'paused';

export interface TransportRange {
  startSeconds: number;
  endSeconds: number;
}

export interface TransportControlState {
  sourceId: string | null;
  playback: TransportPlaybackState;
  cursorSeconds: number;
  range: TransportRange;
  rate: number;
  loop: boolean;
}

export type TransportControlIntent =
  | { type: 'load'; sourceId: string | null; durationSeconds: number }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'stop' }
  | { type: 'seek'; cursorSeconds: number }
  | { type: 'set-range'; range: TransportRange }
  | { type: 'set-rate'; rate: number }
  | { type: 'set-loop'; loop: boolean };

export function createTransportControlState(
  input: Partial<TransportControlState> = {}
): TransportControlState {
  const range = normalizeRange(input.range ?? { startSeconds: 0, endSeconds: 0 });

  return {
    sourceId: input.sourceId ?? null,
    playback: input.playback ?? 'stopped',
    cursorSeconds: clamp(finite(input.cursorSeconds, range.startSeconds), range.startSeconds, range.endSeconds),
    range,
    rate: Math.max(0.01, finite(input.rate, 1)),
    loop: input.loop ?? false
  };
}

export function reduceTransportControlState(
  state: TransportControlState,
  intent: TransportControlIntent
): TransportControlState {
  switch (intent.type) {
    case 'load':
      return createTransportControlState({
        sourceId: intent.sourceId,
        range: { startSeconds: 0, endSeconds: intent.durationSeconds }
      });
    case 'play':
      return { ...state, playback: state.sourceId ? 'playing' : 'stopped' };
    case 'pause':
      return { ...state, playback: state.playback === 'playing' ? 'paused' : state.playback };
    case 'stop':
      return { ...state, playback: 'stopped', cursorSeconds: state.range.startSeconds };
    case 'seek':
      return { ...state, cursorSeconds: clamp(finite(intent.cursorSeconds), state.range.startSeconds, state.range.endSeconds) };
    case 'set-range': {
      const range = normalizeRange(intent.range);
      return { ...state, range, cursorSeconds: clamp(state.cursorSeconds, range.startSeconds, range.endSeconds) };
    }
    case 'set-rate':
      return { ...state, rate: Math.max(0.01, finite(intent.rate, 1)) };
    case 'set-loop':
      return { ...state, loop: intent.loop };
  }
}

export const transportControlsToolModule = defineKonitifToolModule({
  id: 'konitif.transport-controls',
  name: 'KONITIF Transport Controls',
  capability: 'temporal-control',
  description: 'Pure playback control state and intents without a clock or product authority.'
});

function normalizeRange(range: TransportRange): TransportRange {
  const startSeconds = Math.max(0, finite(range.startSeconds));
  const endSeconds = Math.max(startSeconds, finite(range.endSeconds, startSeconds));
  return { startSeconds, endSeconds };
}

function finite(value: number | undefined, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
