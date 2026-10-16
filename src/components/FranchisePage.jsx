import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import './FranchisePage.css';
import { ShowSkeleton } from './Skeletons';

const FranchisePage = () => {
    const { name } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFranchiseData = async () => {
            try {
                setIsLoading(true);
                const franchiseData = await api.getFranchise(name);
                setData(franchiseData);
                setError(null);
            } catch (err) {
                console.error("Franchise fetch error:", err);
                setError(err.message || "Signal Lost...");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFranchiseData();
    }, [name]);

    const handleShowClick = (showSlug) => {
        navigate(`/player/${showSlug}`);
    };

    const renderHorizontalRow = (title, shows) => {
        if (!shows || shows.length === 0) return null;

        return (
            <div className="franchise-row-section">
                <h2 className="franchise-category-title">{title}</h2>
                <div className="franchise-horizontal-scroll">
                    {shows.map((show) => (
                        <div
                            key={show._id}
                            className="franchise-show-card"
                            onClick={() => handleShowClick(show.slug)}
                            onKeyDown={(e) => e.key === 'Enter' && handleShowClick(show.slug)}
                            tabIndex="0"
                        >
                            <div className="franchise-card-thumb-container">
                                <img src={show.thumbnail} alt={show.title} className="franchise-card-thumb" loading="lazy" />
                                <div className="franchise-card-overlay">
                                    <span className="franchise-play-icon">▶</span>
                                </div>
                                <span className="franchise-card-era">{show.era}</span>
                            </div>
                            <div className="franchise-card-details">
                                <h3 className="franchise-card-title">{show.title}</h3>
                                <div className="franchise-card-meta">
                                    {show.season && show.episodeNumber ? (
                                        <span className="franchise-card-tag">S{show.season} E{show.episodeNumber}</span>
                                    ) : (
                                        <span className="franchise-card-tag">{show.category}</span>
                                    )}
                                    {show.duration && (
                                        <span className="franchise-card-tag">{show.duration}</span>
                                    )}
                                    {show.channel && (
                                        <span className="franchise-channel-tag">{show.channel.name}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="franchise-page loading">
                <div className="franchise-hero-skeleton"></div>
                <div className="franchise-content-skeleton">
                    <div className="row-skeleton"></div>
                    <div className="row-skeleton"></div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="franchise-page error">
                <header className="franchise-nav">
                    <Link to="/" className="back-link">← BACK TO HUB</Link>
                </header>
                <div className="error-message">
                    <span className="error-icon">📺</span>
                    <h2 className="pixel-text">{error || "Franchise Not Found"}</h2>
                    <p>Static on the line... we couldn't retrieve this series.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="franchise-page">
            <header className="franchise-hero" style={{ '--hero-banner': `url(${data.banner || '/placeholder-banner.jpg'})` }}>
                <div className="franchise-hero-overlay"></div>
                <div className="franchise-hero-content">
                    <Link to="/" className="back-link hero-back">← BACK TO HUB</Link>
                    <div className="franchise-branding">
                        <h1 className="franchise-main-title neon-text">{data.franchise}</h1>
                        <p className="franchise-desc">Complete Series Archives</p>
                        <div className="franchise-stats">
                            <span>{data.episodes.length} Episodes</span>
                            {data.movies.length > 0 && <span>• {data.movies.length} Movies</span>}
                            {data.songs.length > 0 && <span>• {data.songs.length} Theme Songs</span>}
                        </div>
                    </div>
                </div>
            </header>

            <main className="franchise-content">
                {renderHorizontalRow("Blockbuster Movies", data.movies)}
                {renderHorizontalRow("TV Episodes", data.episodes)}
                {renderHorizontalRow("Theme Songs & Openings", data.songs)}
                {renderHorizontalRow("Archived Specials", data.specials)}
            </main>
        </div>
    );
};

export default FranchisePage;
