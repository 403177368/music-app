import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './LeftMenu.module.scss';

export const LeftMenu = observer(() => {
  return (
    <div className={styles.LeftMenu}>
      <div className={styles.header}>
        <div className={styles.logo} />
        <div className={styles.title}>
          MusicApp
        </div>
      </div>
      <div>
        <div className={styles.item}>Home</div>
        <div className={styles.item}>Browse</div>
        <div className={styles.item}>Playlists</div>
        <div className={styles.item}>Albums</div>
        <div className={styles.item}>Tracks</div>
        <div className={styles.item}>Artists</div>
      </div>
    </div>
  );
});
