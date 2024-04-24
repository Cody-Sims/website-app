import React, { useState } from 'react';
import styles from "../../styles/cardTwo.module.css"
import Image from 'next/image';
import { Stack } from '@fluentui/react';

interface CardTwoProps {
    backgroundImage: string;
    foregroundImages: string[];
    foregroundImagesDesc: string[];
    description: string;
}

// Select three random indices for the foreground images
const selectedIndices: number[] = [];
const randomStyle = Math.random() < 0.5 ? 'style1' : 'style2';

const CardTwo = ({ backgroundImage, foregroundImages, foregroundImagesDesc, description }: CardTwoProps) => {
    const [flippedPhotos, setFlippedPhotos] = useState(
        Array(foregroundImages.length).fill(false) // Initially all photos are not flipped
    );

    const handlePhotoFlip = (index: number) => {
        setFlippedPhotos((prevFlipped) => {
            const newFlipped = [...prevFlipped];
            newFlipped[index] = !newFlipped[index];
            return newFlipped;
        });
    };

    if(selectedIndices.length === 0) {
        while (selectedIndices.length < 3) {
            const randomIndex = Math.floor(Math.random() * foregroundImages.length);
            if (!selectedIndices.includes(randomIndex)) {
                selectedIndices.push(randomIndex);
            }
        }
    }



    return (
        <div className={styles.cardContainer}>
            {selectedIndices.map((index) => (
            <Stack className={`${styles.photoContainer} ${styles[randomStyle]}`} key={index}>
                
                        <Image
                            key={index}
                            src={foregroundImages[index]}
                            className={`${styles.foregroundPhoto} ${styles[`photo${index + 1}`]} ${flippedPhotos[index] ? styles.flippedPhoto : ''}`}
                            alt={`Photo ${index + 1}`}
                            layout="responsive"
                            width={200} height={200}
                            onClick={() => handlePhotoFlip(index)} />

                    {flippedPhotos[index] && ( // Show description if flipped
                        <Stack className={`${styles.foregroundPhotoFlipped} ${styles[`photo${index + 1}`]}`}
                            onClick={() => handlePhotoFlip(index)}>
                            <h1>
                                {foregroundImagesDesc[index]}
                            </h1>
                        </Stack>
                    )}
                </Stack>
            ))}
        </div>
    )
    
}

export default CardTwo;
