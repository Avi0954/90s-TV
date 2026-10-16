/**
 * Local Storage Service for Guest Users
 * Manages:
 * - Watch History & Playback Progress (Continue Watching)
 * - User Watchlist
 * - Safe limits, backward-compatibility with legacy keys, and modular architecture.
 */

const WATCH_HISTORY_KEY = 'cartoonhub_watch_history';
const WATCHLIST_KEY = 'cartoonhub_watchlist';
const MAX_HISTORY_ITEMS = 40;
const MAX_WATCHLIST_ITEMS = 60;

// Safe parsing helper
const safeParse = (key, fallback = []) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Failed to read from localStorage key "${key}":`, e);
        return fallback;
    }
};

const safeSave = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Failed to write to localStorage key "${key}":`, e);
    }
};

/**
 * ----------------------------------------------------
 * WATCH HISTORY & PLAYBACK PROGRESS
 * ----------------------------------------------------
 */

export const getWatchHistory = () => {
    let history = safeParse(WATCH_HISTORY_KEY, null);

    // Backward compatibility: Migrate legacy watched lists if present
    if (!history) {
        const legacySlugs = [
            ...safeParse('recentlyWatchedShows', []),
            ...safeParse('recentlyWatchedCartoons', [])
        ];
        const uniqueLegacy = [...new Set(legacySlugs)];
        history = uniqueLegacy.map((slug, idx) => ({
            slug,
            progressSeconds: 0,
            durationSeconds: 1320, // default ~22 mins
            progressPercent: 0,
            lastWatched: Date.now() - idx * 60000
        }));
        safeSave(WATCH_HISTORY_KEY, history);
    }

    return Array.isArray(history) ? history : [];
};

export const saveWatchProgress = (slug, progressSeconds = 0, durationSeconds = 1320, metadata = {}) => {
    if (!slug) return;

    const history = getWatchHistory();
    const existingIndex = history.findIndex((h) => h.slug === slug);

    const safeDuration = Number(durationSeconds) > 0 ? Number(durationSeconds) : 1320;
    const safeProgress = Math.max(0, Number(progressSeconds) || 0);
    const progressPercent = Math.min(100, Math.round((safeProgress / safeDuration) * 100));

    const updatedItem = {
        slug,
        progressSeconds: safeProgress,
        durationSeconds: safeDuration,
        progressPercent,
        lastWatched: Date.now(),
        ...metadata
    };

    if (existingIndex >= 0) {
        history[existingIndex] = { ...history[existingIndex], ...updatedItem };
    } else {
        history.unshift(updatedItem);
    }

    // Sort by last watched descending and enforce size limit
    const trimmed = history
        .sort((a, b) => b.lastWatched - a.lastWatched)
        .slice(0, MAX_HISTORY_ITEMS);

    safeSave(WATCH_HISTORY_KEY, trimmed);

    // Keep legacy array in sync for any components referencing it
    safeSave('recentlyWatchedShows', trimmed.map((item) => item.slug));
};

export const getShowProgress = (slug) => {
    if (!slug) return null;
    const history = getWatchHistory();
    return history.find((h) => h.slug === slug) || null;
};

export const getContinueWatchingSlugs = () => {
    const history = getWatchHistory();
    // Continue watching: started (> 10s or > 2%) and not finished (< 95%)
    return history
        .filter((h) => h.progressPercent >= 2 && h.progressPercent < 95)
        .map((h) => h.slug);
};

export const getRecentlyWatchedSlugs = () => {
    const history = getWatchHistory();
    return history.map((h) => h.slug);
};

export const clearWatchHistory = () => {
    safeSave(WATCH_HISTORY_KEY, []);
    safeSave('recentlyWatchedShows', []);
    safeSave('recentlyWatchedCartoons', []);
};

/**
 * ----------------------------------------------------
 * WATCHLIST MANAGEMENT
 * ----------------------------------------------------
 */

export const getWatchlist = () => {
    return safeParse(WATCHLIST_KEY, []);
};

export const addToWatchlist = (slug) => {
    if (!slug) return false;
    const list = getWatchlist();
    if (!list.includes(slug)) {
        const updated = [slug, ...list].slice(0, MAX_WATCHLIST_ITEMS);
        safeSave(WATCHLIST_KEY, updated);
        return true;
    }
    return false;
};

export const removeFromWatchlist = (slug) => {
    if (!slug) return false;
    const list = getWatchlist();
    const updated = list.filter((item) => item !== slug);
    safeSave(WATCHLIST_KEY, updated);
    return true;
};

export const isInWatchlist = (slug) => {
    if (!slug) return false;
    const list = getWatchlist();
    return list.includes(slug);
};
