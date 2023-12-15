import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Stack } from '@fluentui/react';
import styles from '../../styles/createBlog.module.css'; // Adjust the import path to your actual CSS module file
import Blog from '../blog';
import Image from 'next/image';


// Dynamic import for ImageUploader (if needed)
const ImageUploader = dynamic(() => import('../../components/imageUploader'), { ssr: false });

interface BlogPost {
    _id: string,
    title: string;
    description: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    img: string;
    datePosted: string;
}

function PostBlog() {
    const [title, setTitle] = useState<string>('Title...');
    const [author, setAuthor] = useState<string>('Author...');
    const [description, setDescription] = useState('Description...');
    const [content, setContent] = useState('This is the content for your Blog Post');
    const [category, setCategory] = useState('Category...');
    const [tags, setTags] = useState('Tags: Vietnam, Steak, etc');
    const [statusMessage, setStatusMessage] = useState('');
    const [previewImg, setPreviewImg] = useState('');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Explicitly define as string[]
    const [blogPostsArray, setBlogPostsArray] = useState<BlogPost[]>([]); // Define type for blogPostsArray


    const handleImageUploadSuccess = (imageUrl: string) => {
        setPreviewImg(imageUrl);
        setUploadedImages(prevImages => [...prevImages, imageUrl]);
    };

    const handleSubmit = async () => {
        const currentDate = new Date().toISOString();
        const blogPost = {
            _id:null,
            title,
            description,
            content,
            author,
            category,
            tags: tags.split(',').map(tag => tag.trim()), // Assuming tags are comma separated
            img: previewImg,
            datePosted: currentDate
        };

        try {
            const response = await fetch('https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blogPost)
            });

            if (response.status === 201) {
                setStatusMessage('Blog post successfully added.');
            } else {
                const errorMessage = await response.text();
                setStatusMessage(`Error: ${errorMessage}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                // Now TypeScript knows that 'error' is of type Error
                setStatusMessage(`Error: ${error.message}`);
            } else {
                // Handle cases where the error is not an instance of Error
                setStatusMessage("An unknown error occurred");
            }
        }
    };

    const handlePreview = useCallback(() => {
        const currentDate = new Date().toISOString();
        const newBlogPost = {
            _id: "",
            title,
            description,
            content,
            author,
            category,
            tags: tags.split(',').map(tag => tag.trim()),
            img: previewImg,
            datePosted: currentDate
        };
        setBlogPostsArray([newBlogPost, newBlogPost, newBlogPost]);
    }, [title, description, content, author, category, tags, previewImg]);

    useEffect(() => {
        handlePreview();
    }, [handlePreview]);
    

    // Function to adjust textarea height
    const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = '0px'; // Temporarily shrink to get the correct scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    // Automatically adjusts text input
    useEffect(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
        adjustTextareaHeight(textarea);
        textarea.addEventListener('input', () => adjustTextareaHeight(textarea));
        });
        return () => {
        textareas.forEach(textarea => {
            textarea.removeEventListener('input', () => adjustTextareaHeight(textarea));
        });
        };
    }, []);
    
    return (
        <Stack>
            {previewImg && <Blog blogPostsArray={blogPostsArray} />} {/* Assuming Blog component doesn't need props */}
            <Stack className={styles.containerCreatePost} style={{ alignItems: 'center' }}>
                <Stack className={styles.blogSection} style={{ width: "50vw" }}>
                    <Stack style={{ marginBottom: "0px", padding: "0 5%" }}>
                        <h2>Post a New Blog</h2>
                        <Stack>
                            <label>Image:</label>
                            <ImageUploader onUpload={handleImageUploadSuccess} />
                        </Stack>
                        <Stack className={styles.inputWrapper}>
                            <Stack>
                                Uploaded Images URLs:
                                {uploadedImages.map((imgUrl, index) => (
                                    <Stack key={index}>
                                        <a href={imgUrl} target="_blank" rel="noopener noreferrer">{imgUrl}</a>
                                    </Stack>
                                ))}
                            </Stack>
                        </Stack>
                        <Stack style={{ paddingTop: '48px' }}>
                            <input type="text" value={tags} onChange={e => setTags(e.target.value)} />
                            <textarea 
                                value={description} 
                                onChange={e => setDescription(e.target.value)}
                                className={styles.textContainer}
                            />
                        </Stack>
                        <button onClick={handlePreview}>Preview Card</button>
                    </Stack>
                    <Stack className={styles.containerBlogPreview}>
                        {previewImg && (
                            <Image 
                                src={previewImg}
                                alt="Preview"
                                width={500} // Adjust these values as needed
                                height={300}
                                layout='responsive'
                            />
                        )}

                        <Stack style={{ marginTop: "24px", alignItems: 'center' }}>
                            <textarea 
                                value={title} 
                                onChange={e => setTitle(e.target.value)}
                                className={styles.textContainer}
                                style={{ fontSize: "24px" }}
                            />
                        </Stack>

                        <Stack horizontal className={styles.containerPostInfo}>
                            <Stack>
                                <textarea 
                                    value={author} 
                                    onChange={e => setAuthor(e.target.value)}
                                    className={styles.textContainer}
                                    style={{ fontSize: "18px" }}
                                />
                            </Stack>
                            <Stack>
                                <textarea 
                                    value={category} 
                                    onChange={e => setCategory(e.target.value)}
                                    className={styles.textContainer}
                                    style={{ fontSize: "18px" }}
                                />
                            </Stack>
                        </Stack>

                        <textarea 
                            value={content} 
                            onChange={e => setContent(e.target.value)}
                        />
                    </Stack>
                    <Stack style={{ marginTop: "100px", alignItems: 'center' }}>
                        <button onClick={handleSubmit}>Submit</button>
                        {statusMessage && <p>{statusMessage}</p>}
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}


export default PostBlog;
