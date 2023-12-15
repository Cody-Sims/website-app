import React, { useEffect, useState, useCallback } from 'react';
import ReactCrop, { Crop as BaseCrop, PixelCrop, PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
}

interface Crop extends PercentCrop {
    aspect?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
    const [src, setSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 30, height: 30, aspect: 16 / 9, x: 0, y: 0 });
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setSrc(reader.result as string));
            reader.addEventListener('error', () => {
                alert('Error occurred while reading the file.');
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    

    const onCropChange = (crop: PixelCrop, percentageCrop: PercentCrop) => {
        console.log('Crop change:', percentageCrop);
        setCrop(percentageCrop);
    };

    const makeClientCrop = async () => {
        if (src && crop.width && crop.height) {
            const croppedImageBlob = await getCroppedImg(src, crop, "newFile.jpeg");
            const newCroppedImageUrl = URL.createObjectURL(croppedImageBlob);
            if (croppedImage) {
                window.URL.revokeObjectURL(croppedImage); // Revoke the previous URL
            }
            setCroppedImage(newCroppedImageUrl);
            uploadImage(croppedImageBlob); // Call upload function
        }
    };

    const getCroppedImg = (src: string, crop: PercentCrop, fileName: string) => {
        return new Promise<Blob>((resolve, reject) => {
            const image = new window.Image();
            image.src = src;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;
    
                // Convert percentage crop to pixel values
                const pixelCrop = {
                    x: crop.x * image.naturalWidth / 100,
                    y: crop.y * image.naturalHeight / 100,
                    width: crop.width * image.naturalWidth / 100,
                    height: crop.height * image.naturalHeight / 100,
                };
    
                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;
    
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
    
                console.log('Scaled crop dimensions:', pixelCrop);
    
                // Draw the cropped image on the canvas
                ctx.drawImage(
                    image,
                    pixelCrop.x,  // Scaled crop x-coordinate
                    pixelCrop.y,  // Scaled crop y-coordinate
                    pixelCrop.width,  // Scaled crop width
                    pixelCrop.height,  // Scaled crop height
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
    
                canvas.toBlob(blob => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    // Convert the blob to a file
                    const file = new File([blob], fileName, {
                        type: 'image/jpeg',
                    });
                    resolve(file);
                }, 'image/jpeg');
            };
            image.onerror = reject;
        });
    };    

    const uploadImage = async (croppedImageBlob: Blob) => {
        try {
            const formData = new FormData();
            formData.append('file', croppedImageBlob, 'newImage.jpg');

            const urlResponse = await fetch("https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/get-signed-url", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileType: croppedImageBlob.type })
            });

            if (!urlResponse.ok) {
                const error = await urlResponse.text();
                alert(`Error: Failed to get signed URL. Server responded with - ${error}`);
                return;
            }

            const { signedUrl, publicUrl } = await urlResponse.json();

            const uploadResponse = await fetch(signedUrl, {
                method: 'PUT',
                body: croppedImageBlob,
                headers: new Headers({
                    'Content-Type': croppedImageBlob.type
                }),
            });

            if (uploadResponse.ok) {
                onUpload(publicUrl);
            } else {
                const errorMessage = await uploadResponse.text();
                alert(`Error during upload. Server responded with - ${errorMessage}`);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(err);
                alert(`Unexpected Error: ${err.message}`);
            } else {
                console.error('An unexpected error occurred', err);
                alert('An unexpected error occurred');
            }
        }
    };

    const onImageLoaded = (image: HTMLImageElement) => {
        setImageRef(image);
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        const size = Math.min(width, height) * 0.8;
    
        setCrop({
            unit: '%',
            x: ((width - size) / 2) / width * 100, // Convert to percentage
            y: ((height - size) / 2) / height * 100, // Convert to percentage
            width: size / width * 100, // Convert to percentage
            height: size / height * 100, // Convert to percentage
            aspect: 16 / 9,
        });
    };
    

    useEffect(() => {
        if (src) {
            console.log('New src set:', src);
        }
    }, [src]);

    useEffect(() => {
        if (croppedImage) {
            console.log('Cropped image set:', croppedImage);
        }
    }, [croppedImage]);

    return (
        <div>
            <input type="file" accept="image/*" onChange={onSelectFile} />
            {src && !croppedImage && (
                <>
                    <ReactCrop 
                        crop={crop}
                        onChange={onCropChange}
                        style={{ position: 'relative', width: '100%', height: 'auto' }}>
                        <img 
                            alt="Crop" 
                            src={src} 
                            onLoad={(e) => onImageLoaded(e.currentTarget)} 
                        />
                    </ReactCrop>
                    <button onClick={makeClientCrop}>Submit</button>
                </>
            )}
            {croppedImage && (
                <div style={{ position: 'relative', width: '100%', height: '300px' /* Example height */ }}>
                    <Image alt="Crop" src={croppedImage} layout="fill" />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
