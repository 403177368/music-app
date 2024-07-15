import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { formatTime } from '@/common/utils';
import { StoreClass } from './store/store';
import styles from './Home.module.scss';
import { selectTrack } from './store/methods';
import { ActiveTrack } from './ActiveTrack';
import { LeftMenu } from './LeftMenu';

export const Home = observer(() => {
  const store = useState(() => new StoreClass())[0];

  useEffect(() => {
    selectTrack(store, store.playlist.trackList[0]);
  }, []);

  return (
    <div className={styles.Home}>
      <div className={styles.upperPart}>
        <LeftMenu />
        <div className={styles.MainPart}>
          <InfoBox store={store} />
          <div style={{
            padding: 20,
          }}
          >
            <div className={styles.TrackListBox}>
              <div className={styles.trackListHead}>
                <div className={styles.cover} />
                <div className={styles.title}>TITLE</div>
                <div className={styles.artists}>ARTISTS</div>
                <div className={styles.album}>ALBUM</div>
                <div className={styles.time}>TIME</div>
              </div>
              {store.playlist.trackList.map((track) => {
                return (
                  <div
                    className={`${styles.trackListBody} ${
                      track.id === store.activeTrackId
                        ? styles.selected
                        : ''
                    }`}
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
          </div>
        </div>
      </div>
      <div className={styles.lowerPart}>
        <ActiveTrack store={store} />
      </div>
    </div>
  );
});

const InfoBox = observer(({ store }: { store: StoreClass; }) => {
  return (
    <div className={styles.infoBox}>
      <div className={styles.infoBoxBackground} />
      <div className={styles.infoBoxContent}>
        <div className={styles.headerBar}>
          {'<<'}
          {store.userInfo.username}
        </div>
        <div className={styles.coverContent}>
          <img
            className={styles.theCover}
            src="https://m.qtccolor.com/upload/image/20220517/ai.png"
          />
          <div>
            <div style={{
              color: 'white',
              fontSize: 14,
              marginTop: 30,
              marginBottom: 15,
            }}
            >
              Playlist
            </div>
            <div style={{
              color: 'white',
              fontSize: 30,
              fontWeight: 'bold',
              marginBottom: 8,
            }}
            >
              Hip Hop Mix
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
