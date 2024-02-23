import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type SpiderChartProps = {
  data: ChartData[];
};

type ChartData = {
  subject: string;
  A: number;
  fullMark: number;
};

export const SpiderChart: React.FC<SpiderChartProps> = ({ data }) => {
  // Prepare the data in the format expected by Chart.js

  
  const chartData = {
    labels: data.map(d => d.subject),
    datasets: [{
      label: 'Resultados',
      data: data.map(d => d.A),
      backgroundColor: 'rgba(136, 132, 216, 0.6)',
      borderColor: 'rgba(136, 132, 216, 1)',
      borderWidth: 1,
      pointBackgroundColor: 'rgba(136, 132, 216, 1)',
    }]
  };

  // Define options for the Radar chart
  const options = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
         ticks: {
        display: false // Hide the scale numbers
      },
        suggestedMin: 0,
        suggestedMax: Math.max(...data.map(d => d.A)) -40
      }
    },
    elements: {
      line: {
        borderWidth: 2
      }
    }
  };

  return (
    <div style={{ width: '100%',height:'550px', display:"flex",paddingTop:20, justifyContent:"center" }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};
