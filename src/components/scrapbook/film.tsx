import React, { useEffect, useRef } from 'react';
import styles from '../../styles/components/film.module.css'; // Assuming your CSS file is named PhotoScrapbook.css
import { IconButton, IButtonStyles, IIconProps } from '@fluentui/react';
import { useState } from 'react';
import Image from 'next/image';
import { Stack } from '@fluentui/react';
import { getCurrentUserEmail } from '../../../firebase-config';


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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [userEmail, setUserEmail] = useState("");



    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setSelectedFile(file);
            await submitPost(file);
        }
    };

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const submitPost = async (originalImage: File) => {
        try {
            // Step 1: Upload the image to obtain the image URL
            const formData = new FormData();
            formData.append('image', originalImage);
            
            const uploadResponse = await fetch("https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/upload-image", {
                method: 'POST',
                body: formData,
            });
    
            if (!uploadResponse.ok) {
                const errorMessage = await uploadResponse.text();
                throw new Error(`Error during image upload: ${errorMessage}`);
            }
    
            // Extract the imageUrl from the upload response
            const { imageUrl } = await uploadResponse.json();
    
            // Step 2: Extract EXIF data based on the image type
            const convertEndpoint = originalImage.type === 'image/heic' ? '/api/convert-heic' : '/api/parse-exif';
            const exifResponse = await fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com${convertEndpoint}`, {
                method: 'POST',
                body: formData,
            });
    
            if (!exifResponse.ok) {
                const errorText = await exifResponse.text();
                throw new Error(`Error during EXIF data extraction: ${errorText}`);
            }
    
            // Extract the EXIF data from the response
            const exifData = await exifResponse.json();
    
            // Prepare the final post data with the obtained imageUrl
            const postData = {
                type: 'image',
                imageUrl: imageUrl,
                latitude: exifData.latitude,
                longitude: exifData.longitude,
                date: new Date(exifData.date).toISOString(),
            };
    
            // Step 3: Submit the post data
            const response = await fetch('https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error during post submission: ${errorText}`);
            }
    
            console.log('Post submitted successfully');
    
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    useEffect(() => {
        getCurrentUserEmail()
          .then(email => {
            console.log(email)
            setUserEmail(email);
          })
          .catch(error => {
            console.error("Error fetching user email:", error);
          });
      }, []);


      useEffect(() => {
        const stripContainer = stripContainerRef.current;

        if (!stripContainer) return;

        let lastTimestamp = 0;
        let scrollAmount = 0;
        const scrollSpeed = 0.05; // Adjust the scroll speed as needed
        const resetDelay = 1000; // Delay in milliseconds before resetting scroll position
        const mediaQuery = window.matchMedia('(max-width: 500px)');

        let isIntersecting = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                isIntersecting = entry.isIntersecting;
            });
        });

        observer.observe(stripContainer);

        const scroll = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            const deltaScroll = scrollSpeed * deltaTime;

            // Check if the media query matches (width is less than 500px) and the element is in view
            if (!mediaQuery.matches && isIntersecting) {
                scrollAmount += deltaScroll;

                if (scrollAmount >= stripContainer.scrollWidth - stripContainer.clientWidth) {
                    // Wait for the resetDelay before resetting scrollAmount
                    setTimeout(() => {
                        scrollAmount = -600;
                    }, resetDelay);
                }

                stripContainer.scrollLeft = scrollAmount;
            }

            requestAnimationFrame(scroll);
        };

        requestAnimationFrame(scroll);

        // Cleanup function to disconnect the observer and reset timestamps
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
            {userEmail == "codysims190@gmail.com" && (
                <div className={`${styles.imageInput} ${styles.itemContainer}`}>
                    <label htmlFor="file-upload">
                        <IconButton iconProps={{ iconName: 'Add' }} styles={{icon: {fontSize: "36px", color: "black"}}} onClick={handleIconClick}/>
                    </label>
                    <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            )}
            {posts.map((post, index) => (
                <div key={index} className={styles.itemContainer}>
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
            {userEmail == "codysims190@gmail.com" && (
                <div className={`${styles.imageInput} ${styles.itemContainer}`} style={{width: "300px"}}>
                    <label htmlFor="file-upload">
                        <IconButton iconProps={{ iconName: 'Add' }} styles={{icon: {fontSize: "36px", color: "black"}}} onClick={handleIconClick}/>
                    </label>
                    <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            )}
            {posts.map((post, index) => (
                <div key={index} className={styles.itemContainer}>
                    {post.type === 'image' && post.imageUrl && (
                        <Image className={styles.photo} src={post.imageUrl} alt="A related caption" width={200} height={300} />
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
