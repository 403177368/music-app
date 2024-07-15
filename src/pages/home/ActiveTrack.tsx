/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { formatTime } from '@/common/utils';
import { StoreClass } from './store/store';
import {
  onPointerMove, pauseTrack, playTrack, pointerDownOnProgressBar, pointerDownOnRoundButton,
  pointerDownOnSegmentEnd,
  pointerDownOnSegmentStart,
} from './store/methods';
import styles from './ActiveTrack.module.scss';
import { Pause, Play } from './icons';

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
        if (store.currentStatus !== 'draggingRoundButton') {
          store.trackState.current = audioRef.current?.currentTime || 0;
        }

        if (audioRef.current) {
          if (audioRef.current.currentTime < store.trackState.segment.start * audioRef.current.duration) {
            audioRef.current.currentTime = store.trackState.segment.start * audioRef.current.duration;
          }
          else if (audioRef.current.currentTime > store.trackState.segment.end * audioRef.current.duration) {
            audioRef.current.currentTime = store.trackState.segment.start * audioRef.current.duration;
            audioRef.current.pause();
          }
        }
      };
      audioRef.current.onplay = () => {
        store.trackState.status = 'playing';
      };
      audioRef.current.onpause = () => {
        store.trackState.status = 'paused';
      };
    }

    function pointerMove(e: PointerEvent) {
      onPointerMove(store, e);
    }

    function pointerUp(e: PointerEvent) {
      if (store.audioElement) {
        store.audioElement.currentTime = store.trackState.current;
      }
      store.currentStatus = '';
    }

    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);

    return () => {
      store.progressBar = null;
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
    };
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
            <div style={{
              width: 200,
              paddingTop: 4,
              marginRight: 10,
            }}
            >
              <div style={{
                color: 'white',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 14,
              }}
              >
                {store.activeTrack.title}
              </div>
              <div
                style={{
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: 12,
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
                  display: 'flex',
                  alignItems: 'center',
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
                  ? <Play />
                  : <Pause />}
              </div>
              <div style={{
                fontSize: 14,
                width: 42,
                textAlign: 'center',
                color: 'white',
                lineHeight: '50px',
                marginRight: 8,
              }}
              >
                {formatTime(store.trackState.current)}
              </div>
              <div style={{
                position: 'relative',
                width: 200,
                height: '100%',
              }}
              >
                <ProgressBar store={store} />
                <SegmentBar store={store} />
              </div>
              <div style={{
                fontSize: 14,
                width: 42,
                textAlign: 'center',
                color: 'white',
                lineHeight: '50px',
                marginLeft: 8,
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

const ProgressBar = observer(({
  store,
}: {
  store: StoreClass;
}) => {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    store.progressBar = progressBarRef.current;
  }, [store.activeTrack]);

  return (
    <div
      style={{
        position: 'relative',
        left: 0,
        top: 23,
        width: '100%',
        height: 4,
        borderRadius: 2,
        background: '#505050',
        cursor: 'pointer',
      }}
      ref={progressBarRef}
      onPointerDown={(e) => {
        pointerDownOnProgressBar(store, e);
      }}
    >
      <div style={{
        position: 'absolute',
        height: '100%',
        left: 0,
        width: `${store.trackCurrentPercent}%`,
        background: '#fb5f2f',
        borderRadius: 2,
      }}
      />
      <div style={{
        position: 'absolute',
        left: `${store.trackCurrentPercent}%`,
        top: 2,
        cursor: 'pointer',
      }}
      >
        <div
          style={{
            position: 'absolute',
            left: -7,
            top: -7,
            width: 14,
            height: 14,
            borderRadius: 7,
            background: 'white',
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            pointerDownOnRoundButton(store, e);
          }}
        />
      </div>
    </div>
  );
});

const SegmentBar = observer(({ store }: { store: StoreClass; }) => {
  return (
    <div style={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      height: 2,
      background: '#505050',
    }}
    >
      <div style={{
        position: 'absolute',
        left: `${store.trackState.segment.start * 100}%`,
        top: 0,
        bottom: 0,
        width: `${(store.trackState.segment.end - store.trackState.segment.start) * 100}%`,
        height: 2,
        background: '#fb5f2f',
      }}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: `${store.trackState.segment.start * 100}%`,
      }}
      >
        <div
          style={{
            position: 'absolute',
            left: -2,
            top: -4,
            width: 4,
            height: 10,
            background: 'white',
            borderRadius: 2,
            cursor: 'pointer',
          }}
          onPointerDown={(e) => {
            pointerDownOnSegmentStart(store, e);
          }}
        />
      </div>
      <div style={{
        position: 'absolute',
        left: `${store.trackState.segment.end * 100}%`,
      }}
      >
        <div
          style={{
            position: 'absolute',
            left: -2,
            top: -4,
            width: 4,
            height: 10,
            background: 'white',
            borderRadius: 2,
            cursor: 'pointer',
          }}
          onPointerDown={(e) => {
            pointerDownOnSegmentEnd(store, e);
          }}
        />
      </div>
    </div>
  );
});
