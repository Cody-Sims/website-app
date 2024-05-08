import React, { useEffect, useRef } from 'react';
import styles from '../../styles/components/film.module.css'; // Assuming your CSS file is named PhotoScrapbook.css
import Image from 'next/image';
import { Stack } from '@fluentui/react';

interface Post {
    date: string;
    type: 'image' | 'text';
    content?: string;
    imageUrl?: string;
    city?: string;
}

interface FilmProps {
    posts: Post[];
}

const Film: React.FC<FilmProps> = ({ posts = []}) => {
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

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    

    const strips = window.innerWidth > 500 ? (
        <div ref={stripContainerRef} className={`${styles.photoScrapbook} ${styles.filmstrip}`}>
            {posts.map((post, index) => (
                <div key={index} className={styles.photo}>
                    {post.type === 'image' && post.imageUrl && (
                        <Image src={post.imageUrl} alt="A related caption" width={200} height={300} />
                    )}
                    <Stack horizontal className={styles.caption}>
                        <div>{post.city}</div>
                        <div>{formatDate(post.date)}</div>
                    </Stack>
                </div>
            ))}
        </div>
    ) : (
        <div ref={stripContainerRef} className={`${styles.photoScrapbook} ${styles.filmstrip}`}>
            {posts.map((post, index) => (
                <div key={index} className={styles.photo}>
                    {post.type === 'image' && post.imageUrl && (
                        <Image src={post.imageUrl} alt="A related caption" width={200} height={300} />
                    )}
                    <Stack horizontal className={styles.caption}>
                        <div>{post.city}</div>
                        <div>{formatDate(post.date)}</div>
                    </Stack>
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



export default Film;
