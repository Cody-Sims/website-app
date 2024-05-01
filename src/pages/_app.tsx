import { useEffect, useState } from 'react';
import { AppProps } from "next/app";
import Navbar from "../components/navbar";
import 'bootstrap/dist/css/bootstrap.css';
import './_app.css';
import LoadingScreen from '@/components/loading_screen';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

function MyApp({ Component, pageProps }: AppProps) {
    const [isLightMode, setIsLightMode] = useState<boolean | undefined>(undefined);

    // Function to toggle the theme
    const toggleTheme = () => {
        setIsLightMode(currentMode => {
            const newMode = !currentMode;
            localStorage.setItem('isLightMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    const extendedPageProps = {
        ...pageProps,
        isLightMode: isLightMode // Add isLightMode to pageProps
    };

    useEffect(() => {
        const getUserPreference = () => {
            if (localStorage.getItem('isLightMode')) {
                return JSON.parse(localStorage.getItem('isLightMode')!);
            }
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        };

        setIsLightMode(getUserPreference());
        const handler = (e: MediaQueryListEvent) => {
            setIsLightMode(e.matches);
        };

        const mediaQueryList = window.matchMedia('(prefers-color-scheme: light)');
        mediaQueryList.addEventListener('change', handler);

        return () => mediaQueryList.removeEventListener('change', handler);
    }, []);

    if (isLightMode === undefined) {
        return <LoadingScreen/>;
    }

    return (
        <div className={isLightMode ? 'lightMode' : 'darkMode'}>
            <Navbar onToggleTheme={toggleTheme} isLightMode={isLightMode}/>
            <Component {...extendedPageProps}/>
        </div>
    );
}

export default MyApp;
