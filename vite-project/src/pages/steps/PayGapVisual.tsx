import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface PayGapVisualProps {
  payGapData: {
    dates: string[];
    maleSalaries: number[];
    femaleSalaries: number[];
  };
  industry: string;
}

const PayGapVisual: React.FC<PayGapVisualProps> = ({ payGapData, industry }) => {
  const chartData = {
    labels: payGapData?.dates || [],
    datasets: [
      {
        label: 'Male Salary',
        data: payGapData?.maleSalaries || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        borderWidth: 2,
      },
      {
        label: 'Female Salary',
        data: payGapData?.femaleSalaries || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const minSalary = Math.min(...payGapData.maleSalaries, ...payGapData.femaleSalaries);
  const maxSalary = Math.max(...payGapData.maleSalaries, ...payGapData.femaleSalaries);

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
        ticks: {
          maxTicksLimit: 6,
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Salary',
        },
        min: minSalary * 0.8,
        max: maxSalary * 1.2,
        ticks: {
          stepSize: (maxSalary - minSalary) / 5,
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '700px', height: '400px', margin: '20px auto' }}>
        <h3 style={{ textAlign: 'center' }}>Gender Pay Gap Over Time in {industry}</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PayGapVisual;
