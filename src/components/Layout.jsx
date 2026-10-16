import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNostalgia } from "../context/NostalgiaContext";

const OfflineBanner = () => (
  <div className="offline-banner" aria-live="polite">
    <div className="offline-content">
      <span className="offline-icon">📺💨</span>
      <div className="offline-text">
        <p className="pixel-text">SIGNAL LOST!</p>
        <p>The TV cable is unplugged. Check your connection.</p>
      </div>
    </div>
  </div>
);

import "./Navbar.css";
import "./Footer.css";
import * as api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const { isAdmin, logoutAdmin, toggleTheme, theme } = useNostalgia();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dmcaOpen, setDmcaOpen] = useState(false);
  const [retroMode, setRetroMode] = useState(false);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [allShows, setAllShows] = useState([]);
  const [channels, setChannels] = useState([]);
  const searchRef = React.useRef(null);

  // Debounce search input (200ms) to avoid unnecessary recalculations
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(trimmed);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (retroMode) {
      document.body.classList.add("retro-mode");
    } else {
      document.body.classList.remove("retro-mode");
    }
  }, [retroMode]);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [showsData, channelsData] = await Promise.all([
          api.getAllShows(),
          api.getChannels(),
        ]);
        setAllShows(showsData);
        setChannels(channelsData);
      } catch (err) {
        console.error("Search data fetch error:", err);
      }
    };
    fetchSearchData();
  }, []);

  // Scroll Lock Effect
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open-lock");
      document.documentElement.classList.add("menu-open-lock");
    } else {
      document.body.classList.remove("menu-open-lock");
      document.documentElement.classList.remove("menu-open-lock");
    }

    // Cleanup when component unmounts while menu is open
    return () => {
      document.body.classList.remove("menu-open-lock");
      document.documentElement.classList.remove("menu-open-lock");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        if (window.innerWidth <= 1024) setIsMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleShuffle = () => {
    if (allShows.length > 0) {
      const randomIndex = Math.floor(Math.random() * allShows.length);
      navigate(`/player/${allShows[randomIndex].slug}`);
    }
  };

  const q = debouncedQuery.toLowerCase();

  const filteredShows =
    q.length > 0
      ? allShows
        .filter((s) =>
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.franchise && s.franchise.toLowerCase().includes(q)) ||
          (s.genre && s.genre.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q))
        )
        .slice(0, 8)
      : [];

  const filteredChannels =
    q.length > 0
      ? channels.filter((c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.slug && c.slug.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      ).slice(0, 4)
      : [];

  const matchedFranchises =
    q.length > 0
      ? [...new Set(allShows.map((s) => s.franchise).filter(Boolean))]
        .filter((f) => f.toLowerCase().includes(q))
        .slice(0, 4)
      : [];

  const matchedGenres =
    q.length > 0
      ? [...new Set(allShows.map((s) => s.genre).filter(Boolean))]
        .filter((g) => g.toLowerCase().includes(q))
        .slice(0, 4)
      : [];

  return (
    <div className="layout-container">
      {retroMode && (
        <>
          <div className="crt-overlay" style={{ display: "block" }}></div>
          <div className="vhs-grain" style={{ display: "block" }}></div>
        </>
      )}

      {!isOnline && <OfflineBanner />}

      <nav className={`nav-container ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="nav-top-bar">
          <Link
            to="/"
            className="nav-brand"
            onClick={() => setIsMenuOpen(false)}
          >
            <h2 className="nav-logo">
              <span className="logo-icon">📺</span>
              <span className="logo-text">CartoonHub</span>
            </h2>
          </Link>

          <div className="mobile-toggle-wrapper">
            <button
              className={`mobile-menu-toggle ${isMenuOpen ? "menu-open" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className="nav-backdrop active"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        <div className={`nav-responsive-content ${isMenuOpen ? "active" : ""}`}>
          {/* User Section */}
          <div className="mobile-user-section">
            <div className="mobile-user-avatar">{isAdmin ? "🛡️" : "👾"}</div>
            <div className="mobile-user-info">
              <span className="mobile-username">
                {isAdmin ? "Admin" : "Nostalgic Viewer"}
              </span>
              <span className="mobile-user-sub">View Profile</span>
            </div>
            <button
              className="mobile-close-btn"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="nav-search-wrapper" ref={searchRef}>
            <div className="search-bar-container">
              <input
                type="text"
                className="search-input active"
                placeholder="Search cartoons, characters, channels..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setIsSearchOpen(true);
                  if (val.trim()) {
                    setIsSearching(true);
                  } else {
                    setDebouncedQuery("");
                    setIsSearching(false);
                  }
                }}
              />
            </div>

            {isSearchOpen && searchQuery.length > 0 && (
              <div className="search-results-dropdown">
                {isSearching && (
                  <div className="search-status" style={{ padding: "1rem", color: "var(--text-muted)" }}>
                    Tuning signal frequency...
                  </div>
                )}

                {!isSearching &&
                  filteredShows.length === 0 &&
                  filteredChannels.length === 0 &&
                  matchedFranchises.length === 0 &&
                  matchedGenres.length === 0 && (
                    <div
                      className="no-results"
                      style={{ padding: "1rem", color: "var(--text-muted)" }}
                    >
                      No signals found for "{debouncedQuery || searchQuery}"
                    </div>
                  )}

                {matchedFranchises.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-label">Franchises</div>
                    {matchedFranchises.map((f) => (
                      <Link
                        to={`/franchise/${f}`}
                        key={f}
                        className="search-result-item"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setIsMenuOpen(false);
                        }}
                      >
                        <div className="result-info">
                          <span className="result-title">{f} Series</span>
                          <span className="result-meta">Complete Franchise Collection</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {matchedGenres.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-label">Genre</div>
                    {matchedGenres.map((g) => (
                      <div
                        key={g}
                        className="search-result-item"
                        onClick={() => {
                          setSearchQuery(g);
                        }}
                      >
                        <div className="result-info">
                          <span className="result-title">Category: {g}</span>
                          <span className="result-meta">Browse all {g} animations</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredChannels.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-label">Channels</div>
                    {filteredChannels.map((c) => (
                      <Link
                        to={`/channel/${c.slug}`}
                        key={c.slug}
                        className="search-result-item"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setIsMenuOpen(false);
                        }}
                      >
                        <img src={c.logo} alt="" className="result-thumb" onError={(e) => { e.target.style.display = 'none'; }} />
                        <div className="result-info">
                          <span className="result-title">{c.name}</span>
                          <span className="result-meta">
                            {c.tagline || c.type || "Broadcast Network"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {filteredShows.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-label">Shows & Episodes</div>
                    {filteredShows.map((s) => (
                      <Link
                        to={`/player/${s.slug}`}
                        key={s.slug}
                        className="search-result-item"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setIsMenuOpen(false);
                        }}
                      >
                        <img
                          src={s.thumbnail}
                          alt=""
                          className="result-thumb"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                        />
                        <div className="result-info">
                          <span className="result-title">{s.title}</span>
                          <span className="result-meta">
                            {s.era} • {s.genre || s.category}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mobile-nav-scroll">
            {/* Main Navigation */}
            <div className="mobile-nav-group">
              <Link
                to="/"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">🏠</span> Home
              </Link>
              <Link
                to="/"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">📺</span> Channels
              </Link>
              <Link
                to="/franchise/Doraemon"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">📼</span> Series Hub
              </Link>
              <Link
                to="/"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">🔥</span> Trending
              </Link>
            </div>

            <div className="mobile-nav-divider"></div>

            {/* Content Discovery */}
            <div className="mobile-nav-group">
              <div className="mobile-nav-label">DISCOVER</div>
              <Link
                to="/dashboard"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">📼</span> 90s Cartoons
              </Link>
              <Link
                to="/dashboard"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">💿</span> 2000s Cartoons
              </Link>
              <Link
                to="/dashboard"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">🎌</span> Anime
              </Link>
              <Link
                to="/dashboard"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">😂</span> Comedy
              </Link>
              <Link
                to="/dashboard"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">💥</span> Action
              </Link>
            </div>

            <div className="mobile-nav-divider"></div>

            {/* Utility Actions */}
            <div className="mobile-nav-group">
              <div className="mobile-nav-label">UTILITIES</div>
              <button
                className="mobile-nav-link"
                onClick={() => {
                  setIsMenuOpen(false);
                  searchRef.current?.querySelector("input")?.focus();
                }}
              >
                <span className="mobile-nav-icon">🔍</span> Search
              </button>
              <button
                className="mobile-nav-link"
                onClick={() => {
                  handleShuffle();
                  setIsMenuOpen(false);
                }}
              >
                <span className="mobile-nav-icon">🎲</span> Shuffle Cartoons
              </button>
              <button
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">▶️</span> Continue Watching
              </button>
            </div>

            <div className="mobile-nav-divider"></div>

            {/* Settings */}
            <div className="mobile-nav-group">
              <div className="mobile-nav-label">SETTINGS</div>
              <button
                className="mobile-nav-link"
                onClick={() => {
                  toggleTheme && toggleTheme();
                  setIsMenuOpen(false);
                }}
              >
                <span className="mobile-nav-icon">
                  {theme === "theme-morning" ? "🌙" : "☀️"}
                </span>{" "}
                Theme: {theme === "theme-morning" ? "Dark" : "Light"}
              </button>
              <button
                className="mobile-nav-link"
                onClick={() => setRetroMode(!retroMode)}
              >
                <span className="mobile-nav-icon">📺</span> Retro Mode:{" "}
                {retroMode ? "On" : "Off"}
              </button>
              <Link
                to="/contact"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">⚙️</span> Account Settings
              </Link>
              <Link
                to="/contact"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">❓</span> Help / Support
              </Link>
            </div>

            {isAdmin && (
              <>
                <div className="mobile-nav-divider"></div>
                <div className="mobile-nav-group">
                  <div className="mobile-nav-label">ADMINISTRATION</div>
                  <Link
                    to="/admin"
                    className="mobile-nav-link admin-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">🛡️</span> Admin Dashboard
                  </Link>
                </div>
              </>
            )}

            <div className="mobile-nav-spacer"></div>
          </div>

          <div className="mobile-nav-footer">
            <span className="mobile-nav-version">CartoonHub v1.0.0</span>
            {isAdmin ? (
              <button
                className="mobile-logout-btn"
                onClick={() => {
                  logoutAdmin();
                  setIsMenuOpen(false);
                }}
              >
                <span className="mobile-nav-icon">🚪</span> Logout
              </button>
            ) : (
              <button
                className="mobile-logout-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mobile-nav-icon">🚪</span> Logout
              </button>
            )}
          </div>

          <div className="desktop-nav-actions" style={{ display: "none" }}>
            <nav className="desktop-nav-links">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/"
                className={`nav-link ${location.pathname.includes('/player') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shows
              </Link>
              <Link
                to="/"
                className={`nav-link ${location.pathname.includes('/channel') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Channels
              </Link>
              <Link
                to="/franchise/Doraemon"
                className={`nav-link ${location.pathname.includes('/franchise') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Series Hub
              </Link>
            </nav>
            <div className="nav-controls">
              <button
                className="nav-shuffle"
                onClick={handleShuffle}
                title="Play Random Episode"
              >
                🎲
              </button>
              <button
                className="nav-shuffle"
                onClick={() => setRetroMode(!retroMode)}
                title="Toggle Retro Filters"
              >
                {retroMode ? "📺" : "✨"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main
        style={{
          padding: "0",
          minHeight: "calc(100vh - 160px)",
          position: "relative",
          marginTop: "70px",
        }}
      >
        <div key={window.location.pathname} className="page-fade-enter">
          {children}
        </div>
      </main>

      <footer className="retro-footer">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <h2 className="footer-logo">📺 CartoonHub</h2>
            <p className="footer-tagline">
              Reliving Cartoons, Channels & Childhood Memories. Your portal to
              the golden era.
            </p>
          </div>

          <div className="footer-col">
            <h3>QUICK LINKS</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Channels</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>POPULAR SERIES</h3>
            <ul>
              <li>
                <Link to="/franchise/Doraemon">Doraemon</Link>
              </li>
              <li>
                <Link to="/franchise/Pokémon">Pokémon</Link>
              </li>
              <li>
                <Link to="/franchise/Dragon Ball">Dragon Ball</Link>
              </li>
              <li>
                <Link to="/franchise/Shinchan">Shinchan</Link>
              </li>
              <li>
                <Link to="/franchise/Ben 10">Ben 10</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>LEGAL</h3>
            <ul>
              <li>
                <Link to="/disclaimer">Disclaimer</Link>
              </li>
              <li>
                <Link to="/contact">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/contact">Terms of Use</Link>
              </li>
              <li>
                <div className="footer-dmca-section">
                  <button
                    className="dmca-trigger"
                    onClick={() => setDmcaOpen(!dmcaOpen)}
                  >
                    {dmcaOpen ? "CLOSE DMCA" : "DMCA NOTICE"}
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {dmcaOpen && (
          <div className="dmca-content">
            <p>
              <strong>DMCA Notice:</strong> Cartoon Hub does not host or upload
              any video files. All content provided on this website is embedded
              from third-party platforms that are publicly accessible (e.g.
              YouTube).
            </p>
            <p>
              We respect the intellectual property rights of others. If you
              believe that any content available on this site infringes your
              copyright, please contact us with:
            </p>
            <ul style={{ paddingLeft: "1.2rem", margin: "1rem 0" }}>
              <li>Your name and contact information</li>
              <li>The copyrighted work claimed to be infringed</li>
              <li>The URL of the allegedly infringing content</li>
            </ul>
            <p>
              Upon receiving a valid notice, we will take appropriate action
              promptly.
            </p>
          </div>
        )}

        <div className="footer-bottom">
          <p className="copyright-text">
            © 2026 Cartoon Hub • <Link to="/contact">Privacy</Link> •{" "}
            <Link to="/disclaimer">DMCA</Link> •{" "}
            <Link to="/admin" className="footer-admin-link">
              Admin
            </Link>
          </p>
          <p className="footer-note">
            All trademarks and copyrights belong to their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
