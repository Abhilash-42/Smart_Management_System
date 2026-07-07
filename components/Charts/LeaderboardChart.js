'use client';

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

export default function LeaderboardChart({ students }) {
  const topStudents = [...students]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);

  const data = {
    labels: topStudents.map(student => student.name),
    datasets: [
      {
        label: 'Percentage',
        data: topStudents.map(student => student.percentage),
        backgroundColor: topStudents.map((student, index) => {
          const colors = [
            'rgba(16, 185, 129, 0.8)',
            'rgba(52, 211, 153, 0.8)',
            'rgba(96, 165, 250, 0.8)',
            'rgba(147, 197, 253, 0.8)',
            'rgba(167, 139, 250, 0.8)',
            'rgba(196, 181, 253, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(252, 211, 77, 0.8)',
            'rgba(248, 113, 113, 0.8)',
            'rgba(252, 165, 165, 0.8)'
          ];
          return colors[index];
        }),
        borderColor: topStudents.map((student, index) => {
          const colors = [
            'rgba(16, 185, 129, 1)',
            'rgba(52, 211, 153, 1)',
            'rgba(96, 165, 250, 1)',
            'rgba(147, 197, 253, 1)',
            'rgba(167, 139, 250, 1)',
            'rgba(196, 181, 253, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(252, 211, 77, 1)',
            'rgba(248, 113, 113, 1)',
            'rgba(252, 165, 165, 1)'
          ];
          return colors[index];
        }),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.x}%`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
}