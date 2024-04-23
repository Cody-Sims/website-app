import { Stack} from '@fluentui/react/lib/Stack';
import styles from "../styles/scrapbook.module.css"
import React from 'react';
import Head from 'next/head';
import CardOne from '@/components/scrapbook/cardOne';


interface ScrapbookPage {
    mainImage: string;          // Link to the main background image
    foregroundImages: string[]; // Array of links to foreground images
    foregroundImagesDesc: string[];
    description: string;        // Text description of the page
    location: string;           // Location associated with the page
    date: string;        // Date associated with the page (flexible type)
}

const myScrapbookPage: ScrapbookPage = {
    mainImage: '/assets/caving.webp',
    foregroundImages: [
        '/assets/brown.svg', 
        '/assets/portrait.png', 
        '/assets/brown.svg', 
        '/assets/brown.svg', 
    ],
    foregroundImagesDesc: [
        "A Night To Remember",
        "A Night To Remember",
        "A Night To Remember",
        "A Night To Remember",
    ], // Array of links to foreground images
    description: 'An amazing summer trip through the streets of Marrakech',
    location: 'Marrakech, Morocco',
    date: '2023-07-15' // Or you could do: date: new Date('2023-07-15')
};

const myScrapbookPage2: ScrapbookPage = {
    mainImage: '/assets/times_square_2021/background.JPG',
    foregroundImages: [
        '/assets/times_square_2021/img1.JPG', 
        '/assets/times_square_2021/img2.JPG', 
        '/assets/times_square_2021/img3.JPG', 
        '/assets/times_square_2021/img4.JPG', 
    ],
    foregroundImagesDesc: [
        "A Night To Remember",
        "A Night To Remember",
        "A Night To Remember",
        "A Night To Remember",
    ], // Array of links to foreground images
    description: 'This was my first trip to New York City, and my first time in Times Square. The night was beautiful, and even though it was raining, our spirits were at the max.',
    location: 'Times Square, New York',
    date: '2021-07-15'
};

const myScrapbookPage3: ScrapbookPage = {
    mainImage: '/assets/nyc_2021/background.JPG',
    foregroundImages: [
        '/assets/nyc_2021/1.JPG', 
        '/assets/nyc_2021/2.JPG', 
        '/assets/nyc_2021/4.JPG', 
        '/assets/nyc_2021/3.JPG', 
    ],
    foregroundImagesDesc: [
        "Fondling the Bull for Good Luck",
        "Just 2 homies sharing a milkshake ;)",
        "My First Michelin Star Restaurant",
        "Was it actually Trump? Who knows",
    ], // Array of links to foreground images
    description: 'This was my first trip to New York City, and my first time in Times Square. The night was beautiful, and even though it was raining, our spirits were at the max.',
    location: 'Manhatten, New York',
    date: '2021-07-15'
};

const bio = "This is an idea that I have had for a while. I wanted some way to commemorate my time at Brown, a way to immortalize the memories that I had made. This scrapbook is exactly that. This is a journey through my time in college. When I look back, The moments that I cherish the most are always the shenanigans I got into with my friends. I never remember the all nighters I pulled cramming for an exam.  it is never the moments in which I was studying for an exam or pulling an all-nighter. Now that graduation is upon us, it will not be long until we all go our separate ways. I know that even as we are no longer a 10-minute walk from each other we will continue to cherish the memories we have made. This is not the end of our time together, but instead the start of a new leaf. I look forward to this new chapter."

export default function ScrapbookPage() {
    return (
            <Stack>
                <Head>
                    <title>Travels</title>
                    <meta
                    name="description"
                    content="This is a page dedicated to my friends and my college experience"
                    />
                </Head>   
                <Stack className={styles.containerBio}>
                    <Stack className={styles.containerBio2}>
                        <h1>
                            {bio}
                        </h1>
                    </Stack>
                </Stack>
                <Stack className={styles.containerScrapbookItem}> 
                    <Stack className={styles.containerRegion}>
                        <Stack horizontal className={styles.containerText}>
                            <h1>{myScrapbookPage.location}</h1>
                            <h1>{myScrapbookPage.date}</h1> 
                        </Stack>
                        <CardOne
                            backgroundImage={myScrapbookPage.mainImage}
                            foregroundImages={myScrapbookPage.foregroundImages} 
                            foregroundImagesDesc = {myScrapbookPage.foregroundImagesDesc}
                            description = {myScrapbookPage.description}
                        />
                    </Stack>
                </Stack>


                <Stack className={styles.containerScrapbookItem}> 
                    <Stack className={styles.containerRegion}>
                        <Stack horizontal className={styles.containerText}>
                            <h1>{myScrapbookPage2.location}</h1>
                            <h1>{myScrapbookPage2.date}</h1> 
                        </Stack>
                        <CardOne
                            backgroundImage={myScrapbookPage2.mainImage}
                            foregroundImages={myScrapbookPage2.foregroundImages} 
                            foregroundImagesDesc = {myScrapbookPage2.foregroundImagesDesc}
                            description = {myScrapbookPage2.description}
                        />
                    </Stack>
                </Stack>

                <Stack className={styles.containerScrapbookItem}> 
                    <Stack className={styles.containerRegion}>
                        <Stack horizontal className={styles.containerText}>
                            <h1>{myScrapbookPage3.location}</h1>
                            <h1>{myScrapbookPage3.date}</h1> 
                        </Stack>
                        <CardOne
                            backgroundImage={myScrapbookPage3.mainImage}
                            foregroundImages={myScrapbookPage3.foregroundImages} 
                            foregroundImagesDesc = {myScrapbookPage3.foregroundImagesDesc}
                            description = {myScrapbookPage3.description}
                        />
                    </Stack>
                </Stack>

            </Stack>
    );
}
