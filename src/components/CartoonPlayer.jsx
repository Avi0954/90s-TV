import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import './CartoonPlayer.css';

const CartoonPlayer = () => {
    const { id: slug } = useParams();
    const navigate = useNavigate();

    const [cartoon, setCartoon] = useState(null);
    const [allShows, setAllShows] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    // Player state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

                // Clear any running timers on load
                if (upNextTimerRef.current) clearTimeout(upNextTimerRef.current);
                if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

                const show = await api.getShowBySlug(slug);
                setCartoon(show);

                const shows = await api.getAllShows();
                setAllShows(shows);

                // Set Prev/Next Episodes based on index in allShows (or same channel)
                // Using allShows for continuous binge watching
                const currentIndex = shows.findIndex(c => c._id === show._id || c.id === show.id);

                let nextEp = null;
                let prevEp = null;

                if (currentIndex >= 0) {
                    if (currentIndex < shows.length - 1) nextEp = shows[currentIndex + 1];
                    if (currentIndex > 0) prevEp = shows[currentIndex - 1];
                }

                setNextEpisode(nextEp);
                setPrevEpisode(prevEp);

                // Similarity ranking logic for Related Shows
                const others = shows.filter(c => c._id !== show._id && c.id !== show.id);
                const scored = others.map(c => {
                    let score = 0;
                    if (c.genre === show.genre) score += 10;
                    if (c.era === show.era) score += 5;
                    if (c.channel?._id === show.channel?._id) score += 5;
                    return { ...c, score };
                });

                const recommended = scored
                    .sort((a, b) => b.score - a.score || Math.random() - 0.5)
                    .slice(0, 10); // show a few more for horizontal scroll

                setRecommendations(recommended);
                setError(null);

                // Auto-play / Up Next countdown removed. Wait for manual click.

            } catch (err) {
                console.error("Player fetch error:", err);
                setError("Could not load cartoon data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayerData();

        return () => {
            if (upNextTimerRef.current) clearTimeout(upNextTimerRef.current);
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        };
    }, [slug]);

    // Countdown logic removed

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
                    <p>Loading Episode...</p>
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
                    <button className="btn-play-next" onClick={() => navigate('/dashboard')}>
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

    // Mock episode format S02E05 logic based on era/genre for demo purposes
    const mockSeason = (cartoon.title.length % 5) + 1;
    const mockEp = (cartoon.title.length % 20) + 1;
    const episodeFormat = `S0${mockSeason}E${mockEp < 10 ? '0' + mockEp : mockEp}`;

    return (
        <div className="premium-player-page">

            <header className="player-top-bar">
                <button className="btn-back" onClick={() => navigate(-1)} aria-label="Go Back">
                    <span aria-hidden="true">&larr;</span> Back
                </button>
                <div className="show-title">{cartoon.title}</div>
                {/* Empty div to balance flex spacing if needed, or add logo */}
                <div style={{ width: '60px' }}></div>
            </header>

            <main className="player-content-wrapper">

                {/* 16:9 Video Wrapper */}
                <div className="video-container">
                    {finalVideoUrl ? (
                        <iframe
                            className="video-frame"
                            src={isYouTube ? `${finalVideoUrl}?rel=0` : finalVideoUrl}
                            title={cartoon.title}
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="player-error">
                            <p>Video source unavailable</p>
                        </div>
                    )}

                    {/* Up Next Overlay inside Video Wrapper */}
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
                            <span className="ep-badge">{episodeFormat}</span>
                            <span>•</span>
                            <span>{cartoon.era || '1999'}</span>
                            <span>•</span>
                            <span>22m</span>
                            <span>•</span>
                            <span style={{ color: cartoon.channel?.themeColor || 'inherit' }}>{cartoon.channel?.name || cartoon.channelId || 'Cartoon Network'}</span>
                        </div>
                        <h1 className="episode-title-main">{cartoon.title}</h1>
                        <p className="episode-desc">
                            {cartoon.description || `Enjoy this classic from the ${cartoon.era}. A masterpiece of animation that defined an entire generation.`}
                        </p>
                    </div>

                    <div className="episode-nav">
                        <button
                            className="nav-btn"
                            disabled={!prevEpisode}
                            onClick={handlePlayPrev}
                            aria-label="Previous Episode"
                        >
                            <span aria-hidden="true">&larr;</span> Prev
                        </button>
                        <button
                            className="nav-btn"
                            disabled={!nextEpisode}
                            onClick={handlePlayNext}
                            aria-label="Next Episode"
                        >
                            Next <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </section>

                {/* Related Shows Row */}
                {recommendations.length > 0 && (
                    <section className="related-shows-section">
                        <h3 className="related-shows-title">More Like This</h3>
                        <div className="related-shows-row">
                            {recommendations.map(rec => (
                                <Link to={`/player/${rec.slug || rec.id}`} key={rec._id || rec.id} className="related-show-card">
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
                                            {rec.era} • {rec.category}
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
