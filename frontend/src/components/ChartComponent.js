// ChartComponent.js
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function ChartComponent({ data }) {
  const chartData = {
    labels: ['Total Students', 'Pending Fees', 'Paid Fees'],
    datasets: [{
      label: 'Students Count',
      data: [data.total, data.pending, data.paid],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Fee Status Overview',
        font: {
          size: 18
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#666',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        ticks: {
          color: '#666',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className='h-96 bg-white p-4 rounded-xl shadow-lg'>
      <Bar data={chartData} options={options} />
    </div>
  );
}