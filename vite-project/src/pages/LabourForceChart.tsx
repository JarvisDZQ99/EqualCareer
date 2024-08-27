import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LabourForceChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EmploymentData {
  industry: string;
  men: number;
  women: number;
  total_employees: number;
  gap_ratio: number;
}

interface APIResponse {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
}

const AverageDifference: React.FC<{ data: EmploymentData[] }> = ({ data }) => {
  const calculateAverageDifference = () => {
    const totalDifference = data.reduce((sum, item) => {
      const menPercentage = (item.men / item.total_employees) * 100;
      const womenPercentage = (item.women / item.total_employees) * 100;
      return sum + Math.abs(menPercentage - womenPercentage);
    }, 0);
    return (totalDifference / data.length).toFixed(2);
  };

  return (
    <div className="average-difference">
      <h3>Average Gender Difference: {calculateAverageDifference()}%</h3>
    </div>
  );
};

const LabourForceChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  });
  const [employmentData, setEmploymentData] = useState<EmploymentData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cleanAndValidateData = (data: EmploymentData[]): EmploymentData[] => {
    return data.map(item => ({
      ...item,
      industry: item.industry.split(',')[0].trim(), 
      men: Math.max(0, Math.min(item.men, item.total_employees)),
      women: Math.max(0, Math.min(item.women, item.total_employees)),
      total_employees: Math.max(item.men + item.women, item.total_employees)
    })).filter(item => item.total_employees > 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<APIResponse>('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/labour-force');
        console.log('API Response:', response.data);

        if (response.data.statusCode !== 200) {
          throw new Error(`API returned status code ${response.data.statusCode}`);
        }

        let data: EmploymentData[] = JSON.parse(response.data.body);
        data = cleanAndValidateData(data);

        if (data.length === 0) {
          throw new Error('No valid data received from API');
        }

        setEmploymentData(data);

        const industries = data.map(item => item.industry);
        const menPercentage = data.map(item => (item.men / item.total_employees) * 100);
        const womenPercentage = data.map(item => (item.women / item.total_employees) * 100);

        setChartData({
          labels: industries,
          datasets: [
            {
              label: 'Men',
              data: menPercentage,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Women',
              data: womenPercentage,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Gender Employment Ratios Across Industries',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(1) + '%';
                }
                return label;
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

  return (
    <div className="container">
      <Header />
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <AverageDifference data={employmentData} />
          <div className="chart">
            <Bar data={chartData} options={options} />
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default LabourForceChart;
