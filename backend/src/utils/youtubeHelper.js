/**
 * Converts a YouTube link to an embed URL.
 * 
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/v/VIDEO_ID
 * 
 * Returns unchanged if:
 * - Already an embed URL (youtube.com/embed/ID)
 * - Direct mp4 file
 * - Not a recognized YouTube URL
 * 
 * @param {string} url - The YouTube URL to convert.
 * @returns {string} - The converted embed URL.
 */
const convertToEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return url;

    const trimmedUrl = url.trim();

    // 1. Check if already an embed URL or an mp4 file
    if (trimmedUrl.includes('youtube.com/embed/') || trimmedUrl.toLowerCase().endsWith('.mp4')) {
        return trimmedUrl;
    }

    // 2. Regular expression to extract the video ID from various YouTube URL formats
    // Matches:
    // - youtube.com/watch?v=ID
    // - youtu.be/ID
    // - youtube.com/v/ID
    // - m.youtube.com/watch?v=ID
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = trimmedUrl.match(regex);

    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    return trimmedUrl;
};

module.exports = { convertToEmbedUrl };
