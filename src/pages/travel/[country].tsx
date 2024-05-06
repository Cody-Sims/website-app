import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/country.module.css';
import Image from 'next/image';
import Film from '@/components/scrapbook/film';
import { getCurrentUserEmail } from '../../../firebase-config';
import { Icon, Stack } from '@fluentui/react';

// Define a TypeScript interface for the post structure
interface Post {
    _id: number;
    date: string;
    type: 'image' | 'text';
    content?: string;
    imageUrl?: string;
    manuelCity?: string;
}

interface GroupedPosts {
    [key: string]: Post[];
}

export default function Country() {
    const router = useRouter();
    const country = router.query.country as string;
    const [groupedPosts, setGroupedPosts] = useState<GroupedPosts>({});
    const [imagePosts, setImagePosts] = useState<Post[]>([]);
    const [userEmail, setUserEmail] = useState("");
    const [editingPostId, setEditingPostId] = useState<number|null>(null);
    const [editContent, setEditContent] = useState<string|undefined>('');
    const [postContent, setPostContent] = useState<string|undefined>("What's happening...?");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [latLong, setLatLong] = useState({ lat: 0.0, long: 0.0 }); 
    const [textPostStatus, setTextPostStatus] = useState('');

    


    useEffect(() => {
        const fetchPosts = async () => {
            if (country) {
                try {
                    const response = await fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts/${country}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    const data: { date: string; posts: Post[] }[] = await response.json(); // adjust based on actual data structure
                    // Transform the array to an object with date keys
                    const groupedByDate = data.reduce<GroupedPosts>((acc, item) => {
                        acc[item.date] = item.posts;
                        return acc;
                    }, {});
                    setGroupedPosts(groupedByDate);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };
        fetchPosts();
    }, [country]);
    

    useEffect(() => {
        const fetchImagePosts = async () => {
            if (country) {
                try {
                    const response = await fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts/${country}/images`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    const data: Post[] = await response.json();
                    setImagePosts(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };
        fetchImagePosts();
    }, [country]);


    // Determine if the post is an image post
    const isImagePost = (post: Post) => post.type === 'image';

    const handleEdit = (post: Post) => {
        setEditingPostId(post._id);
        setEditContent(post.content); // Initialize the input with the current content
    };
    
    const handleSave = async () => {
        // Send the PATCH request to the updated API endpoint
        const response = await fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts/${editingPostId}`, {
            method: 'PATCH', // Change to PATCH, which is more appropriate for updates
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: editContent }), // Only need to send the content
        });
    
        if (response.ok) {
            // Fetch the new post data from the response
            const updatedPost = await response.json();
    
            // Update the local state to reflect the new content
            const updatedGroupedPosts = { ...groupedPosts };
            Object.keys(updatedGroupedPosts).forEach(date => {
                updatedGroupedPosts[date] = updatedGroupedPosts[date].map(post => {
                    if (post._id === editingPostId) {
                        return { ...post, content: updatedPost.content }; // Update content from server response
                    }
                    return post;
                });
            });
            setGroupedPosts(updatedGroupedPosts);
            setEditingPostId(null); // Exit edit mode
        } else {
            // Handle errors, such as showing a message to the user
            console.error('Failed to update the post');
            // Optionally, retrieve error message from response and display
            const error = await response.json();
            alert(`Failed to update post: ${error.message}`);
        }
    };
    
    const handleCancel = () => {
        setEditingPostId(null);
        setEditContent("")
    };

    const handleDelete = async (postId:number) => {
        const response = await fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts/${postId}`, {
            method: 'DELETE'
        });
    
        if (response.ok) {
            alert('Post deleted successfully');
            // Remove the deleted post from state
            const updatedGroupedPosts = { ...groupedPosts };
            Object.keys(updatedGroupedPosts).forEach(date => {
                updatedGroupedPosts[date] = updatedGroupedPosts[date].filter(post => post._id !== postId);
            });
            setGroupedPosts(updatedGroupedPosts);
        } else {
            const error = await response.json();
            alert(`Failed to delete post: ${error.message}`);
        }
    };
    

    const autoResizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset the height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
        }
    };

    // Adjust the textarea height on content change
    useEffect(() => {
        autoResizeTextarea();
    }, [editContent]);
    

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

      function formatDate(date: string) {
        // Split the date key into year, month, and day
        var parts = date.split("-");
        
        // Rearrange the parts to form MM/DD/YYYY format
        var formattedDate = parts[1] + "/" + parts[2] + "/" + parts[0];
        
        return formattedDate;
    }

    const submitPost = async () => {
        let postData = {
            type: "text",
            content: postContent,
            date: new Date(),
            latitude: latLong.lat, 
            longitude: latLong.long
        };

        try {
            const response = await fetch('https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });
            if (!response.ok) throw new Error('Failed to submit post');
        } catch (error) {
            setTextPostStatus('Error submitting post');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if(userEmail === "codysims190@gmail.com"){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatLong({ lat: latitude, long: longitude });
                },
                (error) => {
                    console.error('Geolocation Error:', error);
                    setTextPostStatus('Unable to retrieve location');
                }
            );
        }
    }, [userEmail]);

    return (
        <div className={styles.countryContainer}>
            <h1>{country}</h1>
            {imagePosts.length > 0 && <Film posts={imagePosts}/>}
            <div className={styles.container}>
                <div className={styles.timelineContainer}>
                    {userEmail === "codysims190@gmail.com" &&
                        <Stack className={styles.containerEvent}>  
                            <div className={styles.postEvent} style={{display:"flex", flexDirection: "column"}}>
                                <textarea
                                    ref={textareaRef}
                                    className={styles.postEventInput}
                                    value={postContent}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {setPostContent(e.target.value); autoResizeTextarea();}}/>
                                <button onClick={submitPost} className={styles.toggleButton}> Submit Post </button> 
                            </div> 
                        </Stack>}
                    <div className={styles.timelineLine}></div>
                    {Object.keys(groupedPosts).map((dateKey) => (
                        <div key={dateKey}>
                            <h2>{formatDate(dateKey)}</h2>
                            {groupedPosts[dateKey].map((post, index) => (
                                <Stack horizontal key={index} className={styles.containerEvent}>
                                    <div className={isImagePost(post) ? styles.imageEvent : styles.postEvent}>
                                        {post.imageUrl && (
                                           
                                                <Image
                                                    src={post.imageUrl}
                                                    alt="Post"
                                                    width={800} height={400} 
                                                    layout="responsive"
                                                    className={styles.imageContainer}
                                                />
                                           
                                        )}
                                        {post.type === 'text' && (
                                            editingPostId === post._id ?
                                                <textarea
                                                    ref={textareaRef}
                                                    className={styles.postEventInput}
                                                    value={editContent}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                        setEditContent(e.target.value);
                                                        autoResizeTextarea();
                                                    }}
                                                /> 
                                            :
                                            <p>{post.content}</p>
                                        
                                        )}
                                    </div>
                                    {userEmail === "codysims190@gmail.com" && (
                                        <Stack className={styles.containerTools}>
                                            {editingPostId === post._id ? (
                                                <>
                                                    <Icon iconName="cancel" className={styles.icon} onClick={() => handleCancel()}/>
                                                    <Icon iconName="save" className={styles.icon} onClick={() => handleSave()}/>
                                                </>
                                            ) : (
                                                <Icon iconName="edit" className={styles.icon} onClick={() => handleEdit(post)}/>
                                            )}
                                            <Icon iconName="delete" className={styles.icon} onClick={() => handleDelete(post._id)}/>
                                        </Stack>
                                    )}
                                </Stack>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}    