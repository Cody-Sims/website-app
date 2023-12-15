// Import statements
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import styles from '../styles/travel.module.css';

// Add a prop for the theme
type TravelProps = {
  isLightMode: boolean;
};

const lightModeOptions = {
    backgroundColor: 'rgb(237, 237, 237)',
    datalessRegionColor: '#f8f9fa', // Light grey for regions with no data
    defaultColor: '#adb5bd', // A slightly darker shade for regions with data
    colorAxis: {
      colors: ['#8c98a4', '#495057'] // Gradient from lighter to darker grey
    },
    tooltip: {
      textStyle: { color: '#454545' }, // Dark text for tooltips
      trigger: 'focus',
      isHtml: true
    },
    legend: 'none',
    borderColor: '#dee2e6', // Lighter border color
    borderWidth: 1,
  };

const darkModeOptions = {
  backgroundColor: '#0E0103',
  datalessRegionColor: '#1f2022', // Dark grey for regions with no data
  defaultColor: '#6c757d', // Default color for regions with data
  colorAxis: {
    colors: ['#44687d', '#c4d6e7'] // Gradient from darker to lighter blue
  },
  tooltip: {
    textStyle: { color: '#212529' }, // White text for tooltips
    trigger: 'focus',
    isHtml: true
  },
  legend: 'none', // Optionally hide the legend for a cleaner look
  borderColor: '#2f2f2f', // Subtle borders
  borderWidth: 1
};

export default function Travel({ isLightMode }: TravelProps) {
  const router = useRouter();
  const [chartHeight, setChartHeight] = useState('80vh'); // Default height
  const [completeChartOptions, setCompleteChartOptions] = useState({ ...lightModeOptions, height: chartHeight });
  const [isGoogleChartsLoaded, setIsGoogleChartsLoaded] = useState(false);


  const loadGoogleCharts = useCallback(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', {
          packages: ['geochart'],
          callback: () => setIsGoogleChartsLoaded(true),
        });
      };
      document.body.appendChild(script);
    }
  }, []);

    // Load Google Charts when component mounts
    useEffect(() => {
      loadGoogleCharts();
    }, [loadGoogleCharts]);

  useEffect(() => {
    // Function to update chart height based on window size
    const updateChartSize = () => {
      let newHeight;
      if (window.innerWidth < 768) { // For phones
        newHeight = '50vh';
      } else if (window.innerWidth < 1024) { // For tablets
        newHeight = '60vh';
      } else {
        newHeight = '80vh'; // For desktops and larger devices
      }
      setChartHeight(newHeight);
    };

    updateChartSize();
    window.addEventListener('resize', updateChartSize);

    return () => {
      window.removeEventListener('resize', updateChartSize);
    };
  }, []);

  useEffect(() => {
    const modeOptions = isLightMode ? lightModeOptions : darkModeOptions;
    setCompleteChartOptions({ ...modeOptions, height: chartHeight });
  }, [isLightMode, chartHeight]);

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
      ['Vietnam', 1, 'Trips: 1'],
      ['Thailand', 1, 'Trips: 1'],
      ['United Kingdom', 1, 'Trips: 1'],
      ['Ireland', 1, 'Trips: 1']
  ]);      

    const options = completeChartOptions; // Use the current chartOptions state
    const chart = new window.google.visualization.GeoChart(document.getElementById('regions_div'));

    // Add an event listener for the 'select' event
    window.google.visualization.events.addListener(chart, 'select', () => {
      const selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        const country = data.getValue(selectedItem.row, 0);
        console.log('Selected country:', country);
        router.push(`/travel/${country}`);
      }
    });

    chart.draw(data, options);
  }, [completeChartOptions, router, isGoogleChartsLoaded]);

  // Effect for loading Google Charts
  useEffect(() => {
    // Function to load the Google Charts library
    const loadGoogleCharts = () => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', {
          packages: ['geochart'],
          callback: drawChart,
        });
      };
      document.body.appendChild(script);
    };

    if (typeof window !== 'undefined' && !window.google) {
      loadGoogleCharts();
    }
  }, [drawChart]);

  useEffect(() => {
    drawChart();
  }, [completeChartOptions, drawChart]);

  useEffect(() => {
    const travelContainer = document.querySelector('.travelContainer') as HTMLElement;
    const heading = document.querySelector('.travelContainer h1') as HTMLElement;

    const adjustHeadingPosition = () => {
      if (travelContainer && heading) {
        const scrollLeft = travelContainer.scrollLeft;
        const containerWidth = window.innerWidth; // Use the viewport width
        const headingWidth = heading.offsetWidth;
        const leftPosition = (containerWidth - headingWidth) / 2 + scrollLeft;
        heading.style.left = `${leftPosition}px`;
      }
    };

    if (travelContainer) {
      travelContainer.addEventListener('scroll', adjustHeadingPosition);
      window.addEventListener('resize', adjustHeadingPosition);
    }

    adjustHeadingPosition();

    return () => {
      if (travelContainer) {
        travelContainer.removeEventListener('scroll', adjustHeadingPosition);
        window.removeEventListener('resize', adjustHeadingPosition);
      }
    };
  }, []);

    
    return (
      <div className={styles.container}>
        <Head>
          <title>Travels</title>
          <meta
            name="description"
            content="Experience my journey as I travel the world. From interesting insights to crazy travel stories, there is so much to explore"
          />
          </Head>
          <h1>Click on a country to see my adventures!</h1>
          <h2>Countries Visited: 7</h2>
          <div className={styles.travelContainer}>
            <div id="regions_div" className={styles.regionsDiv} />
        </div>
      </div>
    );
}