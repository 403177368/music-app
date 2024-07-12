/* eslint-disable no-param-reassign */
import { StoreClass } from './store';
import { Track } from './types';

export function selectTrack(store: StoreClass, track: Track) {
  store.activeTrackId = track.id;
}

export function playTrack(store: StoreClass) {
  store.trackState.status = 'playing';
  store.audioElement?.play();
}

export function pauseTrack(store: StoreClass) {
  store.trackState.status = 'paused';
  store.audioElement?.pause();
}
