const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    return response.json();
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('nostalgia_admin_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// --- PUBLIC API ---

export const getChannels = async () => {
    const response = await fetch(`${API_BASE_URL}/api/channels`);
    return handleResponse(response);
};

export const getChannelBySlug = async (slug) => {
    const response = await fetch(`${API_BASE_URL}/api/channels/${slug}`);
    return handleResponse(response);
};

export const getAllShows = async () => {
    const response = await fetch(`${API_BASE_URL}/api/shows`);
    return handleResponse(response);
};

export const getShowsBySlugs = async (slugs) => {
    const response = await fetch(`${API_BASE_URL}/api/shows?slugs=${slugs.join(',')}`);
    return handleResponse(response);
};

export const getShowsByChannel = async (channelSlug) => {
    const response = await fetch(`${API_BASE_URL}/api/shows/channel/${channelSlug}`);
    return handleResponse(response);
};

export const getShowBySlug = async (slug) => {
    const response = await fetch(`${API_BASE_URL}/api/shows/${slug}`);
    return handleResponse(response);
};

export const getFeaturedShows = async () => {
    const response = await fetch(`${API_BASE_URL}/api/shows/featured`);
    return handleResponse(response);
};

export const getFranchise = async (name) => {
    const response = await fetch(`${API_BASE_URL}/api/franchise/${encodeURIComponent(name)}`);
    return handleResponse(response);
};

export const getActiveHeroBanner = async () => {
    const response = await fetch(`${API_BASE_URL}/api/hero-banner/active`);
    return handleResponse(response);
};

// --- ADMIN AUTH API ---

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
};

// --- ADMIN SHOWS API ---

export const adminGetShows = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/shows`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const adminCreateShow = async (showData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/shows`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(showData)
    });
    return handleResponse(response);
};

export const adminUpdateShow = async (id, showData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/shows/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(showData)
    });
    return handleResponse(response);
};

export const adminDeleteShow = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/shows/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

// --- ADMIN CHANNELS API ---

export const adminGetChannels = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/channels`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const adminCreateChannel = async (channelData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/channels`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(channelData)
    });
    return handleResponse(response);
};

export const adminUpdateChannel = async (id, channelData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/channels/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(channelData)
    });
    return handleResponse(response);
};

export const adminDeleteChannel = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/channels/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

// --- ADMIN BANNERS API ---

export const adminGetBanners = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/banners`, {
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};

export const adminCreateBanner = async (bannerData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/banners`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bannerData)
    });
    return handleResponse(response);
};

export const adminUpdateBanner = async (id, bannerData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(bannerData)
    });
    return handleResponse(response);
};

export const adminDeleteBanner = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};
