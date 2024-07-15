/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { formatTime } from '@/common/utils';
import { StoreClass } from './store/store';
import { pauseTrack, playTrack } from './store/methods';
import styles from './ActiveTrack.module.scss';

export const ActiveTrack = observer(({ store }: { store: StoreClass; }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audioRef.current) {
      store.audioElement = audioRef.current;
      store.trackState.duration = audioRef.current?.duration || 0;
      audioRef.current.onloadedmetadata = () => {
        store.trackState.duration = audioRef.current?.duration || 0;
      };
      audioRef.current.ondurationchange = () => {
        store.trackState.duration = audioRef.current?.duration || 0;
      };
      audioRef.current.ontimeupdate = (e) => {
        store.trackState.current = audioRef.current?.currentTime || 0;
      };
      audioRef.current.onplay = () => {
        store.trackState.status = 'playing';
      };
      audioRef.current.onpause = () => {
        store.trackState.status = 'paused';
      };
    }
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="https://samplelib.com/lib/preview/mp3/sample-15s.mp3"
      >
        <track kind="captions" />
      </audio>
      {!store.activeTrack
        ? null
        : (
          <div className={styles.ActiveTrack}>
            <img
              src={store.activeTrack.album.cover}
              style={{
                height: 50,
                width: 50,
                borderRadius: 8,
                marginRight: 8,
              }}
            />
            <div>
              <div style={{
                color: 'white',
              }}
              >
                {store.activeTrack.title}
              </div>
              <div
                style={{
                  color: 'white',
                }}
              >
                {store.activeTrack.artists.map((artist) => artist.name).join(', ')}
              </div>
            </div>
            <div style={{
              display: 'flex',
            }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '100%',
                  background: '#3c3c3c',
                  textAlign: 'center',
                  lineHeight: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  marginRight: 10,
                }}
                onClick={() => {
                  if (store.trackState.status === 'paused') {
                    playTrack(store);
                  }
                  else {
                    pauseTrack(store);
                  }
                }}
              >
                {store.trackState.status === 'paused'
                  ? '>'
                  : '||'}
              </div>
              <div style={{
                fontSize: 14,
                width: 42,
                textAlign: 'center',
                color: 'white',
                lineHeight: '50px',
              }}
              >
                {formatTime(store.trackState.current)}
              </div>
              <div style={{
                position: 'relative',
                width: 200,
                height: 4,
                borderRadius: 2,
                background: 'orange',
              }}
              >
                <div style={{
                  position: 'absolute',
                  left: `${store.trackCurrentPercent}%`,
                  top: 2,
                  cursor: 'pointer',
                }}
                >
                  <div style={{
                    position: 'absolute',
                    left: -7,
                    top: -7,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    background: 'white',
                  }}
                  />
                </div>
              </div>
              <div style={{
                fontSize: 14,
                width: 42,
                textAlign: 'center',
                color: 'white',
                lineHeight: '50px',
              }}
              >
                {formatTime(store.trackState.duration)}
              </div>
            </div>
          </div>
        )}
    </>
  );
});
