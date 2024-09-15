import React, { useState, useEffect, useRef } from 'react';
import './PhotoCarousel.css'; // Ensure to create or update this CSS file

// Image imports
import articles from './articles.jpg';
import guides from './guides.jpg';
import videos from './videos.jpg';

// Array of images
const images = [
    { src: articles, name: 'Articles' },
    { src: guides, name: 'Guides' },
    { src: videos, name: 'Videos' }
];

const PHOTO_INTERVAL = 5000; // 5 seconds for image transition
const PROGRESS_UPDATE_INTERVAL = 50; // Update progress every 50ms

const PhotoCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const progressRef = useRef(null);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setProgress(0); // Reset progress when the image changes
    };

    const play = () => {
        setIsPlaying(true);
    };

    const pause = () => {
        setIsPlaying(false);
    };

    useEffect(() => {
        if (isPlaying) {
            // Clear any existing intervals
            clearInterval(intervalRef.current);
            clearInterval(progressRef.current);

            // Set the interval for changing the image
            intervalRef.current = setInterval(nextImage, PHOTO_INTERVAL);
            
            // Set the interval for updating the progress bar
            progressRef.current = setInterval(() => {
                setProgress((prev) => {
                    const progressIncrement = (100 / (PHOTO_INTERVAL / PROGRESS_UPDATE_INTERVAL));
                    return Math.min(prev + progressIncrement, 100);
                });
            }, PROGRESS_UPDATE_INTERVAL);
        } else {
            // Clear intervals when paused
            clearInterval(intervalRef.current);
            clearInterval(progressRef.current);
        }

        // Clean up intervals when the component unmounts or when play/pause changes
        return () => {
            clearInterval(intervalRef.current);
            clearInterval(progressRef.current);
        };
    }, [isPlaying]);

    return (
        <div className="photo-carousel">
            <img src={images[currentIndex].src} alt="carousel" className="carousel-image" />

            <button 
                className="control-button"
                onClick={isPlaying ? pause : play}
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? '❚❚' : '►'}
            </button>

            <div className="image-name">
                {images[currentIndex].name}
            </div>

            <div className="progress-bar-container">
                {images.map((_, index) => (
                    <div key={index} className={`progress-bar ${index === currentIndex ? 'active' : ''}`}>
                        <div 
                            className="progress-bar-background"
                            style={{ width: index === currentIndex ? `${progress}%` : '0%' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoCarousel;
