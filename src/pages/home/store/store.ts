import {
  computed, configure, makeObservable, observable,
} from 'mobx';
import { generateUUID, getAlbumCover, getDuration } from '@/common/utils';
import { Playlist, Track, User } from './types';

interface TrackState {
  status: 'playing' | 'paused';
  current: number;
}

configure({
  enforceActions: 'never',
});

export class StoreClass {
  constructor() {
    makeObservable(this);
  }

  @observable
    userInfo: User = {
      id: generateUUID(),
      username: '',
      avatar: '',
    };

  @observable
    playlist: Playlist = {
      id: generateUUID(),
      name: 'Hip Hop Mix',
      description: '',
      cover: '',
      trackList: [{
        id: generateUUID(),
        title: 'Jazzy Belle',
        duration: getDuration(4, 11),
        artists: [{
          id: '',
          name: 'Outkast',
        }],
        album: {
          id: generateUUID(),
          name: 'AtLiens',
          cover: getAlbumCover(),
        },
      }, {
        id: generateUUID(),
        title: 'Survival Of The Fittest',
        duration: getDuration(3, 44),
        artists: [{
          id: '',
          name: 'Mobb Deep',
        }],
        album: {
          id: generateUUID(),
          name: 'The Infamous',
          cover: getAlbumCover(),
        },
      }],
    };

  @observable
    activeTrackId: string = '';

  @computed
  get activeTrack(): Track | null {
    if (this.activeTrackId) {
      return this.playlist.trackList.find((track) => track.id === this.activeTrackId) || null;
    }
    return null;
  }

  audioElement: HTMLAudioElement | null = null;

  @observable
    trackState: TrackState = {
      status: 'paused',
      current: 0,
    };
}
