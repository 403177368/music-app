/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { formatTime } from '@/common/utils';
import { StoreClass } from './store/store';
import {
  onPointerMove, onPointerUp, pauseTrack, playTrack, pointerDownOnProgressBar, pointerDownOnRoundButton,
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
      onPointerUp(store, e);
    }

    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);

    return () => {
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
              alt=""
            />
            <TrackInfo store={store} />
            <div style={{
              display: 'flex',
              flex: 1,
              // overflow: 'hidden',
            }}
            >
              <div
                className={styles.playBtn}
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
                fontSize: 12,
                width: 42,
                textAlign: 'center',
                color: 'white',
                lineHeight: '50px',
                marginRight: 4,
              }}
              >
                {formatTime(store.trackState.current)}
              </div>
              <div style={{
                position: 'relative',
                minWidth: 100,
                flex: 1,
                height: '100%',
              }}
              >
                <ProgressBar store={store} />
                <SegmentBar store={store} />
              </div>
              <div style={{
                fontSize: 12,
                width: 42,
                textAlign: 'center',
                color: 'white',
                lineHeight: '50px',
                marginLeft: 4,
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
  return (
    <div
      className={styles.ProgressBar}
      ref={(el) => { store.progressBar = el; }}
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
            left: -5,
            top: -5,
            width: 10,
            height: 10,
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

const TrackInfo = observer(({ store }: { store: StoreClass; }) => {
  if (!store.activeTrack) return null;

  return (
    <div className={styles.TrackInfo}>
      <div className={styles.trackTitle}>
        {store.activeTrack.title}
      </div>
      <div className={styles.trackArtists}>
        {store.activeTrack.artists.map((artist) => artist.name).join(', ')}
      </div>
    </div>
  );
});

const SegmentBar = observer(({ store }: { store: StoreClass; }) => {
  return (
    <div className={styles.SegmentBar}>
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
          className={styles.shortBar}
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
          className={styles.shortBar}
          onPointerDown={(e) => {
            pointerDownOnSegmentEnd(store, e);
          }}
        />
      </div>
    </div>
  );
});
