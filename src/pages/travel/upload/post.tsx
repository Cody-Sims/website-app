import React, { useEffect, useState } from 'react';
import { Stack } from '@fluentui/react';
import styles from '../../../travel/upload/styles/createPost.module.css';

export default function CreatePost() {
    const [textPost, setTextPost] = useState('');
    const [textPostStatus, setTextPostStatus] = useState('');
    const [postDate, setPostDate] = useState(new Date().toISOString().slice(0, 16));
    const [location, setLocation] = useState('');
    const [latLong, setLatLong] = useState({ lat: 0.0, long: 0.0 });
    const [manualCity, setManualCity] = useState('');
    const [manualCountry, setManualCountry] = useState('');

    const submitPost = async (postType: 'image' | 'text', content = '', imageUrl = '') => {
        let postData = {
            type: postType,
            content: content,
            imageUrl: imageUrl,
            date: new Date(postDate),
            ...(manualCity === '' && manualCountry === '' ? { latitude: latLong.lat, longitude: latLong.long } : {}),
            manualCity: manualCity,
            manualCountry: manualCountry,
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
            // Reset fields
            setManualCity('');
            setManualCountry('');
            setLocation('');
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
                setLocation(`${latitude}, ${longitude}`);
            },
            (error) => {
                console.error('Geolocation Error:', error);
                setLocation('Unable to retrieve location');
            }
        );
    }, []);

    return (
        <Stack>
            <Stack className={styles.container}>
                <h2>Create a Text Post</h2>
                <textarea
                    value={textPost}
                    onChange={(e) => setTextPost(e.target.value)}
                    maxLength={1000}
                    placeholder="What's happening?"
                    className={styles.textArea}
                />
                <Stack className={styles.containerInput} horizontal tokens={{ childrenGap: 10 }} style={{margin: "6px 0"}}>
                    <input type="datetime-local" value={postDate} onChange={(e) => setPostDate(e.target.value)}/>
                    <input type="text" placeholder="Latitude, Longitude" value={location} onChange={(e) => setLocation(e.target.value)}/>
                </Stack>
                <Stack className={styles.containerInput} horizontal tokens={{ childrenGap: 10 }} style={{marginBottom: "6px"}}>
                    <input type="text" placeholder="City (Optional)" value={manualCity} onChange={(e) => setManualCity(e.target.value)}/>
                    <input type="text" placeholder="Country (Optional)" value={manualCountry} onChange={(e) => setManualCountry(e.target.value)}/>
                </Stack>
                <button onClick={handleTextPostSubmit} className={styles.submitButton}>Tweet</button>
                {textPostStatus && <p>{textPostStatus}</p>}
            </Stack>
        </Stack>
    );
}
