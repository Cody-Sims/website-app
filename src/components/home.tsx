import React, { useEffect, useRef, useState } from "react";
import { Stack} from '@fluentui/react/lib/Stack';
import styles from "../styles/Home.module.css"
import LoadingScreen from "./loading_screen";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const workCards = [
    {
        Role: "Software Engineer",
        Logo: "/assets/microsoft.svg",
        Company: "Intern at Microsoft",
        Description: "Redesigned and implemented new features for a popular internal tool",
    },
    {
        Role: "Cloud Engineer",
        Logo: "/assets/cisco.svg",
        Company: "Intern at Cisco",
        Description: "Created a Cost Metrics Dashboard and created new REST APIs",
    },
    {
        Role: "Teaching Assistant",
        Logo: "/assets/brown.svg",
        Company: "TA at Brown University",
        Description: "Acted as a mentor and held debugging sessions for Intro to Software Engineering",
    },
];

const projectCards = [
    {
        img: "/assets/iterative.webp",
        title: "Iterative Design",
        description: "Utilized iterative design to create a Point-Of-Sale System",
        link: "https://hungrybison102.github.io/iterative-design/"
    },
    {
        img: "/assets/pokemonBattle.webp",
        title: "Pokemon Battle Simulator",
        description: "A pokemon battle simulator including the original 151 pokemon created using Java and Javafx. Pokemon data was gathered using beautifulsoup for webscraping.",
    },
    {
        img: "/assets/pokemon.webp",
        title: "Pokemon Team Builder",
        description: "A proof of concept utilizing Javascript with no framework to create a team builder. It is currently not mobile friendly",
        link: "https://quirkyturtle190.github.io/Development/"
    },
];


const Home: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY / window.innerHeight;
            const opacity = 1 - (scrollPos * 1.5);
    
            if (imageRef.current) {
                imageRef.current.style.opacity = Math.max(0, Math.min(opacity, 1)).toString();
            }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack className={styles.containerHomeDiv}>
            <div ref={imageRef}>
                <Image src="/assets/caving.webp" alt="abseiling a cave" width={200} height={100} layout="responsive" className={styles.backgroundImage}/>
            </div>
            <Bio/>
            <Stack className={styles.containerHome}>
                <AboutMe/>
                <WorkExperience/>
                <Projects/>
            </Stack>
        </Stack>
    );
};

function Bio() {
  return (
      <Stack className={styles.containerBio}>
          <h1>Cody Sims</h1>
          <p>Full Stack Developer, Blogger, and Traveller</p>
      </Stack>
  )
}

  
function AboutMe() {
  const router = useRouter();

  const handleClick = () => {
      router.push("/resume");
  };

  return (
      <Stack className={styles.containerAboutMe}>
            <Stack className={styles.containerAboutMeImg}>
                <Image src="/assets/portrait.png" alt="Self-Portrait" className={styles.imgPortrait} width={50} height={50} layout="responsive" />
            </Stack>
            <Stack className={styles.containerAboutMeBio}>
                <h2>
                    Hey, I&apos;m Cody
                </h2>
                <p>
                    I recently graduated from Brown University with a Bachelors in Computer Science. These days, I live in Seattle working for Microsoft. 
                </p>
                <p>
                    As a New Graduate, I am learning a lot as I navigate the workforce.
                </p>
                <p>
                    When I am not working, you can find me exploring, whether that be my city or the world. I am also attempting to blog, 
                    so check out my blog page.
                </p>
                <Stack horizontal className={styles.resumeBut}>
                    <button onClick={handleClick} className={styles.resumeButButton}>
                        <h2>
                            Resume
                        </h2>
                    </button>
                    <Link href="https://www.linkedin.com/in/codymsims/" passHref>
                        <Image src="/assets/linkedin.svg" alt="LinkedIn profile" className={styles.resumeButImg} width={75} height={75} layout="responsive" />
                    </Link>
                </Stack>
            </Stack>
        </Stack>
    );
}

function WorkExperience() {
  const cardElements = workCards.map((card, index) => (
        <div className={styles.workCard} key={index}>
            <div className={styles.workCardInner}>
                <div className={styles.workCardFront}>
                    <h3>{card.Role}</h3>
                    <p className={styles.workCardTitle}>{card.Company}</p>
                    <Image src={card.Logo} alt="Company Logo" width={200} height={100} layout="responsive" />
                </div>
                <div className={styles.workCardBack}>
                    <div>
                        <h3>{card.Role}</h3>
                        <p className={styles.workCardTitle}>{card.Company}</p>
                    </div>
                    <div style={{margin: "4vh 0"}}>
                        <p className={styles.workCardTitle}>{card.Description}</p>
                    </div>
                </div>
            </div>
        </div>
 
  ));

  return (
      <Stack className={styles.containerWork}>
          <h2>
              Professional Experience
          </h2>
          <Stack horizontal className={styles.workCardContainer}>{cardElements}</Stack>
      </Stack>
  );
}

interface Card {
    img: string;
    title: string;
    description: string;
    link?: string;
}

function Projects() {
    const router = useRouter();
  
    const handleCardClick = (card: Card, event:  React.MouseEvent<HTMLElement>) => {
      if (!card.link) {
        event.preventDefault(); // Prevent default link behavior
        router.push(`/project/${encodeURIComponent(card.title)}`);
      }
      // If card has a link, it will use the default <Link> behavior
    };
  
    const cardElements = projectCards.map((card, index) => {
      const url = card.link ? card.link : `/project/${encodeURIComponent(card.title)}`;
      return (
        <Stack key={index} className={styles.projectCard} tokens={{ childrenGap: "24px" }} onClick={(event) => handleCardClick(card, event)}>
          <h3>{card.title}</h3>
            <Stack tokens={{ childrenGap: "36px" }}>
                <Link href={url} passHref>
                    <Image className={styles.projectCardImg} src={card.img} alt="Company Logo" width={200} height={100} layout="responsive" />
                </Link>
                <h4>{card.description}</h4>
            </Stack>
        </Stack>
      );
    });
  
    return (
      <Stack className={styles.projectContainer}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Projects
        </h2>
        <Stack className={styles.projectCardContainer}>{cardElements}</Stack>
      </Stack>
    );
  }


export default Home
