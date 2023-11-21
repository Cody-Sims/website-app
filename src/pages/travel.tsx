// Import statements
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles.travel.module.css';

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
      textStyle: { color: '#212529' }, // Dark text for tooltips
      trigger: 'focus',
      isHtml: true
    },
    legend: 'none',
    borderColor: '#dee2e6', // Lighter border color
    borderWidth: 1
  };

const darkModeOptions = {
    backgroundColor: '#0E0103',
    datalessRegionColor: '#1f2022',
    defaultColor: '#6c757d', 
    colorAxis: {
      colors: ['#44687d', '#c4d6e7']
    },
    tooltip: {
      textStyle: { color: '#ffffff' }, 
      trigger: 'focus',
      isHtml: true
    },
    legend: 'none', 
    borderColor: '#2f2f2f', 
    borderWidth: 1
};


export default function Travel({ isLightMode }: TravelProps) {
    const router = useRouter();
    const [chartOptions, setChartOptions] = useState(isLightMode ? lightModeOptions : darkModeOptions); // State for chart options
  
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
  
      loadGoogleCharts();
  
      // Function to draw the chart
      const drawChart = () => {
        const data = window.google.visualization.arrayToDataTable([
            ['Country', 'Trips', { role: 'tooltip', type: 'string', p: { html: true } }],
            ['United States', -1, '<div style="padding:5px;">United States<br/>Trips: -1</div>'],
            ['Canada', 3, '<div style="padding:5px;">Canada<br/>Trips: 3</div>'],
            ['Spain', 3, '<div style="padding:5px;">Spain<br/>Trips: 3</div>'],
            ['Morocco', 1, '<div style="padding:5px;">Morocco<br/>Trips: 1</div>'],
            ['Vietnam', 1, '<div style="padding:5px;">Vietnam<br/>Trips: 1</div>'],
            ['Thailand', 1, '<div style="padding:5px;">Thailand<br/>Trips: 1</div>'],
            ['United Kingdom', 1, '<div style="padding:5px;">United Kingdom<br/>Trips: 1</div>'], // Corrected the spelling of "United Kingdom"
            ['Ireland', 1, '<div style="padding:5px;">Ireland<br/>Trips: 1</div>']
          ]);
  
        const options = chartOptions; // Use the current chartOptions state
  
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
      };
  
      // Re-draw the chart when chartOptions or isLightMode change
      drawChart();
    }, [chartOptions, isLightMode, router]);
  
    useEffect(() => {
      // Update chartOptions when the theme changes
      setChartOptions(isLightMode ? lightModeOptions : darkModeOptions);
    }, [isLightMode]);
  
    return (
      <div className={styles.travelContainer}>
        <h1>Click on a country to see my adventures!</h1>
        <div id="regions_div" className={styles.regionsDiv} />
      </div>
    );
}