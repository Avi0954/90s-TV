/**
 * Data Service
 * Provides helper functions to fetch and filter data from the global state.
 */

export const getChannels = (channels) => {
    return channels || [];
};

export const getMainChannels = (channels) => {
    return (channels || []).filter(ch => {
        const type = String(ch.type || '').toLowerCase();
        return type === 'main' || type === '';
    });
};

export const getOptionalChannels = (channels) => {
    return (channels || []).filter(ch => {
        const type = String(ch.type || '').toLowerCase();
        return type === 'optional';
    });
};

export const getShowsByChannel = (cartoons, channelId) => {
    return (cartoons || []).filter(show => show.channelId === channelId);
};

export const getFeaturedShows = (cartoons) => {
    return (cartoons || []).filter(show => show.featured);
};

export const getShowById = (cartoons, showId) => {
    if (!showId) return null;
    return (cartoons || []).find(show =>
        show.id === showId ||
        String(show.id) === String(showId)
    );
};

export const getChannelById = (channels, channelId) => {
    if (!channelId) return null;
    return (channels || []).find(ch =>
        ch.id === channelId ||
        String(ch.id) === String(channelId)
    );
};
