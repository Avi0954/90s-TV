import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import './CartoonList.css';
import { ShowSkeleton } from './Skeletons';

const CartoonList = () => {
    const { id: slug } = useParams();
    const navigate = useNavigate();

    const [channel, setChannel] = useState(null);
    const [shows, setShows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                setIsLoading(true);
                const [channelData, showsData] = await Promise.all([
                    api.getChannelBySlug(slug),
                    api.getShowsByChannel(slug)
                ]);

                setChannel(channelData);
                setShows(showsData);
                setError(null);
            } catch (err) {
                console.error("Channel fetch error:", err);
                setError(err.message || "Signal Lost...");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChannelData();
    }, [slug]);

    const handleShowClick = (showSlug) => {
        navigate(`/player/${showSlug}`);
    };

    const renderShowCard = (show) => (
        <div
            key={show._id || show.id}
            className="editorial-show-card"
            onClick={() => handleShowClick(show.slug || show.id)}
            onKeyDown={(e) => e.key === 'Enter' && handleShowClick(show.slug || show.id)}
            tabIndex="0"
        >
            <div className="editorial-thumb-container">
                <img src={show.thumbnail} alt={show.title} className="editorial-show-thumb" loading="lazy" />
                <div className="editorial-card-gradient"></div>

                <div className="editorial-hover-overlay">
                    <span className="editorial-play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </span>
                </div>

                <div className="editorial-show-details">
                    <h3 className="editorial-show-title" title={show.title}>{show.title}</h3>
                    <span className="editorial-show-meta">{show.category || show.genre || show.era}</span>
                </div>
            </div>
        </div>
    );

    if (error || (!isLoading && !channel)) {
        return (
            <div className="editorial-channel-page error-container">
                <header className="editorial-hero-section">
                    <div className="editorial-hero-content">
                        <Link to="/" className="editorial-back-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Hub
                        </Link>
                        <div className="editorial-hero-branding" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                            <h1 className="editorial-hero-title">{error || "Signal Lost..."}</h1>
                            <p className="editorial-hero-desc">We couldn't find this channel in our archives.</p>
                        </div>
                    </div>
                </header>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="editorial-channel-page" style={{ padding: '80px 5%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                    {Array(8).fill(0).map((_, i) => <ShowSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    // --- Dynamic Stats Processing ---
    const showCount = shows.length;
    const erasPresent = Array.from(new Set(shows.map(s => s.era).filter(Boolean))).sort();
    const eraString = erasPresent.length > 0 ? erasPresent.join(' / ') : '';
    const uniqueGenres = new Set(shows.map(s => s.genre || s.category).filter(Boolean)).size;

    const statsElements = [];
    if (showCount > 0) statsElements.push(`${showCount} Shows`);
    if (eraString) statsElements.push(eraString);
    if (uniqueGenres > 0) statsElements.push(`${uniqueGenres} Genres`);

    // --- Curated Data Segregation ---
    const spotlightShow = shows.length > 0 ? shows[0] : null;
    const remainingShows = shows.length > 1 ? shows.slice(1) : []; // Rest for 4-col grid

    return (
        <div
            className="editorial-channel-page"
            style={{ '--channel-brand': channel?.themeColor || '#ffffff' }}
        >
            {/* 1. Minimal Header (Max 320px) */}
            <header className="editorial-hero-section">
                <div className="editorial-hero-content">
                    <Link to="/" className="editorial-back-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Hub
                    </Link>

                    <div className="editorial-hero-branding">
                        <div className="editorial-hero-logo-wrapper">
                            <img src={channel.logo} alt={channel.name} className="editorial-hero-logo" />
                        </div>
                        <h1 className="editorial-hero-title">{channel.name}</h1>
                        <p className="editorial-hero-desc">{channel.description || "Relive the golden era of animation."}</p>
                        {statsElements.length > 0 && (
                            <div className="editorial-hero-stats">
                                <span>{statsElements.join(' • ')}</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Thin bottom divider */}
                <div className="editorial-hero-divider"></div>
            </header>

            <div className="editorial-content-wrapper">

                {/* 2. Featured Spotlight Section */}
                {spotlightShow && (
                    <section className="editorial-section">
                        <div
                            className="editorial-spotlight-card"
                            onClick={() => handleShowClick(spotlightShow.slug || spotlightShow.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleShowClick(spotlightShow.slug || spotlightShow.id)}
                            tabIndex="0"
                        >
                            <img src={spotlightShow.thumbnail} alt={spotlightShow.title} className="editorial-spotlight-bg" loading="lazy" />
                            <div className="editorial-spotlight-gradient"></div>

                            <div className="editorial-spotlight-content">
                                <h2 className="editorial-spotlight-title">{spotlightShow.title}</h2>
                                <p className="editorial-spotlight-desc">
                                    {spotlightShow.synopsis || "Dive into the definitive episodes that defined a generation. Stream the classic moments now."}
                                </p>
                                <button
                                    className="editorial-primary-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowClick(spotlightShow.slug || spotlightShow.id);
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Watch Now
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. All Shows Grid (4-column) */}
                {remainingShows.length > 0 && (
                    <section className="editorial-section">
                        <div className="editorial-section-header centered">
                            <h2 className="editorial-section-title">All Shows</h2>
                        </div>
                        <div className="editorial-grid-all">
                            {remainingShows.map(show => renderShowCard(show))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default CartoonList;
