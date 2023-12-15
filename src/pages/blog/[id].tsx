import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import styles from "../../styles/blogPost.module.css";
import { Stack } from "@fluentui/react";
import Image from "next/image";
import LoadingScreen from "@/components/loading_screen";

interface BlogPost {
    img: string;
    title: string;
    author: string;
    datePosted: string;
    content: string;
}

export default function BlogPost() {
    const router = useRouter();
    let { id } = router.query;
    const [post, setPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        if (id) { // Check if id is available
            fetch(`https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/blog/${id}`)
                .then(response => response.json())
                .then(data => setPost(data))
                .catch(error => console.error("There was an error fetching the blog post:", error));
        }
    }, [id]); 

    return (
        <div className={styles.containerBlogPost}>
            {post ? (
                <>  
                    <Image src={post.img} alt={post.title} className={styles.blogPostImage} width={200} height={100} layout="responsive" />
                    <Stack horizontal style={{ padding: "0 24px" }}>
                        <Stack.Item>
                            <h2 className={styles.blogPostAuthor}>{post.author}</h2>
                        </Stack.Item>
                        <Stack.Item>
                            <h2 className={styles.blogPostDate}>{post.datePosted}</h2>
                        </Stack.Item>
                    </Stack>
                    <h1 className={styles.blogPostTitle}>{post.title}</h1>
                    <p className={styles.blogPostContent}>{post.content}</p>
                </>
            ) : (
                <LoadingScreen/>
            )}
        </div>
    );
}
