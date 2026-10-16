import React from 'react';
import './Skeleton.css';

export const DashboardSkeleton = () => (
    <div className="skeleton-dash-card">
        <div className="skeleton-item skeleton-dash-img"></div>
        <div className="skeleton-dash-info">
            <div className="skeleton-item skeleton-text-title"></div>
            <div className="skeleton-item skeleton-text-sub"></div>
        </div>
    </div>
);

export const ShowSkeleton = () => (
    <div className="skeleton-show-card">
        <div className="skeleton-item skeleton-show-thumb"></div>
        <div className="skeleton-show-info" style={{ padding: '1.2rem' }}>
            <div className="skeleton-item skeleton-text-title" style={{ width: '80%' }}></div>
        </div>
    </div>
);
