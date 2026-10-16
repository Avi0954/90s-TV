import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import { useNostalgia } from '../context/NostalgiaContext';
import './CartoonPlayer.css';

const parseDurationToSeconds = (dur) => {
    if (!dur) return 1320;
    if (typeof dur === 'number') return dur;
    const match = String(dur).match(/(\d+)\s*m/i);
    if (match) return parseInt(match[1], 10) * 60;
    const num = parseInt(dur, 10);
    return isNaN(num) ? 1320 : num * 60;
};

const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const CartoonPlayer = () => {
    const { id: slug } = useParams();
    const navigate = useNavigate();
    const { isWatchlisted, toggleWatchlist, saveWatchProgress, getShowProgress } = useNostalgia();

    const [cartoon, setCartoon] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    // Player state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Playback Progress & Resume state
    const [startOffset, setStartOffset] = useState(0);
    const [resumePrompt, setResumePrompt] = useState(null);
    const watchTimeRef = useRef(0);

    // Up Next state
    const [showUpNext, setShowUpNext] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [nextEpisode, setNextEpisode] = useState(null);
    const [prevEpisode, setPrevEpisode] = useState(null);

    // References for timers
    const upNextTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setIsLoading(true);
                setShowUpNext(false);
                setCountdown(10);
                setResumePrompt(null);
                setStartOffset(0);

                if (upNextTimerRef.current) clearTimeout(upNextTimerRef.current);
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

                const show = await api.getShowBySlug(slug);
                setCartoon(show);

                const shows = await api.getAllShows();

                // Episode sequencing:
                // 1. If part of a franchise with multiple episodes, sort franchise episodes by season & episode
                // 2. Otherwise fall back to the same channel
                let sequence = [];
                if (show.franchise) {
                    const franchiseEpisodes = shows.filter(
                        c => c.franchise && c.franchise.toLowerCase() === show.franchise.toLowerCase()
                    );
                    if (franchiseEpisodes.length > 1) {
                        sequence = [...franchiseEpisodes].sort((a, b) => {
                            const seasonA = Number(a.season) || 1;
                            const seasonB = Number(b.season) || 1;
                            if (seasonA !== seasonB) return seasonA - seasonB;
                            const epA = Number(a.episodeNumber) || 1;
                            const epB = Number(b.episodeNumber) || 1;
                            return epA - epB;
                        });
                    }
                }

                if (sequence.length <= 1) {
                    sequence = shows.filter(
                        c => (c.channel?._id && show.channel?._id && c.channel._id === show.channel._id) ||
                            (c.channel?.slug && show.channel?.slug && c.channel.slug === show.channel.slug)
                    );
                }

                if (sequence.length <= 1) {
                    sequence = shows;
                }

                const currentIndex = sequence.findIndex(c => (c._id && c._id === show._id) || c.slug === show.slug);

                let nextEp = null;
                let prevEp = null;

                if (currentIndex >= 0) {
                    if (currentIndex < sequence.length - 1) nextEp = sequence[currentIndex + 1];
                    if (currentIndex > 0) prevEp = sequence[currentIndex - 1];
                }

                setNextEpisode(nextEp);
                setPrevEpisode(prevEp);

                // Recommendations: similarity based on genre, era, channel
                const others = shows.filter(c => c._id !== show._id && c.slug !== show.slug);
                const scored = others.map(c => {
                    let score = 0;
                    if (c.genre && c.genre === show.genre) score += 10;
                    if (c.era && c.era === show.era) score += 5;
                    if (c.channel?._id && show.channel?._id && c.channel._id === show.channel._id) score += 5;
                    return { ...c, score };
                });

                const recommended = scored
                    .sort((a, b) => b.score - a.score || Math.random() - 0.5)
                    .slice(0, 10);

                setRecommendations(recommended);
                setError(null);

                // Check stored watch progress
                const saved = getShowProgress ? getShowProgress(show.slug) : null;
                const totalSec = parseDurationToSeconds(show.duration);

                if (saved && saved.progressSeconds > 15 && saved.progressPercent < 95) {
                    setResumePrompt({
                        timeSeconds: saved.progressSeconds,
                        formatted: formatTime(saved.progressSeconds)
                    });
                    watchTimeRef.current = saved.progressSeconds;
                } else {
                    watchTimeRef.current = 0;
                    saveWatchProgress && saveWatchProgress(show.slug, 0, totalSec, {
                        title: show.title,
                        thumbnail: show.thumbnail,
                        era: show.era,
                        channel: show.channel
                    });
                }
            } catch (err) {
                console.error("Player fetch error:", err);
                setError("Could not load cartoon broadcast data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayerData();

        const upNextTimer = upNextTimerRef.current;
        const countdownTimer = countdownTimerRef.current;

        return () => {
            if (upNextTimer) clearTimeout(upNextTimer);
            if (countdownTimer) clearInterval(countdownTimer);
        };
    }, [slug, getShowProgress, saveWatchProgress]);

    // Interval to record progress while viewer is active on the page
    useEffect(() => {
        if (!cartoon || isLoading) return;

        const durSec = parseDurationToSeconds(cartoon.duration);

        const progressInterval = setInterval(() => {
            watchTimeRef.current += 10;
            if (watchTimeRef.current < durSec) {
                if (saveWatchProgress) {
                    saveWatchProgress(cartoon.slug, watchTimeRef.current, durSec, {
                        title: cartoon.title,
                        thumbnail: cartoon.thumbnail,
                        era: cartoon.era,
                        channel: cartoon.channel
                    });
                }
            }
        }, 10000);

        return () => {
            clearInterval(progressInterval);
            if (cartoon && saveWatchProgress && watchTimeRef.current > 5) {
                saveWatchProgress(cartoon.slug, watchTimeRef.current, durSec, {
                    title: cartoon.title,
                    thumbnail: cartoon.thumbnail,
                    era: cartoon.era,
                    channel: cartoon.channel
                });
            }
        };
    }, [cartoon, isLoading, saveWatchProgress]);

    const handleResumePlayback = () => {
        if (resumePrompt) {
            setStartOffset(Math.floor(resumePrompt.timeSeconds));
            setResumePrompt(null);
        }
    };

    const handleRestartPlayback = () => {
        if (!cartoon) return;
        const durSec = parseDurationToSeconds(cartoon.duration);
        watchTimeRef.current = 0;
        setStartOffset(0);
        setResumePrompt(null);
        if (saveWatchProgress) {
            saveWatchProgress(cartoon.slug, 0, durSec, {
                title: cartoon.title,
                thumbnail: cartoon.thumbnail,
                era: cartoon.era,
                channel: cartoon.channel
            });
        }
    };

    const handleCancelUpNext = () => {
        setShowUpNext(false);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };

    const handlePlayNext = () => {
        if (nextEpisode) {
            navigate(`/player/${nextEpisode.slug || nextEpisode.id}`);
        }
    };

    const handlePlayPrev = () => {
        if (prevEpisode) {
            navigate(`/player/${prevEpisode.slug || prevEpisode.id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="premium-player-page">
                <div className="player-loading">
                    <div className="spinner"></div>
                    <p>Tuning Frequency & Loading Episode...</p>
                </div>
            </div>
        );
    }

    if (error || !cartoon) {
        return (
            <div className="premium-player-page">
                <header className="player-top-bar">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <span aria-hidden="true">&larr;</span> Back
                    </button>
                    <div className="show-title">Error</div>
                </header>
                <div className="player-error">
                    <h2>Signal Lost</h2>
                    <p>{error || "Cartoon Not Found"}</p>
                    <button className="btn-play-next" onClick={() => navigate('/')}>
                        Return to Hub
                    </button>
                </div>
            </div>
        );
    }

    // Embed formatting
    let finalVideoUrl = cartoon.videoUrl;
    const isYouTube = finalVideoUrl && (finalVideoUrl.includes('youtube.com') || finalVideoUrl.includes('youtu.be'));

    if (isYouTube) {
        if (finalVideoUrl.includes('youtu.be/')) {
            const vidId = finalVideoUrl.split('youtu.be/')[1].split('?')[0];
            finalVideoUrl = `https://www.youtube.com/embed/${vidId}`;
        } else if (finalVideoUrl.includes('watch?v=')) {
            const vidId = finalVideoUrl.split('watch?v=')[1].split('&')[0];
            finalVideoUrl = `https://www.youtube.com/embed/${vidId}`;
        }
    }

    // Embed URL with resume offset
    let embedSrc = finalVideoUrl;
    if (finalVideoUrl && isYouTube) {
        const separator = finalVideoUrl.includes('?') ? '&' : '?';
        embedSrc = startOffset > 0
            ? `${finalVideoUrl}${separator}rel=0&autoplay=1&start=${startOffset}`
            : `${finalVideoUrl}${separator}rel=0`;
    }

    // Format episode badge accurately from actual schema fields
    let episodeFormat = null;
    if (cartoon.season && cartoon.episodeNumber) {
        episodeFormat = `S${String(cartoon.season).padStart(2, '0')}E${String(cartoon.episodeNumber).padStart(2, '0')}`;
    } else if (cartoon.episodeNumber) {
        episodeFormat = `EP ${cartoon.episodeNumber}`;
    } else if (cartoon.category && cartoon.category !== 'episode') {
        episodeFormat = cartoon.category.toUpperCase();
    }

    const watchlisted = isWatchlisted ? isWatchlisted(cartoon.slug) : false;

    return (
        <div className="premium-player-page">
            <header className="player-top-bar">
                <button className="btn-back" onClick={() => navigate(-1)} aria-label="Go Back">
                    <span aria-hidden="true">&larr;</span> Back
                </button>
                <div className="show-title">{cartoon.title}</div>
                <div style={{ width: '60px' }}></div>
            </header>

            <main className="player-content-wrapper">
                {/* Resume Playback Prompt Banner */}
                {resumePrompt && (
                    <aside className="resume-banner" aria-label="Resume Playback Banner">
                        <div className="resume-text">
                            <span className="resume-icon">⏱️</span>
                            <span>You were watching this at <strong>{resumePrompt.formatted}</strong></span>
                        </div>
                        <div className="resume-actions">
                            <button className="resume-btn primary" onClick={handleResumePlayback}>
                                Resume at {resumePrompt.formatted}
                            </button>
                            <button className="resume-btn secondary" onClick={handleRestartPlayback}>
                                Start from Beginning
                            </button>
                        </div>
                    </aside>
                )}

                {/* 16:9 Video Wrapper */}
                <div className="video-container">
                    {embedSrc ? (
                        <iframe
                            className="video-frame"
                            src={embedSrc}
                            title={cartoon.title}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="player-empty-state">
                            <span className="empty-icon">📺💨</span>
                            <h3>Broadcast Signal Unavailable</h3>
                            <p>No video tape found for this episode.</p>
                            {nextEpisode && (
                                <button className="btn-play-next" onClick={handlePlayNext}>
                                    Play Next Episode ({nextEpisode.title})
                                </button>
                            )}
                        </div>
                    )}

                    {/* Up Next Overlay */}
                    {showUpNext && nextEpisode && (
                        <div className="up-next-overlay">
                            <img
                                src={nextEpisode.thumbnail}
                                alt={nextEpisode.title}
                                className="up-next-thumb"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                            />
                            <div className="up-next-details">
                                <span className="up-next-label">Up Next in {countdown}</span>
                                <h4 className="up-next-title">{nextEpisode.title}</h4>
                                <div className="up-next-actions">
                                    <button className="btn-play-next" onClick={handlePlayNext}>
                                        Play Now
                                    </button>
                                    <button className="btn-cancel" onClick={handleCancelUpNext}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Episode Information */}
                <section className="episode-section">
                    <div className="episode-info">
                        <div className="episode-meta-row">
                            {episodeFormat && <span className="ep-badge">{episodeFormat}</span>}
                            {episodeFormat && <span>•</span>}
                            <span>{cartoon.era || '90s'}</span>
                            <span>•</span>
                            <span>{cartoon.duration || '22m'}</span>
                            {cartoon.genre && (
                                <>
                                    <span>•</span>
                                    <span className="ep-genre">{cartoon.genre}</span>
                                </>
                            )}
                            <span>•</span>
                            <span style={{ color: cartoon.channel?.themeColor || 'inherit' }}>
                                {cartoon.channel?.name || cartoon.channelId || 'Cartoon Network'}
                            </span>
                        </div>
                        <h1 className="episode-title-main">{cartoon.title}</h1>
                        <p className="episode-desc">
                            {cartoon.description || `Enjoy this classic from the ${cartoon.era || 'golden era'}. A masterpiece of animation that defined an entire generation.`}
                        </p>
                    </div>

                    <div className="episode-actions-cluster">
                        {/* Watchlist Toggle */}
                        <button
                            className={`watchlist-btn ${watchlisted ? 'active' : ''}`}
                            onClick={() => toggleWatchlist && toggleWatchlist(cartoon.slug)}
                            aria-label={watchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
                        >
                            <span className="watchlist-icon">{watchlisted ? '✓' : '+'}</span>
                            <span>{watchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
                        </button>

                        {/* Prev / Next Navigation */}
                        <div className="episode-nav">
                            <button
                                className="nav-btn"
                                disabled={!prevEpisode}
                                onClick={handlePlayPrev}
                                title={prevEpisode ? `Previous: ${prevEpisode.title}` : "No previous episode in sequence"}
                                aria-label="Previous Episode"
                            >
                                <span aria-hidden="true">&larr;</span> Prev
                            </button>
                            <button
                                className="nav-btn"
                                disabled={!nextEpisode}
                                onClick={handlePlayNext}
                                title={nextEpisode ? `Next: ${nextEpisode.title}` : "No next episode in sequence"}
                                aria-label="Next Episode"
                            >
                                Next <span aria-hidden="true">&rarr;</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Related Shows Row */}
                {recommendations.length > 0 && (
                    <section className="related-shows-section">
                        <h3 className="related-shows-title">More Like This</h3>
                        <div className="related-shows-row">
                            {recommendations.map(rec => (
                                <Link to={`/player/${rec.slug || rec.id}`} key={rec._id || rec.slug} className="related-show-card">
                                    <div className="related-thumb-wrapper">
                                        <img
                                            src={rec.thumbnail}
                                            alt={rec.title}
                                            className="related-thumb"
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                                        />
                                    </div>
                                    <div className="related-info">
                                        <h4 className="related-title">{rec.title}</h4>
                                        <div className="related-meta">
                                            {rec.era} • {rec.genre || rec.category}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default CartoonPlayer;
