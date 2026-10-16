/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../services/storageService';

const NostalgiaContext = createContext();

export const useNostalgia = () => useContext(NostalgiaContext);

export const NostalgiaProvider = ({ children }) => {
    // skipIntroPreference: Does user want to skip the intro on future visits? (Persistent)
    const [skipIntroPreference, setSkipIntroPreference] = useState(() => {
        return localStorage.getItem('introSeen') === 'true';
    });

    // sessionIntroPassed: Has the user entered/skipped the intro in THIS browser session? (Ephemeral)
    const [sessionIntroPassed, setSessionIntroPassed] = useState(false);

    // Watchlist state
    const [watchlist, setWatchlist] = useState(() => storage.getWatchlist());

    const toggleWatchlist = useCallback((slug) => {
        if (!slug) return;
        setWatchlist((prev) => {
            if (prev.includes(slug)) {
                storage.removeFromWatchlist(slug);
                return prev.filter((item) => item !== slug);
            } else {
                storage.addToWatchlist(slug);
                return [slug, ...prev];
            }
        });
    }, []);

    const isWatchlisted = useCallback((slug) => {
        return watchlist.includes(slug);
    }, [watchlist]);

    // Admin persistence
    const [isAdmin, setIsAdmin] = useState(() => {
        return !!localStorage.getItem('nostalgia_admin_token');
    });
    const [adminToken, setAdminToken] = useState(() => {
        return localStorage.getItem('nostalgia_admin_token');
    });

    const logoutAdmin = () => {
        setIsAdmin(false);
        setAdminToken(null);
        localStorage.removeItem('nostalgia_admin_token');
    };

    const loginAdmin = (token) => {
        setIsAdmin(true);
        setAdminToken(token);
        localStorage.setItem('nostalgia_admin_token', token);
    };

    // Theme state
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('nostalgia_theme') || 'theme-evening';
    });

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('nostalgia_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'theme-evening' ? 'theme-morning' : 'theme-evening');
    };

    const completeIntro = (dontShowAgain) => {
        setSessionIntroPassed(true);
        if (dontShowAgain) {
            setSkipIntroPreference(true);
            localStorage.setItem('introSeen', 'true');
        }
    };

    const resetIntroPreference = () => {
        setSkipIntroPreference(false);
        localStorage.removeItem('introSeen');
    };

    const addToRecentlyWatched = (showSlug) => {
        storage.saveWatchProgress(showSlug, 0, 1320);
    };

    return (
        <NostalgiaContext.Provider value={{
            skipIntroPreference,
            sessionIntroPassed,
            completeIntro,
            resetIntroPreference,
            isAdmin,
            adminToken,
            loginAdmin,
            logoutAdmin,
            theme,
            toggleTheme,
            addToRecentlyWatched,
            watchlist,
            toggleWatchlist,
            isWatchlisted,
            saveWatchProgress: storage.saveWatchProgress,
            getShowProgress: storage.getShowProgress,
            getContinueWatchingSlugs: storage.getContinueWatchingSlugs,
            getRecentlyWatchedSlugs: storage.getRecentlyWatchedSlugs
        }}>
            {children}
        </NostalgiaContext.Provider>
    );
};
