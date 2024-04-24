import React, { useEffect, useRef } from 'react';
import styles from '../styles/PhotoScrapbook.module.css'; // Assuming your CSS file is named PhotoScrapbook.css
import Image from 'next/image';

const photos = [
    { id: 1, url:  '/assets/times_square_2021/img1.JPG', caption: 'Photo 1' },
    { id: 2, url:  '/assets/times_square_2021/img2.JPG', caption: 'Photo 2' },
    { id: 2, url:  '/assets/times_square_2021/img2.JPG', caption: 'Photo 2' },
    { id: 2, url:  '/assets/times_square_2021/img2.JPG', caption: 'Photo 2' },
    { id: 2, url:  '/assets/times_square_2021/img2.JPG', caption: 'Photo 2' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    { id: 3, url: '/assets/times_square_2021/img3.JPG', caption: 'Photo 3' },
    // Add more photos as needed
];

const PhotoScrapbook = () => {
    const stripContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const stripContainer = stripContainerRef.current;

        if (!stripContainer) return;

        let lastTimestamp = 0;
        let scrollAmount = 0;
        const scrollSpeed = 0.05; // Adjust the scroll speed as needed
        const resetDelay = 1000; // Delay in milliseconds before resetting scroll position

        let isIntersecting = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    isIntersecting = true;
                } else {
                    isIntersecting = false;
                }
            });
        });

        observer.observe(stripContainer);

        const scroll = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            const deltaScroll = scrollSpeed * deltaTime;

            if (isIntersecting) {
                scrollAmount += deltaScroll;

                if (scrollAmount >= stripContainer.scrollWidth - stripContainer.clientWidth) {
                    // Wait for the resetDelay before resetting scrollAmount
                    setTimeout(() => {
                        scrollAmount = 0;
                    }, resetDelay);
                }

                stripContainer.scrollLeft = scrollAmount;
            }

            requestAnimationFrame(scroll);
        };

        requestAnimationFrame(scroll);

        return () => {
            observer.disconnect();
            lastTimestamp = 0;
        };
    }, []);

    const strips = window.innerWidth > 500 ? (
        <div ref={stripContainerRef} className={`${styles.photoScrapbook} ${styles.filmstrip}`}>
        {photos.map(photo => (
            <div className={styles.photo} key={photo.id}>
                <Image src={photo.url} alt={photo.caption} width={200} height={300} />
                <div className={styles.caption}>{photo.caption}</div>
            </div>
        ))}
    </div>
    ) : (
        <div className={`${styles.photoScrapbook} ${styles.filmstrip}`}>
            {photos.map(photo => (
                <div className={styles.photo} key={photo.id}>
                    <Image src={photo.url} alt={photo.caption} width={200} height={300} />
                    <div className={styles.caption}>{photo.caption}</div>
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.container}>
            {strips}
        </div>
    );
};



export default PhotoScrapbook;
