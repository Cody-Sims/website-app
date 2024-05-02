import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/country.module.css';
import Image from 'next/image';
import Film from '@/components/scrapbook/film';

// Define a TypeScript interface for the post structure
interface Post {
    date: string;
    type: 'image' | 'text';
    content?: string;
    imageUrl?: string;
    manuelCity?: string;
}

export default function Country() {
    const router = useRouter();
    const country = router.query.country as string;
    const [posts, setPosts] = useState<Post[]>([]);
    const [imagePosts, setImagePosts] = useState<Post[]>([]);

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

    useEffect(() => {
        const fetchImagePosts = async () => {
            if (country) {
                try {
                    const response = await fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts/${country}/images`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    const data: Post[] = await response.json();
                    setImagePosts(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };
        fetchImagePosts();
    }, [country]);

    // Sort posts by date
    const sortedPosts = [...posts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const groupedPosts: { [date: string]: Post[] } = {};
    sortedPosts.forEach((post) => {
        const dateKey = new Date(post.date).toLocaleDateString();
        if (!groupedPosts[dateKey]) {
            groupedPosts[dateKey] = [];
        }
        groupedPosts[dateKey].push(post);
    });

    // Determine if the post is an image post
    const isImagePost = (post: Post) => post.type === 'image';

    return (
        <div className={styles.countryContainer}>
            <h1>{country}</h1>
            {imagePosts.length > 0 && <Film posts={imagePosts}/>}
            <div className={styles.container}>
                <div className={styles.timelineContainer}>
                    <div className={styles.timelineLine}></div>
                    {Object.keys(groupedPosts).map((dateKey) => (
                        <div key={dateKey}>
                            <h2>{dateKey}</h2>
                            {groupedPosts[dateKey].map((post, index) => (
                                <div key={index} className={isImagePost(post) ? styles.imageEvent : styles.postEvent}>
                                    {post.imageUrl && (
                                        <div className={styles.imageContainer}>
                                            <Image
                                                src={post.imageUrl}
                                                alt="Post"
                                                width={800} height={400} 
                                                layout="responsive"
                                            />
                                        </div>
                                    )}
                                    {post.type === 'text' && (<p>{post.content}</p>)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}