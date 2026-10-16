import React, { useState, useEffect } from 'react';
import { useNostalgia } from '../context/NostalgiaContext';
import * as api from '../services/api';
import './Admin.css';

const AdminPanel = () => {
    const {
        isAdmin, loginAdmin, logoutAdmin, adminToken
    } = useNostalgia();

    const [activeTab, setActiveTab] = useState('collection'); // 'collection' or 'channels'
    const [isLoading, setIsLoading] = useState(false);

    // Data lists from API
    const [cartoons, setCartoons] = useState([]);
    const [channels, setChannels] = useState([]);
    const [banners, setBanners] = useState([]);
    const [showSearchQuery, setShowSearchQuery] = useState('');
    const [channelSearchQuery, setChannelSearchQuery] = useState('');
    const [categories, setCategories] = useState([
        { id: 'classic', name: 'Classic' },
        { id: '90s', name: '90s' },
        { id: '2000s', name: '2000s' },
        { id: 'anime', name: 'Anime' },
        { id: 'action', name: 'Action' },
        { id: 'comedy', name: 'Comedy' }
    ]);

    // Login State
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    // --- FORM STATES ---
    const initialFormState = {
        _id: null,
        title: '',
        slug: '',
        category: 'classic',
        channel: '',
        era: '90s',
        thumbnail: '',
        videoUrl: '',
        description: '',
        franchise: '',
        category: 'episode',
        isFeatured: false,
        isActive: true
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    const initialChannelForm = {
        _id: null,
        name: '',
        slug: '',
        description: '',
        logo: '',
        themeColor: '#ffffff',
        accentColor: 'white',
        isActive: true
    };
    const [channelFormData, setChannelFormData] = useState(initialChannelForm);
    const [isEditingChannel, setIsEditingChannel] = useState(false);

    // --- BANNER FORM STATES ---
    const initialBannerForm = {
        _id: null,
        show: '',
        bannerImage: '',
        tagline: '',
        ctaText: 'Watch Now',
        isActive: false,
        order: 0
    };
    const [bannerFormData, setBannerFormData] = useState(initialBannerForm);
    const [isEditingBanner, setIsEditingBanner] = useState(false);

    // Fetch data when admin is logged in
    useEffect(() => {
        if (isAdmin) {
            refreshData();
        }
    }, [isAdmin, activeTab]);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const [showsData, channelsData, bannersData] = await Promise.all([
                api.adminGetShows(),
                api.adminGetChannels(),
                api.adminGetBanners()
            ]);
            setCartoons(showsData);
            setChannels(channelsData);
            setBanners(bannersData);
        } catch (err) {
            console.error("Failed to fetch admin data:", err);
            if (err.message.includes('401')) {
                logoutAdmin();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // Backend expects 'email' and 'password'
            const response = await api.login(loginData.username, loginData.password);
            loginAdmin(response.token);
        } catch (err) {
            setError(err.message || 'Login failed. Check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- SHOW HANDLERS ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditing) {
                await api.adminUpdateShow(formData._id, formData);
                alert('Show updated successfully!');
            } else {
                await api.adminCreateShow(formData);
                alert('Show created successfully!');
            }
            setFormData(initialFormState);
            setIsEditing(false);
            refreshData();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditShow = (show) => {
        setFormData({
            ...initialFormState,
            ...show,
            channel: show.channel?._id || show.channel // Handle populated or ID
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteShow = async (id) => {
        if (window.confirm('Are you sure you want to delete this show?')) {
            setIsLoading(true);
            try {
                await api.adminDeleteShow(id);
                refreshData();
            } catch (err) {
                alert(`Delete failed: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // --- CHANNEL HANDLERS ---
    const handleChannelSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditingChannel) {
                await api.adminUpdateChannel(channelFormData._id, channelFormData);
                alert('Channel updated!');
            } else {
                await api.adminCreateChannel(channelFormData);
                alert('Channel created!');
            }
            setChannelFormData(initialChannelForm);
            setIsEditingChannel(false);
            refreshData();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditChannel = (ch) => {
        setChannelFormData({ ...initialChannelForm, ...ch });
        setIsEditingChannel(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteChannel = async (id) => {
        if (window.confirm('Delete this channel? This might affect existing shows.')) {
            setIsLoading(true);
            try {
                await api.adminDeleteChannel(id);
                refreshData();
            } catch (err) {
                alert(`Delete failed: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // --- BANNER HANDLERS ---
    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditingBanner) {
                await api.adminUpdateBanner(bannerFormData._id, bannerFormData);
                alert('Banner updated!');
            } else {
                await api.adminCreateBanner(bannerFormData);
                alert('Banner created!');
            }
            setBannerFormData(initialBannerForm);
            setIsEditingBanner(false);
            refreshData();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditBanner = (bn) => {
        setBannerFormData({ ...initialBannerForm, ...bn, show: bn.show?._id || bn.show });
        setIsEditingBanner(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteBanner = async (id) => {
        if (window.confirm('Delete this banner?')) {
            setIsLoading(true);
            try {
                await api.adminDeleteBanner(id);
                refreshData();
            } catch (err) {
                alert(`Delete failed: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { // Increased limit to 1MB
                alert('File too large. Max size is 1MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'show') {
                    setFormData({ ...formData, thumbnail: reader.result });
                } else if (type === 'banner') {
                    setBannerFormData({ ...bannerFormData, bannerImage: reader.result });
                } else {
                    setChannelFormData({ ...channelFormData, logo: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const generateSlug = (text) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    // --- VIEW: LOGIN ---
    if (!isAdmin) {
        return (
            <div className="login-wrap">
                <div className="login-card">
                    <h1 className="pixel-text" style={{ color: 'var(--accent-color)', marginBottom: '2rem' }}>ADMIN PORTAL</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Email"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            className="admin-input"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            required
                        />
                        {error && <p style={{ color: 'var(--retro-red, #ff4444)', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
                        <button
                            className="retro-button"
                            style={{ width: '100%', background: 'var(--accent-color)' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'AUTHENTICATING...' : 'ENTER SYSTEM'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.7rem', opacity: 0.5, textAlign: 'center' }}>
                        Secured with JWT 🔐
                    </p>
                </div>
            </div>
        );
    }

    // --- VIEW: DASHBOARD ---
    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="header-top">
                    <h1 className="pixel-text" style={{ color: 'var(--accent-color)' }}>SYSTEM CONTROL</h1>
                    <button onClick={logoutAdmin} className="btn-admin btn-secondary">LOGOUT</button>
                </div>

                <nav className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'collection' ? 'active' : ''}`}
                        onClick={() => setActiveTab('collection')}
                    >COLLECTION</button>
                    <button
                        className={`tab-btn ${activeTab === 'channels' ? 'active' : ''}`}
                        onClick={() => setActiveTab('channels')}
                    >CHANNELS</button>
                    <button
                        className={`tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
                        onClick={() => setActiveTab('banners')}
                    >HERO BANNERS</button>
                </nav>
            </header>

            <div className="admin-stats">
                <div className="stat-box">
                    <span className="stat-number">{cartoons.length}</span>
                    <span className="pixel-text" style={{ fontSize: '0.6rem' }}>TOTAL CARTOONS</span>
                </div>
                <div className="stat-box" style={{ borderColor: 'var(--accent-color)' }}>
                    <span className="stat-number">{channels.length}</span>
                    <span className="pixel-text" style={{ fontSize: '0.6rem' }}>CHANNELS SIGNAL</span>
                </div>
                {isLoading && (
                    <div className="stat-box" style={{ borderStyle: 'dotted' }}>
                        <span className="pixel-text" style={{ fontSize: '0.6rem' }}>SYNCING...</span>
                    </div>
                )}
            </div>

            {activeTab === 'collection' && (
                <div className="admin-content-layout">
                    {/* SHOW FORM */}
                    <div className="admin-form-card">
                        <h2 className="pixel-text" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
                            {isEditing ? 'EDITING CARTOON' : 'ADD NEW CARTOON'}
                        </h2>

                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>TITLE</label>
                                <input
                                    className="form-input"
                                    value={formData.title} required
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        setFormData({
                                            ...formData,
                                            title: newTitle,
                                            slug: isEditing ? formData.slug : generateSlug(newTitle)
                                        });
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label>SLUG (URL Unique ID)</label>
                                <input
                                    className="form-input"
                                    value={formData.slug} required
                                    onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>CHANNEL</label>
                                    <select
                                        className="form-select"
                                        value={formData.channel}
                                        onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Channel</option>
                                        {channels.map(ch => (
                                            <option key={ch._id} value={ch._id}>{ch.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label>ERA</label>
                                    <select
                                        className="form-select"
                                        value={formData.era}
                                        onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                                    >
                                        <option value="90s">90s</option>
                                        <option value="Early 2000s">Early 2000s</option>
                                        <option value="2000s">2000s</option>
                                        <option value="2010s">2010s</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>CATEGORY / GENRE</label>
                                <select
                                    className="form-select"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>FRANCHISE (Collection Name)</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. Doraemon, Pokemon"
                                        value={formData.franchise || ''}
                                        onChange={(e) => setFormData({ ...formData, franchise: e.target.value })}
                                    />
                                </div>
                                <div className="form-group half">
                                    <label>CATEGORY / TYPE</label>
                                    <select
                                        className="form-select"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="episode">Episode</option>
                                        <option value="movie">Movie</option>
                                        <option value="song">Song / Opening</option>
                                        <option value="special">Special</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    />
                                    <span>FEATURE ON DASHBOARD</span>
                                </label>
                            </div>

                            <div className="form-group">
                                <label>THUMBNAIL</label>
                                <div className="upload-options">
                                    <input
                                        className="form-input"
                                        placeholder="Enter Image URL..."
                                        value={formData.thumbnail}
                                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <div className="file-upload-wrapper">
                                        <label className="file-upload-btn">
                                            📁 UPLOAD IMAGE
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'show')}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                {formData.thumbnail && (
                                    <div className="preview-container">
                                        <img src={formData.thumbnail} className="img-preview" alt="Preview" />
                                        <button
                                            type="button"
                                            className="clear-img-btn"
                                            onClick={() => setFormData({ ...formData, thumbnail: '' })}
                                        >× REMOVE IMAGE</button>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>YOUTUBE URL (Any YouTube Link)</label>
                                <input
                                    className="form-input"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={formData.videoUrl} required
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                />
                                <small style={{ opacity: 0.6 }}>Backend will auto-convert to embed URL</small>
                            </div>

                            <div className="form-group">
                                <label>DESCRIPTION</label>
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button className="btn-admin btn-primary" style={{ flex: 1 }} disabled={isLoading}>
                                    {isEditing ? 'UPDATE' : 'ADD CARTOON'}
                                </button>
                                {isEditing && (
                                    <button type="button" className="btn-admin btn-secondary" onClick={() => { setFormData(initialFormState); setIsEditing(false); }}>CANCEL</button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="admin-list">
                        <div className="list-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="pixel-text" style={{ fontSize: '0.8rem', margin: 0 }}>MANAGE COLLECTION</h2>
                            <div className="admin-search-box">
                                <input
                                    type="text"
                                    placeholder="SEARCH SHOWS..."
                                    className="admin-input search-input"
                                    value={showSearchQuery}
                                    onChange={(e) => setShowSearchQuery(e.target.value)}
                                    style={{ margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                                />
                            </div>
                        </div>

                        {cartoons.length === 0 && <p style={{ opacity: 0.5 }}>No shows found in database.</p>}
                        {cartoons
                            .filter(c => c.title.toLowerCase().includes(showSearchQuery.toLowerCase()))
                            .map(cartoon => (
                                <div key={cartoon._id} className="admin-item-card">
                                    <div className="item-meta">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {cartoon.isFeatured && <span className="featured-badge">⭐</span>}
                                            <h4>{cartoon.title}</h4>
                                        </div>
                                        <span style={{ fontSize: '0.7rem' }}>
                                            {cartoon.channel?.name || 'Unknown Channel'} • {cartoon.era}
                                        </span>
                                    </div>
                                    <div className="admin-actions">
                                        <button className="btn-admin btn-secondary" onClick={() => handleEditShow(cartoon)}>EDIT</button>
                                        <button className="btn-admin btn-danger" onClick={() => handleDeleteShow(cartoon._id)}>DELETE</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {activeTab === 'channels' && (
                <div className="admin-content-layout">
                    {/* CHANNEL FORM */}
                    <div className="admin-form-card">
                        <h2 className="pixel-text" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
                            {isEditingChannel ? 'EDITING CHANNEL' : 'ADD NEW CHANNEL'}
                        </h2>

                        <form onSubmit={handleChannelSubmit}>
                            <div className="form-group">
                                <label>CHANNEL NAME</label>
                                <input
                                    className="form-input"
                                    value={channelFormData.name} required
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setChannelFormData({
                                            ...channelFormData,
                                            name,
                                            slug: isEditingChannel ? channelFormData.slug : generateSlug(name)
                                        });
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label>SLUG (URL ID)</label>
                                <input
                                    className="form-input"
                                    value={channelFormData.slug} required
                                    disabled={isEditingChannel}
                                    placeholder="e.g. animax"
                                    onChange={(e) => setChannelFormData({ ...channelFormData, slug: generateSlug(e.target.value) })}
                                />
                            </div>

                            <div className="form-group">
                                <label>THEME COLOR (Hex)</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="color"
                                        className="form-input color-input"
                                        style={{ width: '60px', padding: '2px' }}
                                        value={channelFormData.themeColor}
                                        onChange={(e) => setChannelFormData({ ...channelFormData, themeColor: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={channelFormData.themeColor}
                                        onChange={(e) => setChannelFormData({ ...channelFormData, themeColor: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>CHANNEL LOGO</label>
                                <div className="upload-options">
                                    <input
                                        className="form-input"
                                        placeholder="Enter Logo URL..."
                                        value={channelFormData.logo}
                                        onChange={(e) => setChannelFormData({ ...channelFormData, logo: e.target.value })}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <div className="file-upload-wrapper">
                                        <label className="file-upload-btn">
                                            📁 UPLOAD LOGO
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'channel')}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                {channelFormData.logo && (
                                    <div className="preview-container logo-preview">
                                        <img src={channelFormData.logo} className="img-preview" alt="Preview" style={{ objectFit: 'contain', background: '#111' }} />
                                        <button
                                            type="button"
                                            className="clear-img-btn"
                                            onClick={() => setChannelFormData({ ...channelFormData, logo: '' })}
                                        >× REMOVE LOGO</button>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>DESCRIPTION / TAGLINE</label>
                                <input
                                    className="form-input"
                                    value={channelFormData.description}
                                    placeholder="e.g. World of Action Heroes"
                                    onChange={(e) => setChannelFormData({ ...channelFormData, description: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button className="btn-admin btn-primary" style={{ flex: 1 }} disabled={isLoading}>
                                    {isEditingChannel ? 'UPDATE CHANNEL' : 'ADD CHANNEL'}
                                </button>
                                {isEditingChannel && (
                                    <button type="button" className="btn-admin btn-secondary" onClick={() => { setChannelFormData(initialChannelForm); setIsEditingChannel(false); }}>CANCEL</button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="admin-list">
                        <div className="list-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="pixel-text" style={{ fontSize: '0.8rem', margin: 0 }}>EXISTING CHANNELS</h2>
                            <div className="admin-search-box">
                                <input
                                    type="text"
                                    placeholder="SEARCH CHANNELS..."
                                    className="admin-input search-input"
                                    value={channelSearchQuery}
                                    onChange={(e) => setChannelSearchQuery(e.target.value)}
                                    style={{ margin: 0, padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                                />
                            </div>
                        </div>

                        {channels.length === 0 && <p style={{ opacity: 0.5 }}>No channels found in database.</p>}
                        {channels
                            .filter(ch => ch.name.toLowerCase().includes(channelSearchQuery.toLowerCase()))
                            .map(ch => (
                                <div key={ch._id} className="admin-item-card">
                                    <div className="item-meta">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="mini-logo-placeholder" style={{ background: ch.themeColor }}>
                                                {ch.logo && <img src={ch.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                                            </div>
                                            <h4>{ch.name}</h4>
                                        </div>
                                        <span style={{ fontSize: '0.7rem' }}>{ch.slug}</span>
                                    </div>
                                    <div className="admin-actions">
                                        <button className="btn-admin btn-secondary" onClick={() => handleEditChannel(ch)}>EDIT</button>
                                        <button className="btn-admin btn-danger" onClick={() => handleDeleteChannel(ch._id)}>DELETE</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {activeTab === 'banners' && (
                <div className="admin-content-layout">
                    {/* BANNER FORM */}
                    <div className="admin-form-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="pixel-text" style={{ fontSize: '0.8rem', margin: 0, color: 'var(--accent-color)' }}>
                                {isEditingBanner ? 'EDITING BANNER' : 'ADD NEW BANNER'}
                            </h2>
                        </div>

                        <form onSubmit={handleBannerSubmit}>
                            <div className="form-group">
                                <label>LINKED SHOW</label>
                                <select
                                    className="form-select"
                                    value={bannerFormData.show}
                                    onChange={(e) => setBannerFormData({ ...bannerFormData, show: e.target.value })}
                                    required
                                >
                                    <option value="">Select Show</option>
                                    {Object.entries(
                                        cartoons.reduce((acc, show) => {
                                            const channelName = show.channel?.name || 'Unknown Channel';
                                            if (!acc[channelName]) acc[channelName] = [];
                                            acc[channelName].push(show);
                                            return acc;
                                        }, {})
                                    ).map(([channelName, channelShows]) => (
                                        <optgroup key={channelName} label={channelName}>
                                            {channelShows.map(show => (
                                                <option key={show._id} value={show._id}>{show.title}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>TAGLINE</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. Relive the golden era of cartoons"
                                    value={bannerFormData.tagline} required
                                    onChange={(e) => setBannerFormData({ ...bannerFormData, tagline: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>CALL TO ACTION TEXT</label>
                                    <input
                                        className="form-input"
                                        placeholder="Watch Now"
                                        value={bannerFormData.ctaText}
                                        onChange={(e) => setBannerFormData({ ...bannerFormData, ctaText: e.target.value })}
                                    />
                                </div>
                                <div className="form-group half">
                                    <label>ORDER NUMBER</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={bannerFormData.order}
                                        onChange={(e) => setBannerFormData({ ...bannerFormData, order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={bannerFormData.isActive}
                                        onChange={(e) => setBannerFormData({ ...bannerFormData, isActive: e.target.checked })}
                                    />
                                    <span>MARK AS ACTIVE (AUTO-ROTATING)</span>
                                </label>
                            </div>

                            <div className="form-group">
                                <label>BANNER IMAGE</label>
                                <div className="upload-options">
                                    <input
                                        className="form-input"
                                        placeholder="Enter Image URL..."
                                        value={bannerFormData.bannerImage}
                                        onChange={(e) => setBannerFormData({ ...bannerFormData, bannerImage: e.target.value })}
                                        style={{ marginBottom: '0.5rem' }}
                                        required
                                    />
                                    <div className="file-upload-wrapper">
                                        <label className="file-upload-btn">
                                            📁 UPLOAD IMAGE
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'banner')}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                {bannerFormData.bannerImage && (
                                    <div className="preview-container">
                                        <img src={bannerFormData.bannerImage} className="img-preview" alt="Preview" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            className="clear-img-btn"
                                            onClick={() => setBannerFormData({ ...bannerFormData, bannerImage: '' })}
                                        >× REMOVE IMAGE</button>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button className="btn-admin btn-primary" style={{ flex: 1 }} disabled={isLoading}>
                                    {isEditingBanner ? 'UPDATE BANNER' : 'SAVE BANNER'}
                                </button>
                                {isEditingBanner && (
                                    <button type="button" className="btn-admin btn-secondary" onClick={() => { setBannerFormData(initialBannerForm); setIsEditingBanner(false); }}>CANCEL</button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="admin-list">
                        <div className="list-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="pixel-text" style={{ fontSize: '0.8rem', margin: 0 }}>HERO BANNER MANAGEMENT</h2>
                            <button className="btn-admin btn-primary" onClick={() => { setBannerFormData(initialBannerForm); setIsEditingBanner(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>+ ADD NEW BANNER</button>
                        </div>

                        {banners.length === 0 && <p style={{ opacity: 0.5 }}>No banners found in database.</p>}
                        {banners.map(bn => (
                            <div key={bn._id} className="admin-item-card" style={{ borderLeft: bn.isActive ? '4px solid var(--accent-color)' : 'none' }}>
                                <div className="item-meta" style={{ display: 'flex', gap: '15px' }}>
                                    {bn.bannerImage && (
                                        <div style={{ width: '80px', height: '45px', borderRadius: '4px', overflow: 'hidden' }}>
                                            <img src={bn.bannerImage} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {bn.isActive && <span className="featured-badge" style={{ background: 'var(--accent-color)', color: '#000' }}>ACTIVE</span>}
                                            <h4>{bn.show?.title || 'Unknown Show'}</h4>
                                        </div>
                                        <span style={{ fontSize: '0.7rem' }}>
                                            Order: {bn.order} • {bn.tagline}
                                        </span>
                                    </div>
                                </div>
                                <div className="admin-actions">
                                    <button className="btn-admin btn-secondary" onClick={() => handleEditBanner(bn)}>EDIT</button>
                                    <button className="btn-admin btn-danger" onClick={() => handleDeleteBanner(bn._id)}>DELETE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-container {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .btn-danger {
                    background: #ff4444;
                    color: white;
                }
                .btn-danger:hover {
                    background: #cc0000;
                }
                .stat-number {
                    font-size: 2rem;
                    font-weight: bold;
                    display: block;
                    color: var(--accent-color);
                }
                .mini-logo-placeholder {
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .form-group small {
                    display: block;
                    margin-top: 0.25rem;
                    color: var(--accent-color);
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;
