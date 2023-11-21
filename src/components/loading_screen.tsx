import '../styles/loading_screen.module.css'
import React from 'react'

export default function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-circle"></div>
            <p>Loading...</p>
        </div>
    );
}
