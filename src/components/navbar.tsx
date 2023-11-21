import React from "react";
import styles from '../styles/navbar.module.css';
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";


type NavbarProps = {
    onToggleTheme: () => void;
    isLightMode: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleTheme, isLightMode }) => {
    const router = useRouter()
    const isActive = (pathname:string) => router.pathname === pathname;

    return (
        <div className={styles.containerNavbar}>
            <nav className={`${styles.navbar} navbar navbar-expand-lg navbar-light bg-light`}  style={{padding: "12px"}}>
                <Link href="/" passHref legacyBehavior>
                    <a className={`${styles.navLinkH1} ${isActive('/') ? styles.active : ''}`}>Cody Sims</a>
                </Link>
                <div onClick={onToggleTheme}>
                    <Image 
                        src={isLightMode ? "/assets/darkMode.png" : "/assets/lightMode.png"}
                        alt={isLightMode ? "Dark Mode" : "Light Mode"}
                        width={28}
                        height={28}
                    />
                </div>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${styles.collapse} navbar-collapse`} id="navbarSupportedContent">
                    <ul className={`${styles.navbarNav} navbar-nav ml-auto`}>
                        <li className={styles.navItem}>
                            <Link href="/dj" passHref legacyBehavior>
                                <a className={`${styles.navLink} ${isActive('/dj') ? styles.active : ''}`}>DJ</a>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/travel" passHref legacyBehavior>
                                <a className={`${styles.navLink} ${isActive('/travel') ? styles.active : ''}`}>Travel</a>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/blog" passHref legacyBehavior>
                                <a className={`${styles.navLink} ${isActive('/blog') ? styles.active : ''}`}>Blog</a>
                            </Link>
                        </li>
                    </ul>
                    <a href="https://www.linkedin.com/in/codymsims/" target="_blank" rel="noopener noreferrer">
                        <Image className={styles.icon} src="/assets/linkedin.png" alt="LinkedIn profile" width={28} height={28}/>
                    </a>
                </div>
            </nav>
        </div>
    );
}

export default Navbar