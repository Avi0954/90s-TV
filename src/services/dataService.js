/**
 * Data Service
 * Provides helper functions to fetch and filter channels and shows.
 * Standardized across 'Cartoon' / 'IndianTV' and legacy 'Main' / 'Optional'.
 */

export const getChannels = (channels) => {
    return channels || [];
};

export const getMainChannels = (channels) => {
    return (channels || []).filter(ch => {
        const type = String(ch.type || '').toLowerCase();
        return type === 'cartoon' || type === 'main' || type === '';
    });
};

export const getOptionalChannels = (channels) => {
    return (channels || []).filter(ch => {
        const type = String(ch.type || '').toLowerCase();
        return type === 'indiantv' || type === 'optional';
    });
};

export const getShowsByChannel = (cartoons, channelId) => {
    return (cartoons || []).filter(show => {
        const showChId = show.channel?._id || show.channel || show.channelId;
        return String(showChId) === String(channelId);
    });
};

export const getFeaturedShows = (cartoons) => {
    return (cartoons || []).filter(show => show.isFeatured || show.featured);
};

export const getShowById = (cartoons, showId) => {
    if (!showId) return null;
    return (cartoons || []).find(show =>
        show._id === showId ||
        show.slug === showId ||
        show.id === showId ||
        String(show._id) === String(showId)
    );
};

export const getChannelById = (channels, channelId) => {
    if (!channelId) return null;
    return (channels || []).find(ch =>
        ch._id === channelId ||
        ch.slug === channelId ||
        ch.id === channelId ||
        String(ch._id) === String(channelId)
    );
};
