import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const StackedBarChart = ({ data }) => {
  // Group data by scope
  const scope1Data = data.filter(item => item.scope === 'Scope 1');
  const scope2Data = data.filter(item => item.scope === 'Scope 2');
  const scope3Data = data.filter(item => item.scope === 'Scope 3');

  // Get all unique category names
  const categories = [...new Set(data.map(item => item.name))];

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Scope 1',
        data: categories.map(cat => {
          const item = scope1Data.find(d => d.name === cat);
          return item ? item.value : 0;
        }),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Scope 2',
        data: categories.map(cat => {
          const item = scope2Data.find(d => d.name === cat);
          return item ? item.value : 0;
        }),
        backgroundColor: 'rgba(22, 163, 74, 0.7)',
        borderColor: 'rgba(22, 163, 74, 1)',
        borderWidth: 1,
      },
      {
        label: 'Scope 3',
        data: categories.map(cat => {
          const item = scope3Data.find(d => d.name === cat);
          return item ? item.value : 0;
        }),
        backgroundColor: 'rgba(220, 38, 38, 0.7)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value.toLocaleString()} kg CO₂-e`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'kg CO₂-e'
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
