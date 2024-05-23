import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Stack } from '@fluentui/react';
import Cookies from 'js-cookie';
import styles from '../../../styles/travel/upload/createImage.module.css';

const ImageUploader = dynamic(() => import('../../../components/imageUploader'), { ssr: false });

export default function CreatePost() {
    const [manualCity, setManualCity] = useState(() => Cookies.get('city') || '');
    const [manualCountry, setManualCountry] = useState(() => Cookies.get('country') || '');
    const [textPostStatus, setTextPostStatus] = useState('');

    const submitPost = async (imageUrl: string, originalImage: File | null) => {
        if (originalImage) {
            const formData = new FormData();
            formData.append('image', originalImage);
            const convertEndpoint = originalImage.type === 'image/heic' ? '/api/convert-heic' : '/api/parse-exif';
            try {
                const exifResponse = await fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com${convertEndpoint}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!exifResponse.ok) {
                    const errorText = await exifResponse.text();
                    throw new Error(errorText || 'Failed to extract EXIF data');
                }

                const exifData = await exifResponse.json();
                let postData = {
                    type: 'image',
                    imageUrl: imageUrl,
                    manualCity: manualCity,
                    manualCountry: manualCountry,
                    latitude: exifData.latitude,
                    longitude: exifData.longitude,
                    date: new Date(exifData.date).toISOString()
                };

                const response = await fetch('https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData),
                });

                if (!response.ok) throw new Error('Failed to submit post');
                setTextPostStatus('Post submitted successfully!');
                Cookies.set('city', manualCity, { expires: 7 });
                Cookies.set('country', manualCountry, { expires: 7 });

            } catch (error: any) {
                setTextPostStatus('Error submitting post: ' + error.message);
                console.error('Error:', error);
            }
        } else {
            setTextPostStatus('No image data available to submit');
        }
    };

    const handleImageUploadSuccess = (uploadedImageUrl: string, originalImage: File | null) => {
        submitPost(uploadedImageUrl, originalImage);
    };

    return (
        <Stack>
            <Stack className={styles.container}>
                <h1>Upload an Image</h1>
                <Stack className={styles.containerInput} horizontal>
                    <input
                        type="text"
                        placeholder="City (Optional)"
                        value={manualCity}
                        onChange={(e) => setManualCity(e.target.value)}
                        className={styles.input}/>
                    <input
                        type="text"
                        placeholder="Country (Optional)"
                        value={manualCountry}
                        onChange={(e) => setManualCountry(e.target.value)}
                        />
                </Stack>
                <Stack style={{ maxWidth: "90vw" }}>
                    <ImageUploader onUpload={handleImageUploadSuccess} />
                </Stack>
                {textPostStatus && <p>{textPostStatus}</p>}
            </Stack>
        </Stack>
    );
}
