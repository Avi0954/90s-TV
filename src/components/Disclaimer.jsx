import React from 'react';
import './StaticPages.css';

const Disclaimer = () => (
    <div className="content-page">
        <div className="content-card">
            <h1 className="content-title">Legal Stuff</h1>
            <div className="content-section">
                <h2>Content Ownership</h2>
                <p>
                    All cartoon content, characters, music, and trademarks belong to their
                    respective owners (e.g., Cartoon Network, Disney, Nickelodeon, etc.).
                    This website does not own, claim ownership of, or host the video files.
                </p>
            </div>
            <div className="content-section">
                <h2>Embedding Source</h2>
                <p>
                    All videos are embedded directly from YouTube. We use the official YouTube iFrame
                    API to surface content that is already public. If you are a copyright owner
                    and want a video removed, please contact the original uploader on YouTube.
                </p>
            </div>
            <div className="content-section">
                <h2>Non-Commercial Use</h2>
                <p>
                    This project is strictly for nostalgic, educational, and creative purposes.
                    It is not used for commercial gain or profit.
                </p>
            </div>
        </div>
    </div>
);

export default Disclaimer;
