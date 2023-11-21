import styles from '../styles/loading_screen.module.css'
import React from 'react'

export default function LoadingScreen() {
    return (
        <div className={styles.loadingScreen}>
            <div className={styles.loadingCircle}></div>
            <p>Loading...</p>
        </div>
    );
}
