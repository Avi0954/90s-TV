import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './Dashboard.css';
import { DashboardSkeleton } from './Skeletons';

const ContentRow = ({ title, subtitle, items, isChannel = false, focusedIndex, startIndex }) => {
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
                                key={item._id}
                                id={`card-${globalIndex}`}
                                className={`channel-card ${isFocused ? 'keyboard-focused' : ''}`}
                                style={{ '--accent-color': item.themeColor || 'var(--accent-color)' }}
                            >
                                <div className="channel-logo-wrapper">
                                    <img src={item.logo} alt={item.name} className="channel-logo" onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                                <h3 className="channel-name">{item.name}</h3>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            to={`/player/${item.slug}`}
                            key={item._id}
                            id={`card-${globalIndex}`}
                            className={`show-card ${isFocused ? 'keyboard-focused' : ''}`}
                        >
                            <div className="show-thumb-wrapper">
                                <img src={item.thumbnail} alt={item.title} className="show-thumb" />
                            </div>
                            <div className="show-info">
                                <h3 className="show-title">{item.title}</h3>
                                <span className="show-meta">{item.era} • {item.channel?.name || 'Cartoon'}</span>
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
    const [channels, setChannels] = useState({ cartoons: [], indianTV: [] });
    const [featuredCartoon, setFeaturedCartoon] = useState(null);
    const [fetchedBanners, setFetchedBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isHeroHovered, setIsHeroHovered] = useState(false);
    const [recentlyWatched, setRecentlyWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [allShows, setAllShows] = useState([]);
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
                setAllShows(allShowsData);

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

                const watchedSlugs = JSON.parse(localStorage.getItem('recentlyWatchedShows') || localStorage.getItem('recentlyWatchedCartoons') || '[]');
                if (watchedSlugs.length > 0) {
                    const watchedShows = await api.getShowsBySlugs(watchedSlugs);
                    const orderedWatched = watchedSlugs
                        .map(slug => watchedShows.find(s => s.slug === slug))
                        .filter(Boolean);
                    setRecentlyWatched(orderedWatched);
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

    useEffect(() => {
        if (searchQuery.length > 0 && allShows.length === 0) {
            api.getAllShows().then(setAllShows);
        }
    }, [searchQuery, allShows.length]);

    // Auto-rotation effect
    useEffect(() => {
        if (fetchedBanners.length <= 1 || isHeroHovered) return;

        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % fetchedBanners.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [fetchedBanners.length, isHeroHovered]);

    // Preload next image for smooth transitions
    useEffect(() => {
        if (fetchedBanners.length > 1) {
            const nextIdx = (currentBannerIndex + 1) % fetchedBanners.length;
            const img = new Image();
            img.src = fetchedBanners[nextIdx].bannerImage;
        }
    }, [currentBannerIndex, fetchedBanners]);

    const activeBanner = fetchedBanners[currentBannerIndex] || null;

    const handleRandom = () => {
        const shows = isSearching ? filteredShows : allShows;
        if (shows.length > 0) {
            const randomIndex = Math.floor(Math.random() * shows.length);
            navigate(`/player/${shows[randomIndex].slug}`);
        } else if (featuredCartoon) {
            navigate(`/player/${featuredCartoon.slug}`);
        }
    };

    const matchedFranchises = searchQuery.length > 0
        ? [...new Set(allShows.map(s => s.franchise).filter(Boolean))]
            .filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const filteredShows = allShows.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isSearching = searchQuery.length > 0;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement.tagName === 'INPUT') return;
            if (isLoading) return;

            // Simplified linear navigation for keyboard accessibility
            const getFlattenedItems = () => {
                if (isSearching) return filteredShows;
                return [
                    ...recentlyWatched,
                    ...trendingShows,
                    ...ninetiesClassics,
                    ...thousandsCartoons,
                    ...(channels.cartoons || []),
                    ...(channels.indianTV || []),
                    ...recommendedShows
                ];
            };

            const items = getFlattenedItems();
            if (!items.length) return;

            let nextIndex = focusedIndex;

            if (e.key === 'ArrowRight') nextIndex = Math.min(items.length - 1, focusedIndex + 1);
            if (e.key === 'ArrowLeft') nextIndex = Math.max(0, focusedIndex - 1);
            if (e.key === 'ArrowDown') nextIndex = Math.min(items.length - 1, focusedIndex + 4);
            if (e.key === 'ArrowUp') nextIndex = Math.max(0, focusedIndex - 4);

            if (e.key === 'Enter') {
                if (focusedIndex !== -1) {
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
    }, [focusedIndex, isSearching, filteredShows, channels, recentlyWatched, isLoading, navigate]);

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

    // Calculating start indices for the flattened array
    const searchStartIndex = 0;

    let currentIndexOffset = 0;
    const recentStartIndex = currentIndexOffset;
    currentIndexOffset += recentlyWatched.length;

    const trendingStartIndex = currentIndexOffset;
    currentIndexOffset += trendingShows.length;

    const ninetiesStartIndex = currentIndexOffset;
    currentIndexOffset += ninetiesClassics.length;

    const thousandsStartIndex = currentIndexOffset;
    currentIndexOffset += thousandsCartoons.length;

    const cartoonStartIndex = currentIndexOffset;
    currentIndexOffset += channels.cartoons.length;

    const indianTvStartIndex = currentIndexOffset;
    currentIndexOffset += channels.indianTV.length;

    const recommendedStartIndex = currentIndexOffset;

    return (
        <div className="dashboard-container">
            {isLoading ? (
                <div className="dashboard-content" style={{ padding: '2rem 40px' }}>
                    {Array(3).fill(0).map((_, i) => <DashboardSkeleton key={i} />)}
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    {!isSearching && (activeBanner || featuredCartoon) && (
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

                            <style>{`
                                @keyframes fadeIn {
                                    from { opacity: 0; }
                                    to { opacity: 1; }
                                }
                                .hero-nav-dots button:hover {
                                    background: rgba(255, 255, 255, 0.9) !important;
                                    transform: scale(1.2);
                                }
                                .hero-arrow-btn {
                                    position: absolute;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    background: rgba(0, 0, 0, 0.4);
                                    color: white;
                                    border: none;
                                    width: 48px;
                                    height: 48px;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: pointer;
                                    z-index: 3;
                                    transition: all 0.3s ease;
                                    opacity: 0;
                                    backdrop-filter: blur(4px);
                                }
                                .hero-section:hover .hero-arrow-btn {
                                    opacity: 1;
                                }
                                .hero-arrow-btn:hover {
                                    background: rgba(0, 0, 0, 0.8) !important;
                                    transform: translateY(-50%) scale(1.1);
                                }
                                .hero-arrow-btn.prev {
                                    left: 20px;
                                }
                                .hero-arrow-btn.next {
                                    right: 20px;
                                }
                                .hero-arrow-btn svg {
                                    width: 24px;
                                    height: 24px;
                                }
                            `}</style>
                        </section>
                    )}

                    <div className="dashboard-content">
                        {isSearching ? (
                            <div className="search-results-section">
                                {matchedFranchises.length > 0 && (
                                    <div className="franchise-results-section" style={{ marginBottom: '3rem' }}>
                                        <h2 className="row-title">Series Hubs</h2>
                                        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                            {matchedFranchises.map((fName, idx) => (
                                                <Link to={`/franchise/${fName}`} key={idx} style={{ textDecoration: 'none' }}>
                                                    <div className="franchise-result-card">
                                                        <div className="franchise-result-icon">🎞️</div>
                                                        <div className="franchise-result-info">
                                                            <h3 className="franchise-result-name">{fName}</h3>
                                                            <span className="franchise-result-link">Enter Series Hub →</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <ContentRow
                                    title={`Found ${filteredShows.length} results for "${searchQuery}"`}
                                    items={filteredShows}
                                    focusedIndex={focusedIndex}
                                    startIndex={searchStartIndex}
                                />
                            </div>
                        ) : (
                            <>
                                <ContentRow
                                    title="Continue Watching"
                                    items={recentlyWatched}
                                    focusedIndex={focusedIndex}
                                    startIndex={recentStartIndex}
                                />

                                <ContentRow
                                    title="Trending Now"
                                    items={trendingShows}
                                    focusedIndex={focusedIndex}
                                    startIndex={trendingStartIndex}
                                />

                                <ContentRow
                                    title="90s Classics"
                                    items={ninetiesClassics}
                                    focusedIndex={focusedIndex}
                                    startIndex={ninetiesStartIndex}
                                />

                                <ContentRow
                                    title="2000s Cartoons"
                                    items={thousandsCartoons}
                                    focusedIndex={focusedIndex}
                                    startIndex={thousandsStartIndex}
                                />

                                <ContentRow
                                    title="Channels"
                                    subtitle="Relive your favorite cartoon networks"
                                    items={[...channels.cartoons, ...channels.indianTV]}
                                    isChannel={true}
                                    focusedIndex={focusedIndex}
                                    startIndex={cartoonStartIndex}
                                />

                                <ContentRow
                                    title="Recommended For You"
                                    items={recommendedShows}
                                    focusedIndex={focusedIndex}
                                    startIndex={recommendedStartIndex}
                                />
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
