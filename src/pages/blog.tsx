import React, { useState, useEffect, FC } from 'react';
import styles from '../styles/blog/blog.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface BlogPost {
  _id: string;
  title: string;
  description?: string;
  img: string;
  author?: string;
  category?: string;
  datePosted?: string;
  content?: string;
}

interface BlogHomePageProps {
  blogPostsArray?: BlogPost[];
}

const Blog: FC<BlogHomePageProps> = ({ blogPostsArray }) => {
  const [blogCards, setBlogCards] = useState<BlogPost[]>([]);
  const [groupedBlogCards, setGroupedBlogCards] = useState<Record<string, BlogPost[]>>({});
  const [displayMode, setDisplayMode] = useState<'date' | 'category'>('date');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const hasExternalPosts = blogPostsArray && blogPostsArray.length > 0;
    if (hasExternalPosts) {
        setBlogCards(blogPostsArray);
        setGroupedBlogCards(groupByCategory(blogPostsArray));
    } else {
        setLoading(true);
        fetch('https://gentle-lowlands-37866-11b26cec28c1.herokuapp.com/api/blog')
            .then(response => response.json())
            .then(data => {
                setBlogCards(data);
                setGroupedBlogCards(groupByCategory(data));
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the blog posts:", error);
                setError(error);
                setLoading(false);
            });
    }
  }, [blogPostsArray]);

  function groupByCategory(cards: BlogPost[]): Record<string, BlogPost[]> {
    return cards.reduce((grouped: Record<string, BlogPost[]>, card: BlogPost) => {
      const category = card.category || 'uncategorized'; // Fallback for undefined categories
      (grouped[category] = grouped[category] || []).push(card);
      return grouped;
    }, {} as Record<string, BlogPost[]>);
  }
  

  function sortByDate(cards: BlogPost[]) {
    return [...cards].sort((a, b) => {
      const dateA = a.datePosted ? new Date(a.datePosted).getTime() : new Date().getTime();
      const dateB = b.datePosted ? new Date(b.datePosted).getTime() : new Date().getTime();
      return dateB - dateA;
    });
  }
  
  function renderBlogPosts() {
    const renderCard = (card: BlogPost, isLargeCard: boolean) => {
      const handleCardClick = () => {
        router.push(`/blog/${card._id}`);
      };

      return (
        <article className={isLargeCard ? `${styles.blogCard} ${styles.blogCardLarge}` : styles.blogCard} key={card._id} onClick={handleCardClick}>
            {isLargeCard ? (
                <>
                    <Image src={card.img} alt={card.title} className={styles.blogCardImageLarge} width={800} height={400} layout="responsive" />
                    <div className={styles.blogCardTextLarge}>
                        <h2 className={styles.centeredTitle}>{card.title}</h2>
                        <p className={styles.blogCardContent}>{card.content}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.blogCardImage} style={{ backgroundImage: `url(${card.img})` }}>
                        <div className={styles.blogCardHoverContent}>
                            <h2 className={styles.blogCardTitle}>{card.title}</h2>
                            {/* <p className={styles.blogCardExcerpt}>{card.description}</p> */}
                        </div>
                    </div>
                    <div className={styles.blogCardFooter}>
                        <span className={styles.blogCardAuthor}>{card.author}</span>
                        <span className={styles.blogCardDate}>{card.datePosted}</span>
                        {/* <span className={styles.blogCardCategory}>{card.category}</span> */}
                    </div>
                </>
            )}
        </article>
    );    
    };

    if (displayMode === 'category') {
        return Object.keys(groupedBlogCards).map(category => (
          <section key={category} className={styles.blogCategorySection}>
            <h2 className={styles.blogCategoryTitle}>{category}</h2>
            <div className={styles.blogPostsGrid}>
              {groupedBlogCards[category].map(card => renderCard(card, Math.random() < 0.2))}
            </div>
          </section>
        ));
      } else {
        const sortedCards = sortByDate(blogCards);
        return (
          <div className={styles.blogPostsGrid}>
            {sortedCards.map((card, index) => {
              const isSpecialCard = index === 0 || index % 11 === 0;
              return renderCard(card, isSpecialCard);
            })}
          </div>
        );
      }
    }

  function toggleDisplayMode() {
    setDisplayMode(prevMode => prevMode === 'category' ? 'date' : 'category');
  }

  return (
    <main className={styles.blogHomepage}>
      {/* <button className={styles.toggleButton} onClick={toggleDisplayMode}>Toggle Mode</button> */}
      {loading && <p className={styles.message}>Loading...</p>}
      {error && <p className={styles.message}>Error fetching posts!</p>}
      {!loading && !error && renderBlogPosts()}
    </main>
  );
};

export default Blog;
