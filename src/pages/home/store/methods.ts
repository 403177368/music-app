/* eslint-disable no-param-reassign */
import { StoreClass } from './store';
import { Track } from './types';

export function selectTrack(store: StoreClass, track: Track) {
  store.activeTrackId = track.id;
  if (store.audioElement) {
    store.audioElement.currentTime = 0;
  }
}

export function playTrack(store: StoreClass) {
  store.trackState.status = 'playing';
  store.audioElement?.play();
}

export function pauseTrack(store: StoreClass) {
  store.trackState.status = 'paused';
  store.audioElement?.pause();
}
