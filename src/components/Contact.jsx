import React from 'react';
import './StaticPages.css';

const Contact = () => (
    <div className="content-page">
        <div className="content-card" style={{ textAlign: 'center' }}>
            <h1 className="content-title">Get in Touch</h1>
            <div className="content-section">
                <p>
                    Got a nostalgic suggestion? Found a broken signal? Or just want to
                    talk about your favorite anime arc?
                </p>
                <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: 'var(--retro-blue)' }}>
                    <strong>hello@cartoonhub.vibe</strong>
                </p>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', marginTop: '1rem' }}>
                    (This is a placeholder — we're busy watching cartoons right now!)
                </p>
            </div>
            <a href="mailto:hello@cartoonhub.vibe" className="contact-button">
                SEND A MESSAGE
            </a>
        </div>
    </div>
);

export default Contact;
