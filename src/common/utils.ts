import { v4 } from 'uuid';

export function generateUUID() {
  return v4();
}

export function getDuration(minutes: number, seconds: number) {
  return (minutes * 60 + seconds) * 1000;
}

export function getAlbumCover() {
  return 'https://ms.bdimg.com/pacific/0/pic/141560952_704961999.jpg';
}

export function formatTime(seconds: number) {
  const secs = Number((seconds % 60).toFixed(0));
  const minutes = Math.floor(seconds / 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
