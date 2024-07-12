import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { formatTime } from '@/common/utils';
import { StoreClass } from './store/store';
import styles from './Home.module.scss';
import { selectTrack } from './store/methods';
import { ActiveTrack } from './ActiveTrack';

export const Home = observer(() => {
  const store = useState(() => new StoreClass())[0];
  return (
    <div className={styles.Home}>
      {store.userInfo.username}
      <div>
        <div className={styles.TrackListBox}>
          <div className={styles.cover} />
          <div className={styles.title}>TITLE</div>
          <div className={styles.artists}>ARTISTS</div>
          <div className={styles.album}>ALBUM</div>
          <div className={styles.time}>TIME</div>
        </div>
        {store.playlist.trackList.map((track) => {
          return (
            <div
              className={styles.TrackListBox}
              key={track.id}
              onClick={() => {
                selectTrack(store, track);
              }}
            >
              <div className={styles.cover}>
                <img
                  className={styles.coverImg}
                  src={track.album.cover}
                  alt=""
                />
              </div>
              <div className={styles.title}>
                {
                track.title
              }
              </div>
              <div className={styles.artists}>
                {track.artists.map((artist) => {
                  return artist.name;
                }).join(', ')}
              </div>
              <div className={styles.album}>
                {track.album.name}
              </div>
              <div className={styles.time}>
                {formatTime(track.duration / 1000)}
              </div>
            </div>
          );
        })}
      </div>
      <ActiveTrack store={store} />
    </div>
  );
});
