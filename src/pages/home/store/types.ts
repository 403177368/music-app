export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  name: string;
  cover: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  trackList: Track[];
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  artists: Artist[];
  album: Album;
}
