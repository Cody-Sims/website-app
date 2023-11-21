import { useEffect, useState } from 'react';
import { AppProps } from "next/app";
import Navbar from "../components/navbar";
import 'bootstrap/dist/css/bootstrap.css';
import './_app.css';

function MyApp({ Component, pageProps }: AppProps) {
    const [isLightMode, setIsLightMode] = useState(false);

    const toggleTheme = () => {
        setIsLightMode(!isLightMode);
    };

    useEffect(() => {
      console.log("Theme Updated:", isLightMode ? "Light Mode" : "Dark Mode");
  }, [isLightMode]);

    return (
        <div className={isLightMode ? 'lightMode' : 'darkMode'}>
            <Navbar onToggleTheme={toggleTheme} isLightMode={isLightMode}/>
            <Component {...pageProps} className={isLightMode ? 'lightMode' : 'darkMode'}/>
        </div>
    );
}

export default MyApp;
