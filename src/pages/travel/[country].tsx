import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/country.module.css';
import Image from 'next/image';

// Define a TypeScript interface for the post structure
interface Post {
    date: string;
    type: 'image' | 'text';
    content?: string;
    imageUrl?: string;
}

export default function Country() {
    const router = useRouter();
    const country = router.query.country as string;
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (country) {
                try {
                    const response = await fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts/${country}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    const data: Post[] = await response.json();
                    setPosts(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchPosts();
    }, [country]);

    // Sort posts by date
    const sortedPosts = [...posts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className={styles.countryContainer}>
            <h1>{country}</h1>
            <div className={styles.timelineContainer}>
                <div className={styles.timelineLine}></div>
                {sortedPosts.map((post, index) => (
                    <div key={index} className={styles.timelineEvent}>
                        <h2>{new Date(post.date).toLocaleDateString()}</h2>
                        {post.imageUrl && (
                            <div className={styles.imageContainer}>
                                <Image
                                    src={post.imageUrl}
                                    alt="Post"
                                    layout="fill"
                                    objectFit="cover" // Adjust as needed
                                />
                            </div>
                        )}
                        <p>{post.type === 'text' ? post.content : 'Image Post'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
