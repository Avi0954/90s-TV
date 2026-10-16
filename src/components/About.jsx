import React from 'react';
import './StaticPages.css';

const About = () => (
    <div className="content-page">
        <div className="content-card">
            <h1 className="content-title">About the Hub</h1>
            <div className="content-section">
                <h2>Our Mission</h2>
                <p>
                    Cartoon Hub was born out of a deep love for the golden era of animation.
                    We believe that the 90s and early 2000s were a unique peak in storytelling,
                    creativity, and pure fun. Our goal is to provide a smooth, nostalgic portal
                    where you can relive those memories and share them with the next generation.
                </p>
            </div>
            <div className="content-section">
                <h2>The Experience</h2>
                <p>
                    This isn't just a video player—it's a time machine. We've designed every
                    pixel to remind you of sitting on a beanbag chair, cereal in hand, waiting
                    for your favorite show to start. No corporate noise, just cartoons.
                </p>
            </div>
            <div className="content-section">
                <h2>Nostalgia Fuel</h2>
                <p>
                    From the slapstick comedy of Dexter's Lab to the epic sagas of Dragon Ball Z,
                    we curate the titles that defined our childhoods.
                </p>
            </div>
        </div>
    </div>
);

export default About;
