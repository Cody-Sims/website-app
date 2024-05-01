import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/travel.module.css';
import { Icon } from '@fluentui/react/lib/Icon';
import { getCurrentUserEmail } from '../../firebase-config';
import { Stack } from '@fluentui/react';
import Link from 'next/link';



type TravelProps = {
  isLightMode: boolean;
};

const lightModeOptions = {
  backgroundColor: 'rgb(237, 237, 237)',
  datalessRegionColor: '#f8f9fa',
  defaultColor: '#adb5bd',
  colorAxis: {
    colors: ['#8c98a4', '#495057']
  },
  tooltip: {
    textStyle: { color: '#454545' },
    trigger: 'focus',
    isHtml: true
  },
  legend: 'none',
  borderColor: '#dee2e6',
  borderWidth: 1,
};

const darkModeOptions = {
  backgroundColor: '#0E0103',
  datalessRegionColor: '#1f2022',
  defaultColor: '#6c757d',
  colorAxis: {
    colors: ['#44687d', '#c4d6e7']
  },
  tooltip: {
    textStyle: { color: '#212529' },
    trigger: 'focus',
    isHtml: true
  },
  legend: 'none',
  borderColor: '#2f2f2f',
  borderWidth: 1,
};


const Travel = ({ isLightMode }: TravelProps) => {
  const router = useRouter();
  const [chartHeight, setChartHeight] = useState('80vh');
  const [isGoogleChartsLoaded, setIsGoogleChartsLoaded] = useState(false);
  const [chartKey, setChartKey] = useState(Date.now()); // Unique key for chart container
  const adminEmail = "codysims190@gmail.com"; // Set the specific email to check against
  const [userEmail, setUserEmail] = useState("");


  // Function to load the Google Charts library
  const loadGoogleCharts = useCallback(() => {
    if (typeof window !== 'undefined' && (!window.google || !window.google.visualization)) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', {
          packages: ['geochart'],
          callback: () => setIsGoogleChartsLoaded(true),
        });
      };
      document.body.appendChild(script);
    } else {
      setIsGoogleChartsLoaded(true);
    }
  }, []);

  // Function to draw the chart
  const drawChart = useCallback(() => {
    if (!isGoogleChartsLoaded || typeof window.google.visualization === 'undefined') {
      return;
    }

    const data = window.google.visualization.arrayToDataTable([
        ['Country', 'Trips', { role: 'tooltip', type: 'string', p: { html: true } }],
        ['United States', -1, 'Trips: -1'],
        ['Canada', 3, 'Trips: 3'],
        ['Spain', 3, 'Trips: 3'],
        ['Morocco', 1, 'Trips: 1'],
        ['Vietnam', 2, 'Trips: 2'],
        ['Thailand', 2, 'Trips: 2'],
        ['United Kingdom', 1, 'Trips: 1'],
        ['Ireland', 1, 'Trips: 1'],
        ['Japan', 1, 'Trips: 1']
    ]);      

    const chartOptions = isLightMode ? lightModeOptions : darkModeOptions;
    const trigger = window.innerWidth < 768 ? 'selection' : 'focus';
    chartOptions.tooltip.trigger = trigger;
  
    const chart = new window.google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, { ...chartOptions, height: chartHeight });

    window.google.visualization.events.addListener(chart, 'select', () => {
      const selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        const country = data.getValue(selectedItem.row, 0);
        router.push(`/travel/${country}`);
      }
    });
  }, [isLightMode, chartHeight, isGoogleChartsLoaded, router]);

  useEffect(() => {
    loadGoogleCharts();
  }, [loadGoogleCharts]);

  useEffect(() => {
    drawChart();
  }, [router.asPath, drawChart]);

  useEffect(() => {
    setChartKey(Date.now());
  }, [router.asPath]);


  useEffect(() => {
    const updateChartSize = () => {
      if (window.innerWidth < 768) {
        setChartHeight('50vh');
      } else if (window.innerWidth < 1024) {
        setChartHeight('60vh');
      } else {
        setChartHeight('80vh');
      }
    };

    window.addEventListener('resize', updateChartSize);
    updateChartSize();

    return () => window.removeEventListener('resize', updateChartSize);
  }, []);

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
  

  return (
    <div className={styles.container} key={chartKey}>
      <Head>
        <title>Travels</title>
        <meta
          name="description"
          content="Experience my journey as I travel the world. From interesting insights to crazy travel stories, there is so much to explore"
        />
      </Head>
      <Stack horizontal className={styles.header}>
        <h1>
          Click on a country to see my adventures!
        </h1>
        {userEmail === adminEmail && 
          <Link href="/travel/upload/post" passHref legacyBehavior>
                <Icon iconName="Add" style={{paddingLeft: "10vw", fontSize: "2vw"}}/>
          </Link>
        }
      </Stack>
      <h2>Countries Visited: 8</h2>
      <div className={styles.travelContainer}>
        <div id="regions_div" className={styles.regionsDiv}/>
      </div>
    </div>
  );
};

export default Travel;
