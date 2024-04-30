import React, { useState} from 'react';
import dynamic from 'next/dynamic';
import { Stack } from '@fluentui/react';
import Cookies from 'js-cookie';
import styles from '../../../styles/createPost.module.css';

const ImageUploader = dynamic(() => import('../../../components/imageUploader'), { ssr: false });

export default function CreatePost() {
    // Retrieve initial values from cookies or default to empty strings
    const [manualCity, setManualCity] = useState(() => Cookies.get('city') || '');
    const [manualCountry, setManualCountry] = useState(() => Cookies.get('country') || '');
    const [imageUrl, setImageUrl] = useState('');
    const [textPostStatus, setTextPostStatus] = useState('');

    const submitPost = async (imageUrl: string) => {
        let postData = {
            type: 'image',
            imageUrl: imageUrl,
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
            Cookies.set('city', manualCity, { expires: 7 }); // Expires in 7 days
            Cookies.set('country', manualCountry, { expires: 7 }); // Expires in 7 days
            setImageUrl('');
        } catch (error) {
            setTextPostStatus('Error submitting post');
            console.error('Error:', error);
        }
    };

    const handleImageUploadSuccess = (uploadedImageUrl: string) => {
        submitPost(uploadedImageUrl);
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
                <Stack style={{maxWidth:"90vw"}}>
                    <ImageUploader onUpload={handleImageUploadSuccess} />
                </Stack>
                {textPostStatus && <p>{textPostStatus}</p>}
            </Stack>
        </Stack>
    );
}
