/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { formatTime } from '@/common/utils';
import { StoreClass } from './store/store';
import { pauseTrack, playTrack } from './store/methods';

export const ActiveTrack = observer(({ store }: { store: StoreClass; }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audioRef.current) {
      store.audioElement = audioRef.current;
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
          <div style={{
            position: 'fixed',
            left: 0,
            bottom: 0,
            width: '100%',
            background: 'red',
          }}
          >
            {store.activeTrack.title}
            <div onClick={() => {
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
            <div>
              {formatTime(store.trackState.current)}
            </div>
          </div>
        )}
    </>
  );
});
