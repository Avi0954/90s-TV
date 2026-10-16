import { useRef, useCallback } from 'react';

const SOUNDS = {
    tick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft tick
    click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Mechanical click
    vhs: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Tape click
    shuffle: 'https://www.soundjay.com/buttons/button-20.mp3' // Channel switch
};

export const useSound = () => {
    const audioRefs = useRef({});

    const play = useCallback((soundKey, volume = 0.1) => {
        try {
            if (!audioRefs.current[soundKey]) {
                audioRefs.current[soundKey] = new Audio(SOUNDS[soundKey]);
            }

            const audio = audioRefs.current[soundKey];
            audio.volume = volume;
            audio.currentTime = 0;

            // Respect browser policy - play only on user interaction
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Silently fail if browser blocks autoplay/sound
                    console.debug('Audio play blocked:', error);
                });
            }
        } catch (e) {
            console.error('Error playing sound:', e);
        }
    }, []);

    // Debounced tick for hovers
    const lastTick = useRef(0);
    const playTick = useCallback(() => {
        const now = Date.now();
        if (now - lastTick.current > 150) {
            play('tick', 0.05);
            lastTick.current = now;
        }
    }, [play]);

    return { play, playTick };
};
