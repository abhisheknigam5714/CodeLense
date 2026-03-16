import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ContributionChart = ({ memberStats, title = 'Team Contribution' }) => {
  const sortedStats = [...(memberStats || [])].sort((a, b) => 
    (b.weeklyCommits || 0) - (a.weeklyCommits || 0)
  );

  const data = {
    labels: sortedStats.map(member => member.name),
    datasets: [
      {
        label: 'Commits This Week',
        data: sortedStats.map(member => member.weeklyCommits || 0),
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Tasks Completed',
        data: sortedStats.map(member => member.weeklyCompletedTasks || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#8b949e',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        color: '#e6edf3',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#8b949e',
          stepSize: 1
        },
        grid: {
          color: 'rgba(48, 54, 61, 0.5)'
        }
      },
      x: {
        ticks: {
          color: '#8b949e'
        },
        grid: {
          display: false
        }
      }
    }
  };

  if (!memberStats || memberStats.length === 0) {
    return (
      <div className="chart-container">
        <h5>{title}</h5>
        <div className="empty-state">
          <p>No data available to display chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ContributionChart;