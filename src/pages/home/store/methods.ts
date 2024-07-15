/* eslint-disable no-param-reassign */
import { getElementOffsetLeftToBody, getElementWidth } from '@/common/utils';
import { StoreClass } from './store';
import { Track } from './types';

export function selectTrack(store: StoreClass, track: Track) {
  store.activeTrackId = track.id;
  if (store.audioElement) {
    store.audioElement.currentTime = 0;
  }
  playTrack(store);
}

export function playTrack(store: StoreClass) {
  // store.trackState.status = 'playing';
  store.audioElement?.play();
}

export function pauseTrack(store: StoreClass) {
  // store.trackState.status = 'paused';
  store.audioElement?.pause();
}

export function pointerDownOnRoundButton(
  store: StoreClass,
  e: React.PointerEvent,
) {
  store.currentStatus = 'draggingRoundButton';
  store.pageX = e.pageX;
  store.pageY = e.pageY;
}

export function pointerDownOnProgressBar(
  store: StoreClass,
  e: React.PointerEvent,
) {
  e.stopPropagation();
  if (store.progressBar) {
    const left = getElementOffsetLeftToBody(store.progressBar);
    const width = getElementWidth(store.progressBar);
    let progress = (e.pageX - left) / width;
    if (progress < 0) {
      progress = 0;
    }
    if (progress > 1) {
      progress = 1;
    }
    if (store.audioElement) {
      store.audioElement.currentTime = progress * store.audioElement.duration;
    }
  }
}

export function pointerDownOnSegmentStart(
  store: StoreClass,
  e: React.PointerEvent,
) {
  e.stopPropagation();
  store.currentStatus = 'draggingSegmentStart';
  store.pageX = e.pageX;
  store.pageY = e.pageY;
}

export function pointerDownOnSegmentEnd(
  store: StoreClass,
  e: React.PointerEvent,
) {
  e.stopPropagation();
  store.currentStatus = 'draggingSegmentEnd';
  store.pageX = e.pageX;
  store.pageY = e.pageY;
}

export function onPointerMove(
  store: StoreClass,
  e: React.PointerEvent | PointerEvent,
) {
  // console.log(store.currentStatus);
  if (store.currentStatus === 'draggingRoundButton') {
    if (store.progressBar) {
      const width = getElementWidth(store.progressBar);
      const deltaX = e.pageX - store.pageX;
      const deltaSeconds = (deltaX / width) * store.trackState.duration;
      store.trackState.current += deltaSeconds;
      if (store.trackState.current < 0) {
        store.trackState.current = 0;
      }
      if (store.trackState.current > store.trackState.duration) {
        store.trackState.current = store.trackState.duration;
      }
      store.pageX = e.pageX;
    }
  }
  else if (store.currentStatus === 'draggingSegmentStart') {
    if (store.progressBar) {
      const width = getElementWidth(store.progressBar);
      const delta = (e.pageX - store.pageX) / width;
      store.pageX = e.pageX;
      const { segment } = store.trackState;
      segment.start += delta;
      if (segment.start < 0) {
        segment.start = 0;
      }
      if (segment.start > segment.end - 0.1) {
        segment.start = segment.end - 0.1;
      }
    }
  }
  else if (store.currentStatus === 'draggingSegmentEnd') {
    if (store.progressBar) {
      const width = getElementWidth(store.progressBar);
      const delta = (e.pageX - store.pageX) / width;
      store.pageX = e.pageX;
      const { segment } = store.trackState;
      segment.end += delta;
      if (segment.end > 1) {
        segment.end = 1;
      }
      if (segment.end < segment.start + 0.1) {
        segment.end = segment.start + 0.1;
      }
    }
  }
}

export function onPointerUp(store: StoreClass, e: PointerEvent) {
  if (store.currentStatus === 'draggingRoundButton') {
    if (store.audioElement) {
      store.audioElement.currentTime = store.trackState.current;
    }
  }
  store.currentStatus = '';
}
