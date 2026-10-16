import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    categories as initialCategories,
    cartoons as initialCartoons,
    mainChannels as initialMainChannels,
    optionalChannels as initialOptionalChannels
} from '../data/cartoonsData';

const NostalgiaContext = createContext();

export const useNostalgia = () => useContext(NostalgiaContext);

export const NostalgiaProvider = ({ children }) => {
    // skipIntroPreference: Does user want to skip the intro on future visits? (Persistent)
    const [skipIntroPreference, setSkipIntroPreference] = useState(() => {
        return localStorage.getItem('introSeen') === 'true';
    });

    // sessionIntroPassed: Has the user entered/skipped the intro in THIS browser session? (Ephemeral)
    const [sessionIntroPassed, setSessionIntroPassed] = useState(false);

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

    const addToRecentlyWatched = (showId) => {
        const watchedIds = JSON.parse(localStorage.getItem('recentlyWatchedCartoons') || '[]');
        const updatedIds = [showId, ...watchedIds.filter(id => id !== showId)].slice(0, 10);
        localStorage.setItem('recentlyWatchedCartoons', JSON.stringify(updatedIds));
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
            addToRecentlyWatched
        }}>
            {children}
        </NostalgiaContext.Provider>
    );
};
