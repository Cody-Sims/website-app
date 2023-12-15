import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Stack } from '@fluentui/react';
import styles from '../../styles/createPost.module.css';

// Dynamic import for ImageUploader
const ImageUploader = dynamic(() => import('../../components/imageUploader'), { ssr: false });

export default function CreatePost() {
    const [textPost, setTextPost] = useState('');
    const [textPostStatus, setTextPostStatus] = useState('');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [postDate, setPostDate] = useState(new Date().toISOString().slice(0, 16));
    const [location, setLocation] = useState('');

    const handleImageUploadSuccess = (imageUrl: string) => {
        setUploadedImages(prevImages => [...prevImages, imageUrl]);
    };

    const handleTextPostSubmit = () => {
        // Submit the text post to your backend or handle it as required
        setTextPostStatus('Text post submitted successfully!');
    };

    const fetchAddress = async (lat: number, lon: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLocation(`${data.address.city}, ${data.address.country}`);
        } catch (error) {
            setLocation('Unable to retrieve location');
            console.error('Error fetching address:', error);
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchAddress(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setLocation('Unable to retrieve location');
            }
        );
    }, []);

    return (
        <Stack className={styles.containerCreatePost} style={{alignItems: 'center', textAlign: "center", width: "100%", height: "200vh", marginTop: "10vh"}}>
            <Stack>
                <h2>Create a Text Post</h2>
                <textarea style={{width: "25vw", height: "25vh"}}
                    value={textPost}
                    onChange={(e) => setTextPost(e.target.value)}
                    maxLength={280}
                    placeholder="What's happening?"
                    className={styles.textArea}
                />
                <Stack horizontal tokens={{childrenGap: 10}}>
                    <Stack>
                        <label>Date and Time: </label>
                        <input type="datetime-local" value={postDate} onChange={(e) => setPostDate(e.target.value)} />
                    </Stack>
                    <Stack>
                        <label>Location: </label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </Stack>
                </Stack>
                <button onClick={handleTextPostSubmit} className={styles.submitButton}>Tweet</button>
                {textPostStatus && <p>{textPostStatus}</p>}
            </Stack>
            <Stack style={{width: "50vw", marginTop: "10vh"}}>
                <h2>Upload an Image</h2>
                <ImageUploader onUpload={handleImageUploadSuccess}/>
                {uploadedImages.length > 0 && (
                <Stack>
                    <h3>Uploaded Images:</h3>
                    {uploadedImages.map((imgUrl, index) => (
                        <a key={index} href={imgUrl} target="_blank" rel="noopener noreferrer">{imgUrl}</a>
                    ))}
                </Stack>
            )}
            </Stack>
        </Stack>
    );
}
