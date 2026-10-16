import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNostalgia } from '../context/NostalgiaContext';
import './Intro.css';

const IntroPage = () => {
    const { completeIntro } = useNostalgia();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [randomVideo, setRandomVideo] = useState('');

    useEffect(() => {
        const videoList = [
            '/videos/intro/Walkthrough.mp4',
            '/videos/intro/static.mp4',
            '/videos/intro/bumps.mp4',
            '/videos/intro/vhs_abstract.mp4',
            '/videos/intro/tv_bars.mp4',
            '/videos/intro/classic_intro.mp4',
            '/videos/intro/childhood_clips.mp4'
        ];

        const selected = videoList[Math.floor(Math.random() * videoList.length)];
        setRandomVideo(selected);
    }, []);

    const handleEnter = () => {
        setIsExiting(true);
        setTimeout(() => {
            completeIntro(dontShowAgain);
            navigate('/');
        }, 800);
    };

    const handleSkip = () => {
        setIsExiting(true);
        setTimeout(() => {
            completeIntro(dontShowAgain);
            navigate('/');
        }, 400);
    };

    return (
        <div className={`intro-container hud-layout ${isExiting ? 'intro-exit' : 'intro-fade-in'}`}>
            {/* Random Video Background */}
            <div className="video-background">
                {randomVideo && (
                    <video
                        key={randomVideo}
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="bg-video"
                    >
                        <source src={randomVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
                <div className="video-overlay"></div>
            </div>

            {/* Retro Overlays */}
            <div className="vhs-grain"></div>
            <div className="crt-scanlines"></div>

            {/* System HUD Top-Right */}
            <div className="system-hud">
                <div className="hud-stat">SIGNAL: 100%</div>
                <div className="hud-stat">SOURCE: VCR-01</div>
                <div className="hud-stat">TRACKING: AUTO</div>
            </div>

            <div className="intro-content">
                <div className="intro-header">
                    <h1 className="intro-title" data-text="LOADING MEMORIES...">
                        LOADING MEMORIES...
                    </h1>
                    <p className="intro-subtitle">
                        After School • TV Time • Cartoons
                    </p>
                </div>

                <div className="intro-actions">
                    <button
                        className="btn-enter"
                        onClick={handleEnter}
                    >
                        ENTER REALITY
                    </button>

                    <div className="action-row-secondary">
                        <button className="btn-skip" onClick={handleSkip}>
                            SKIP TO DASHBOARD
                        </button>

                        {/* Integrated Preference Toggle */}
                        <div
                            className={`hud-pref-toggle ${dontShowAgain ? 'active' : ''}`}
                            onClick={() => setDontShowAgain(!dontShowAgain)}
                        >
                            <span className="pref-icon">
                                {dontShowAgain ? '💾' : '📼'}
                            </span>
                            <span>
                                {dontShowAgain ? "Memory Saved" : "Remember This"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="vhs-timestamp">DEC 31 1995 04:20 PM</div>
        </div>
    );
};

export default IntroPage;
