//Grid Layout 9 cards
// Flip one and it overlays a description on all of them

import React, { useState } from 'react';
import styles from "../../styles/scrapbook/cardThree.module.css"
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

const CardThree = ({ backgroundImage, foregroundImages, foregroundImagesDesc, description }: CardTwoProps) => {
    console.log("Test")
    const [photoFlipped, setPhotoFlipped] = useState(false);
    if(selectedIndices.length === 0) {
        while (selectedIndices.length < 9) {
            const randomIndex = Math.floor(Math.random() * foregroundImages.length);
            selectedIndices.push(randomIndex);
            // if (!selectedIndices.includes(randomIndex)) {
            //     selectedIndices.push(randomIndex);
            // }
        }
    }
    console.log("Test")


    return (
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                {selectedIndices.map((index) => (
                    <Stack className={styles.photoContainer} key={index}>
                            <Image
                                key={index}
                                src={foregroundImages[index]}
                                className={styles.foregroundPhoto}
                                alt={`Photo ${index + 1}`}
                                layout="responsive"
                                width={200} height={200}
                                onClick={() => setPhotoFlipped(!photoFlipped)} />
                    </Stack>
                ))}
                {photoFlipped && (
                <Stack className={styles.foregroundPhotoFlipped} onClick={() => setPhotoFlipped(!photoFlipped)}>
                    <h1>
                        {description}
                    </h1>
                </Stack>)}
            </div>
        </div>
    )
    
}

export default CardThree;
