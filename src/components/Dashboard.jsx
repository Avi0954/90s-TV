import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import * as storage from '../services/storageService';
import { useNostalgia } from '../context/NostalgiaContext';
import './Dashboard.css';
import { DashboardSkeleton } from './Skeletons';

const ContentRow = ({
    title,
    subtitle,
    items,
    isChannel = false,
    showProgress = false,
    onRemove = null,
    focusedIndex,
    startIndex
}) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="content-row-section">
            <div className="row-header">
                <h2 className="row-title">{title}</h2>
                {subtitle && <p className="row-subtitle">{subtitle}</p>}
            </div>
            <div className="row-container">
                {items.map((item, index) => {
                    const globalIndex = startIndex + index;
                    const isFocused = focusedIndex === globalIndex;

                    if (isChannel) {
                        return (
                            <Link
                                to={`/channel/${item.slug}`}
                                key={item._id || item.slug}
                                id={`card-${globalIndex}`}
                                className={`channel-card ${isFocused ? 'keyboard-focused' : ''}`}
                                style={{ '--accent-color': item.themeColor || 'var(--accent-color)' }}
                            >
                                <div className="channel-logo-wrapper">
                                    <img
                                        src={item.logo}
                                        alt={item.name}
                                        className="channel-logo"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                <h3 className="channel-name">{item.name}</h3>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            to={`/player/${item.slug}`}
                            key={item._id || item.slug}
                            id={`card-${globalIndex}`}
                            className={`show-card ${isFocused ? 'keyboard-focused' : ''}`}
                        >
                            <div className="show-thumb-wrapper">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="show-thumb"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                                />
                                {showProgress && item.progressPercent > 0 && (
                                    <div className="card-progress-track">
                                        <div
                                            className="card-progress-bar"
                                            style={{ width: `${Math.min(100, Math.max(5, item.progressPercent))}%` }}
                                        />
                                    </div>
                                )}
                                {onRemove && (
                                    <button
                                        type="button"
                                        className="card-remove-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onRemove(item.slug);
                                        }}
                                        title="Remove from list"
                                        aria-label={`Remove ${item.title}`}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <div className="show-info">
                                <h3 className="show-title">{item.title}</h3>
                                <span className="show-meta">
                                    {item.era} • {item.channel?.name || item.genre || 'Cartoon'}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { watchlist, toggleWatchlist } = useNostalgia();

    const [channels, setChannels] = useState({ cartoons: [], indianTV: [] });
    const [featuredCartoon, setFeaturedCartoon] = useState(null);
    const [fetchedBanners, setFetchedBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isHeroHovered, setIsHeroHovered] = useState(false);

    // Dynamic user sections
    const [continueWatching, setContinueWatching] = useState([]);
    const [watchlistShows, setWatchlistShows] = useState([]);
    const [recentlyWatched, setRecentlyWatched] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const [trendingShows, setTrendingShows] = useState([]);
    const [ninetiesClassics, setNinetiesClassics] = useState([]);
    const [thousandsCartoons, setThousandsCartoons] = useState([]);
    const [recommendedShows, setRecommendedShows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [channelsData, featuredData, allShowsData, bannerData] = await Promise.all([
                    api.getChannels(),
                    api.getFeaturedShows(),
                    api.getAllShows(),
                    api.getActiveHeroBanner().catch(() => null)
                ]);

                const cartoonList = channelsData.filter(ch => ch.type === 'Cartoon' || !ch.type);
                const indianTVList = channelsData.filter(ch => ch.type === 'IndianTV');

                const customOrder = ['cn', 'nick', 'disney', 'jetix', 'sonic', 'toonami', 'animax', 'boomerang'];
                const sortedCartoons = [...cartoonList].sort((a, b) => {
                    const indexA = customOrder.indexOf(a.slug);
                    const indexB = customOrder.indexOf(b.slug);
                    const posA = indexA === -1 ? 99 : indexA;
                    const posB = indexB === -1 ? 99 : indexB;
                    return posA - posB;
                });

                setChannels({ cartoons: sortedCartoons, indianTV: indianTVList });

                const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());
                setTrendingShows(shuffle(allShowsData).slice(0, 10));
                setRecommendedShows(shuffle(allShowsData).slice(0, 10));
                setNinetiesClassics(allShowsData.filter(s => s.era === '90s'));
                setThousandsCartoons(allShowsData.filter(s => s.era === '2000s'));

                if (featuredData && featuredData.length > 0) {
                    const randomIndex = Math.floor(Math.random() * featuredData.length);
                    setFeaturedCartoon(featuredData[randomIndex]);
                }

                if (bannerData) {
                    const bannersArray = Array.isArray(bannerData) ? bannerData : [bannerData];
                    setFetchedBanners(bannersArray);
                }

                // 1. Process Continue Watching (Progress between 2% and 95%)
                const history = storage.getWatchHistory();
                const inProgressHistory = history.filter(h => h.progressPercent >= 2 && h.progressPercent < 95);
                if (inProgressHistory.length > 0) {
                    const inProgressSlugs = inProgressHistory.map(h => h.slug);
                    const fetched = await api.getShowsBySlugs(inProgressSlugs);
                    const enriched = inProgressHistory
                        .map(h => {
                            const found = fetched.find(s => s.slug === h.slug);
                            if (!found) return null;
                            return {
                                ...found,
                                progressPercent: h.progressPercent,
                                progressSeconds: h.progressSeconds
                            };
                        })
                        .filter(Boolean);
                    setContinueWatching(enriched);
                } else {
                    setContinueWatching([]);
                }

                // 2. Process Recently Watched (All recently watched shows)
                const recentSlugs = storage.getRecentlyWatchedSlugs();
                if (recentSlugs.length > 0) {
                    const fetchedRecent = await api.getShowsBySlugs(recentSlugs);
                    const orderedRecent = recentSlugs
                        .map(slug => fetchedRecent.find(s => s.slug === slug))
                        .filter(Boolean);
                    setRecentlyWatched(orderedRecent);
                } else {
                    setRecentlyWatched([]);
                }

                setError(null);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Signal Lost: Could not connect to the station.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Sync Watchlist shows dynamically when watchlist changes
    useEffect(() => {
        const fetchWatchlistShows = async () => {
            if (!watchlist || watchlist.length === 0) {
                setWatchlistShows([]);
                return;
            }
            try {
                const shows = await api.getShowsBySlugs(watchlist);
                const ordered = watchlist
                    .map(slug => shows.find(s => s.slug === slug))
                    .filter(Boolean);
                setWatchlistShows(ordered);
            } catch (err) {
                console.error("Error fetching watchlist shows:", err);
            }
        };

        fetchWatchlistShows();
    }, [watchlist]);

    const handleRemoveFromWatchlist = (slug) => {
        if (toggleWatchlist) toggleWatchlist(slug);
        setWatchlistShows(prev => prev.filter(s => s.slug !== slug));
    };

    // Auto-rotation effect for hero banners
    useEffect(() => {
        if (fetchedBanners.length <= 1 || isHeroHovered) return;

        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % fetchedBanners.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [fetchedBanners.length, isHeroHovered]);

    // Preload next image for smooth banner transitions
    useEffect(() => {
        if (fetchedBanners.length > 1) {
            const nextIdx = (currentBannerIndex + 1) % fetchedBanners.length;
            const img = new Image();
            img.src = fetchedBanners[nextIdx].bannerImage;
        }
    }, [currentBannerIndex, fetchedBanners]);

    const activeBanner = fetchedBanners[currentBannerIndex] || null;

    // Keyboard navigation across all active rows
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
            if (isLoading) return;

            const items = [
                ...continueWatching,
                ...watchlistShows,
                ...recentlyWatched,
                ...trendingShows,
                ...ninetiesClassics,
                ...thousandsCartoons,
                ...(channels.cartoons || []),
                ...(channels.indianTV || []),
                ...recommendedShows
            ];

            if (!items.length) return;

            let nextIndex = focusedIndex;

            if (e.key === 'ArrowRight') nextIndex = Math.min(items.length - 1, focusedIndex + 1);
            if (e.key === 'ArrowLeft') nextIndex = Math.max(0, focusedIndex - 1);
            if (e.key === 'ArrowDown') nextIndex = Math.min(items.length - 1, focusedIndex + 4);
            if (e.key === 'ArrowUp') nextIndex = Math.max(0, focusedIndex - 4);

            if (e.key === 'Enter') {
                if (focusedIndex !== -1 && items[focusedIndex]) {
                    const item = items[focusedIndex];
                    if (item.type === 'Cartoon' || item.type === 'IndianTV' || item.logo) {
                        navigate(`/channel/${item.slug}`);
                    } else {
                        navigate(`/player/${item.slug}`);
                    }
                }
            }

            if (nextIndex !== focusedIndex && nextIndex >= 0 && nextIndex < items.length) {
                e.preventDefault();
                setFocusedIndex(nextIndex);
                document.getElementById(`card-${nextIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedIndex, continueWatching, watchlistShows, recentlyWatched, trendingShows, ninetiesClassics, thousandsCartoons, channels, recommendedShows, isLoading, navigate]);

    if (error) {
        return (
            <div className="dashboard-container error-state">
                <div className="error-box">
                    <span className="error-icon">📡💨</span>
                    <h2 className="pixel-text">{error}</h2>
                    <button className="retro-button" onClick={() => window.location.reload()}>RETRY SIGNAL</button>
                </div>
            </div>
        );
    }

    // Dynamic start offsets for keyboard navigation
    let offset = 0;
    const continueStartIndex = offset;
    offset += continueWatching.length;

    const watchlistStartIndex = offset;
    offset += watchlistShows.length;

    const recentStartIndex = offset;
    offset += recentlyWatched.length;

    const trendingStartIndex = offset;
    offset += trendingShows.length;

    const ninetiesStartIndex = offset;
    offset += ninetiesClassics.length;

    const thousandsStartIndex = offset;
    offset += thousandsCartoons.length;

    const channelStartIndex = offset;
    offset += (channels.cartoons.length + channels.indianTV.length);

    const recommendedStartIndex = offset;

    return (
        <div className="dashboard-container">
            {isLoading ? (
                <div className="dashboard-content" style={{ padding: '2rem 40px' }}>
                    {Array(3).fill(0).map((_, i) => <DashboardSkeleton key={i} />)}
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    {(activeBanner || featuredCartoon) && (
                        <section
                            className="hero-section hero-banner-fade-in"
                            key={activeBanner ? activeBanner._id : (featuredCartoon?.slug || 'hero')}
                            onMouseEnter={() => setIsHeroHovered(true)}
                            onMouseLeave={() => setIsHeroHovered(false)}
                            style={{
                                backgroundImage: `linear-gradient(to bottom, rgba(15, 17, 21, 0) 60%, rgba(15, 17, 21, 1) 100%), linear-gradient(to right, rgba(18, 20, 24, 0.95) 0%, rgba(18, 20, 24, 0.4) 50%, rgba(18, 20, 24, 0) 100%), url(${activeBanner ? activeBanner.bannerImage : featuredCartoon.thumbnail})`
                            }}
                        >
                            <div className="hero-content">
                                <span className="hero-badge">
                                    {activeBanner ? 'FEATURED SHOW' : (featuredCartoon?.channel?.name || 'Featured')}
                                </span>

                                <h1 className="hero-title">
                                    {activeBanner ? activeBanner.show?.title : featuredCartoon?.title}
                                </h1>

                                <p className="hero-desc">
                                    {activeBanner ? activeBanner.tagline : featuredCartoon?.description}
                                </p>

                                <div className="hero-actions">
                                    <Link
                                        to={`/player/${activeBanner ? activeBanner.show?.slug : featuredCartoon?.slug}`}
                                        className="hero-button primary"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        {activeBanner ? (activeBanner.ctaText || 'Watch Now') : 'Watch Now'}
                                    </Link>
                                </div>
                            </div>

                            {/* Navigation Dots */}
                            {fetchedBanners.length > 1 && (
                                <div className="hero-nav-dots" style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '0',
                                    right: '0',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    zIndex: 2
                                }}>
                                    {fetchedBanners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentBannerIndex(idx);
                                            }}
                                            aria-label={`Go to banner ${idx + 1}`}
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                background: currentBannerIndex === idx ? 'var(--text-color)' : 'rgba(255, 255, 255, 0.4)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                padding: 0,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {fetchedBanners.length > 1 && (
                                <>
                                    <button
                                        className="hero-arrow-btn prev"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentBannerIndex((prev) => (prev - 1 + fetchedBanners.length) % fetchedBanners.length);
                                        }}
                                        aria-label="Previous banner"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                    </button>
                                    <button
                                        className="hero-arrow-btn next"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentBannerIndex((prev) => (prev + 1) % fetchedBanners.length);
                                        }}
                                        aria-label="Next banner"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </button>
                                </>
                            )}
                        </section>
                    )}

                    <div className="dashboard-content">
                        {/* Continue Watching Section */}
                        {continueWatching.length > 0 && (
                            <ContentRow
                                title="Continue Watching"
                                subtitle="Pick up where you left off"
                                items={continueWatching}
                                showProgress={true}
                                focusedIndex={focusedIndex}
                                startIndex={continueStartIndex}
                            />
                        )}

                        {/* My Watchlist Section */}
                        {watchlistShows.length > 0 && (
                            <ContentRow
                                title="My Watchlist"
                                subtitle="Shows saved for later"
                                items={watchlistShows}
                                onRemove={handleRemoveFromWatchlist}
                                focusedIndex={focusedIndex}
                                startIndex={watchlistStartIndex}
                            />
                        )}

                        {/* Recently Watched Section */}
                        {recentlyWatched.length > 0 && (
                            <ContentRow
                                title="Recently Watched"
                                subtitle="Your recent broadcasts"
                                items={recentlyWatched}
                                focusedIndex={focusedIndex}
                                startIndex={recentStartIndex}
                            />
                        )}

                        {/* Trending Now */}
                        <ContentRow
                            title="Trending Now"
                            items={trendingShows}
                            focusedIndex={focusedIndex}
                            startIndex={trendingStartIndex}
                        />

                        {/* 90s Classics */}
                        <ContentRow
                            title="90s Classics"
                            items={ninetiesClassics}
                            focusedIndex={focusedIndex}
                            startIndex={ninetiesStartIndex}
                        />

                        {/* 2000s Cartoons */}
                        <ContentRow
                            title="2000s Cartoons"
                            items={thousandsCartoons}
                            focusedIndex={focusedIndex}
                            startIndex={thousandsStartIndex}
                        />

                        {/* Channels */}
                        <ContentRow
                            title="Channels"
                            subtitle="Relive your favorite cartoon networks"
                            items={[...channels.cartoons, ...channels.indianTV]}
                            isChannel={true}
                            focusedIndex={focusedIndex}
                            startIndex={channelStartIndex}
                        />

                        {/* Recommended For You */}
                        <ContentRow
                            title="Recommended For You"
                            items={recommendedShows}
                            focusedIndex={focusedIndex}
                            startIndex={recommendedStartIndex}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
