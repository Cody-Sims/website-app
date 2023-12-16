import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Stack } from '@fluentui/react';
import styles from '../../styles/createPost.module.css';

const ImageUploader = dynamic(() => import('../../components/imageUploader'), { ssr: false });

export default function CreatePost() {
    const [textPost, setTextPost] = useState('');
    const [textPostStatus, setTextPostStatus] = useState('');
    const [postDate, setPostDate] = useState(new Date().toISOString().slice(0, 16));
    const [location, setLocation] = useState('');
    const [latLong, setLatLong] = useState({ lat: 0.0, long: 0.0 });

    const submitPost = async (postType: 'image' | 'text', content = '', imageUrl = '') => {
        const postData = {
            type: postType,
            content: content,
            imageUrl: imageUrl,
            date: new Date(postDate),
            latitude: latLong.lat,
            longitude: latLong.long,
        };
        try {
            const response = await fetch('https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) throw new Error('Failed to submit post');
            setTextPostStatus('Post submitted successfully!');
            if (postType === 'image') setTextPost('');  // Clear text post if it's an image upload
        } catch (error) {
            setTextPostStatus('Error submitting post');
            console.error('Error:', error);
        }
    };

    const handleImageUploadSuccess = async (imageUrl: string) => {
        console.log(imageUrl);
        await submitPost('image', '', imageUrl);
    };

    const handleTextPostSubmit = async () => {
        await submitPost('text', textPost);
        setTextPost('');  // Clear text post after submission
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatLong({ lat: latitude, long: longitude });
                setLocation(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
            },
            (error) => {
                console.error('Geolocation Error:', error);
                setLocation('Unable to retrieve location');
            }
        );
    }, []);
    

    return (
        <Stack className={styles.containerCreatePost} style={{ alignItems: 'center', textAlign: "center", width: "100%", height: "200vh", marginTop: "10vh" }}>
            <Stack>
                <h2>Create a Text Post</h2>
                <textarea style={{ width: "25vw", height: "25vh" }}
                    value={textPost}
                    onChange={(e) => setTextPost(e.target.value)}
                    maxLength={280}
                    placeholder="What's happening?"
                    className={styles.textArea}
                />
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <Stack><input type="datetime-local" value={postDate} onChange={(e) => setPostDate(e.target.value)} /></Stack>
                    <Stack><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} /></Stack>
                </Stack>
                <button onClick={handleTextPostSubmit} className={styles.submitButton}>Tweet</button>
                {textPostStatus && <p>{textPostStatus}</p>}
            </Stack>
            <Stack style={{ width: "50vw", marginTop: "10vh" }}>
                <h2>Upload an Image</h2>
                <ImageUploader onUpload={handleImageUploadSuccess} />
            </Stack>
        </Stack>
    );
}
