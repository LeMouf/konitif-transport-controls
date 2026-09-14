import {
  createTransportControlState,
  reduceTransportControlState,
  type TransportControlIntent,
  type TransportControlState,
} from '@konitif/transport-controls';

const intent: TransportControlIntent = { type: 'play' };
const initial: TransportControlState = createTransportControlState();
const next: TransportControlState = reduceTransportControlState(initial, intent);
void next;
