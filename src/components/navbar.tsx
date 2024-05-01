import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from '../styles/navbar.module.css';

type NavbarProps = {
    onToggleTheme: () => void;
    isLightMode: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleTheme, isLightMode }) => {
    const router = useRouter();
    const isActive = (pathname: string) => router.pathname === pathname;
    const [initialized, setInitialized] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const handleNavCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed);
        console.log("Navbar toggled:", !isNavCollapsed); // Debugging line
    };


    useEffect(() => {
        const savedTheme = localStorage.getItem('isLightMode');
        if (savedTheme !== null) {
            const isLight = JSON.parse(savedTheme);
            if (isLight !== isLightMode) {
                onToggleTheme();
            }
        }
        setInitialized(true);
    }, [isLightMode, onToggleTheme]);

    const handleToggleTheme = () => {
        const newTheme = !isLightMode;
        onToggleTheme();
        localStorage.setItem('isLightMode', JSON.stringify(newTheme));
    };

    if (!initialized) {
        return null; // Or a loader/spinner
    }

    return (
        <div className={styles.containerNavbar}>
            <nav className={`${styles.navbar} navbar navbar-expand-lg navbar-light bg-light`} style={{padding: "12px"}}>
                <Link href="/" passHref legacyBehavior>
                    <a className={`${styles.navLinkH1} ${isActive('/') ? styles.active : ''}`}>Cody Sims</a>
                </Link>
                <div onClick={handleToggleTheme}>
                    <Image 
                        src={isLightMode ? "/assets/darkMode.svg" : "/assets/lightMode.svg"}
                        alt={isLightMode ? "Dark Mode" : "Light Mode"}
                        width={28}
                        height={28}
                    />
                </div>
                <a href="https://www.linkedin.com/in/codymsims/" target="_blank" rel="noopener noreferrer">
                        <Image src="/assets/linkedin.svg" className={styles.icon} alt="LinkedIn profile" width={28} height={28}/>
                </a>
                <button
                        className={`navbar-toggler ${!isNavCollapsed ? 'collapsed' : ''}`}
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded={!isNavCollapsed}
                        aria-label="Toggle navigation"
                        onClick={handleNavCollapse}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''} ${styles.collapsibleContent}`} id="navbarSupportedContent">
                        <ul className={`${styles.navbarNav} navbar-nav ml-auto`}>
                            <li className={styles.navItem}>
                                <Link href="/" passHref legacyBehavior>
                                    <a onClick={handleNavCollapse} className={`${styles.navLink} ${isActive('/dj') ? styles.active : ''}`}>DJ</a>
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href="/travel" passHref legacyBehavior>
                                    <a onClick={handleNavCollapse}className={`${styles.navLink} ${isActive('/travel') ? styles.active : ''}`}>Travel</a>
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href="/" passHref legacyBehavior>
                                    <a onClick={handleNavCollapse} className={`${styles.navLink} ${isActive('/blog') ? styles.active : ''}`}>Blog</a>
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href="/login" passHref legacyBehavior>
                                    <a onClick={handleNavCollapse} className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}>Login</a>
                                </Link>
                            </li>
                        </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
