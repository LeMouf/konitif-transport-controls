import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createTransportControlState,
  reduceTransportControlState,
} from '../dist/index.js';

test('normalizes transport input without starting playback', () => {
  const state = createTransportControlState({
    playback: 'playing',
    range: { startSeconds: -2, endSeconds: 4 },
    cursorSeconds: 8,
    rate: 0,
  });
  assert.deepEqual(state, {
    sourceId: null,
    playback: 'playing',
    cursorSeconds: 4,
    range: { startSeconds: 0, endSeconds: 4 },
    rate: 0.01,
    loop: false,
  });
});

test('reduces explicit intents without owning a clock or effect', () => {
  const loaded = reduceTransportControlState(createTransportControlState(), {
    type: 'load',
    sourceId: 'clip:transport-proof',
    durationSeconds: 2,
  });
  const playing = reduceTransportControlState(loaded, { type: 'play' });
  const sought = reduceTransportControlState(playing, { type: 'seek', cursorSeconds: 8 });

  assert.equal(playing.playback, 'playing');
  assert.equal(sought.cursorSeconds, 2);
  assert.equal(loaded.cursorSeconds, 0);
});
