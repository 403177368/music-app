import {
  computed, configure, makeObservable, observable,
} from 'mobx';
import { generateUUID, getAlbumCover, getDuration } from '@/common/utils';
import { Playlist, Track, User } from './types';

interface TrackState {
  status: 'playing' | 'paused';
  current: number;
  duration: number;
  segment: {
    start: number;
    end: number;
  };
}

configure({
  enforceActions: 'never',
});

function getTrackList() {
  const trackList: Track[] = [
    {
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
    },
    {
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
    },
    {
      id: generateUUID(),
      title: 'Lose Yourself',
      duration: getDuration(5, 22),
      artists: [{
        id: '',
        name: 'Eminem',
      }],
      album: {
        id: generateUUID(),
        name: 'Just Lose It',
        cover: getAlbumCover(),
      },
    },
    {
      id: generateUUID(),
      title: 'All Girls Are The Same',
      duration: getDuration(2, 45),
      artists: [{
        id: '',
        name: 'Juice WRLD',
      }],
      album: {
        id: generateUUID(),
        name: 'Good Bye & Good Riddance',
        cover: getAlbumCover(),
      },
    },
    {
      id: generateUUID(),
      title: 'California Love - Original Version',
      duration: getDuration(4, 44),
      artists: [{
        id: '',
        name: '2 Pac',
      }, {
        id: '',
        name: 'Roger',
      }, {
        id: '',
        name: 'Dr. Dre',
      }],
      album: {
        id: generateUUID(),
        name: 'Greatest Hits',
        cover: getAlbumCover(),
      },
    },
    {
      id: generateUUID(),
      title: 'Rapstar',
      duration: getDuration(2, 45),
      artists: [{
        id: '',
        name: 'Polo G',
      }],
      album: {
        id: generateUUID(),
        name: 'Hall Of Hame',
        cover: getAlbumCover(),
      },
    },
  ];

  return trackList;
}

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
      trackList: getTrackList(),
    };

  @observable
    activeTrackId: string = '';

  @observable
    currentStatus: ''
  | 'draggingRoundButton'
  | 'draggingSegmentStart'
  | 'draggingSegmentEnd' = '';

  @observable
    pageX = 0;

  @observable
    pageY = 0;

  @computed
  get activeTrack(): Track | null {
    if (this.activeTrackId) {
      return this.playlist.trackList.find((track) => track.id === this.activeTrackId) || null;
    }
    return null;
  }

  audioElement: HTMLAudioElement | null = null;

  progressBar: HTMLDivElement | null = null;

  @observable
    trackState: TrackState = {
      status: 'paused',
      current: 0,
      duration: 0,
      segment: {
        start: 0,
        end: 1,
      },
    };

  @computed
  get trackCurrentPercent() {
    if (this.trackState.duration !== 0) {
      return this.trackState.current / this.trackState.duration * 100;
    }
    return 0;
  }
}
