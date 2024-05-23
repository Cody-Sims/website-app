import React, {useState} from 'react';
import styles from "../../styles/scrapbook/cardOne.module.css"
import Image from 'next/image';


interface CardOneProps {
    backgroundImage: string; 
    foregroundImages: string[];
    foregroundImagesDesc: string[];
    description: string;
}

const CardOne = ({ backgroundImage, foregroundImages, foregroundImagesDesc, description}: CardOneProps) => {
  const [isBackgroundFlipped, setIsBackgroundFlipped] = useState(false);
    
  const handleBackgroundFlip = () => {
        setIsBackgroundFlipped(!isBackgroundFlipped);
  };

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

  return (
    <div className={styles.cardContainer}>
      <div className={styles.photoWrapper}> 
        <Image 
          src={backgroundImage}
          className={styles.backgroundImage} 
          alt="Background" 
          layout="responsive" 
          objectFit="cover"
          width={400} height={200}
          onClick={() => handleBackgroundFlip()} // Add the click handler
        />
  
        {isBackgroundFlipped && (
          <div className={styles.flipBackground} 
            onClick={() => handleBackgroundFlip()}
            > 
              <h1>{description}</h1>
            </div>
        )}
  
        {!isBackgroundFlipped && ( // Conditional rendering for foreground images
        foregroundImages.map((image, index) => (
          
          <div className={styles.photoContainer} key={index}>
            {!flippedPhotos[index] && ( // Show description if flipped
                <Image
                  key={index} 
                  src={image} 
                  className={`${styles.foregroundPhoto} ${styles[`photo${index + 1}`]} ${flippedPhotos[index] ? styles.flippedPhoto : ''}`}  
                  alt={`Photo ${index + 1}`} 
                  layout="responsive" 
                  width={200} height={100}
                  onClick={() => handlePhotoFlip(index)} />
            )}

            {flippedPhotos[index] && ( // Show description if flipped
              <div  className={`${styles.foregroundPhotoFlipped} ${styles[`photo${index + 1}`]}`}
                onClick={() => handlePhotoFlip(index)} 
                >
                  <h1> 
                    {foregroundImagesDesc[index]}
                  </h1>
              </div>
            )}
          </div>
        ))
    )}
    </div>
    </div> 
  )
        }
            
export default CardOne;

