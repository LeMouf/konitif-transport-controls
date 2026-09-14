# @konitif/transport-controls

Pure, product-neutral transport state and explicit playback-control intents.

## Installation

```sh
npm install @konitif/transport-controls
```

## What it provides

- Transport state for source, playback phase, range, cursor, rate and looping.
- Explicit load, play, pause, stop, seek, range, rate and loop intents.
- Deterministic state creation, normalization and reduction.
- A product-neutral Transport Controls tool-module declaration.

## Authority boundary

The package owns only local transport-control state and its pure transitions.
It owns no media, Timeline, clock, scheduler, runtime loop, application store or
external playback effect. A host decides whether and how an accepted state
transition commands a runtime.

## Quick start

```ts
import {
  createTransportControlState,
  reduceTransportControlState,
} from '@konitif/transport-controls';

const loaded = reduceTransportControlState(
  createTransportControlState(),
  { type: 'load', sourceId: 'clip:example', durationSeconds: 8 },
);
const playing = reduceTransportControlState(loaded, { type: 'play' });
```

## Public entry points

| Entry | Purpose |
| --- | --- |
| `@konitif/transport-controls` | Transport state, intents and deterministic reducer. |

## Reference

See [`reference/`](reference/) for the machine-readable capability catalog and
authority diagram.

## License

Source-available under [PolyForm Noncommercial 1.0.0](LICENSE.md), not OSI open
source. Commercial use requires separate written authorization.
