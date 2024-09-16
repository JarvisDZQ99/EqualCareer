import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import CircularProgress from '@mui/material/CircularProgress';
import '../styles/PayGapVisual.css';

interface PayGapVisualProps {
  industry: string;
  region: string;
  onPrevious: () => void;
  onNext: (choice: string) => void;
}

const PayGapVisual: React.FC<PayGapVisualProps> = ({ industry, region, onPrevious, onNext }) => {
  const [payGapData, setPayGapData] = useState<any>(null);
  const [regionPayGapData, setRegionPayGapData] = useState<any>(null);  
  const [loading, setLoading] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);  
  const [error, setError] = useState<string | null>(null);
  const [regionError, setRegionError] = useState<string | null>(null);
  const [industrySummary, setIndustrySummary] = useState<string>('');
  const [regionSummary, setRegionSummary] = useState<string>('');

  useEffect(() => {
    fetchGenderPayData();  
    fetchRegionPayGapData();  
  }, [industry, region]);

  const fetchGenderPayData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap', {
        params: {
          industry: industry,
        }
      });
      const responseData = JSON.parse(response.data.body);
      processPayGapData(responseData);
    } catch (error) {
      console.error('Error fetching gender pay data:', error);
      setError('Failed to fetch gender pay data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionPayGapData = async () => {
    setRegionLoading(true);
    setRegionError(null);
    try {
      const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap_region', {
        params: {
          state: region,  
        }
      });
      const responseData = JSON.parse(response.data.body);
      processRegionPayGapData(responseData);
    } catch (error) {
      console.error('Error fetching region pay gap data:', error);
      setRegionError('Failed to fetch region pay gap data');
    } finally {
      setRegionLoading(false);
    }
  };

  const normalizeString = (str: string) => {
    return str.replace(/&/g, 'and').trim().toLowerCase();
  };

  const processPayGapData = (data: any) => {
    const dates: string[] = [];
    const maleSalaries: number[] = [];
    const femaleSalaries: number[] = [];
  
    const filteredData = data.filter((item: any) => 
      normalizeString(item.industry) === normalizeString(industry)
    );
  
    if (filteredData.length === 0) {
      console.warn('No data found for selected industry');
      setError('No pay gap data found for the selected industry.');
      return;
    }
  
    filteredData.forEach((item: any) => {
      const [year, month] = item.time_period.split('-');
      const formattedDate = `${year}-${month}`; 
      dates.push(formattedDate);
      maleSalaries.push(item.males_earnings);
      femaleSalaries.push(item.females_earnings);
    });
  
    const sortedData = dates.map((date, index) => ({
      date,
      maleSalary: maleSalaries[index],
      femaleSalary: femaleSalaries[index],
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    const sortedDates = sortedData.map(item => item.date);
    const sortedMaleSalaries = sortedData.map(item => item.maleSalary);
    const sortedFemaleSalaries = sortedData.map(item => item.femaleSalary);
  
    setPayGapData({
      dates: sortedDates,
      maleSalaries: sortedMaleSalaries,
      femaleSalaries: sortedFemaleSalaries
    });

    const latestMaleSalary = sortedMaleSalaries[sortedMaleSalaries.length - 1];
    const latestFemaleSalary = sortedFemaleSalaries[sortedFemaleSalaries.length - 1];
    const averageMaleSalary = sortedMaleSalaries.reduce((a, b) => a + b, 0) / sortedMaleSalaries.length;
    const averageFemaleSalary = sortedFemaleSalaries.reduce((a, b) => a + b, 0) / sortedFemaleSalaries.length;
    const latestPayGap = ((latestMaleSalary - latestFemaleSalary) / latestMaleSalary) * 100;
    const averagePayGap = ((averageMaleSalary - averageFemaleSalary) / averageMaleSalary) * 100;

    setIndustrySummary(generateDescription(industry, latestPayGap, averagePayGap, latestFemaleSalary, averageFemaleSalary));
  };
  
  const processRegionPayGapData = (data: any) => {
    const dates: string[] = [];
    const maleSalaries: number[] = [];
    const femaleSalaries: number[] = [];

    const filteredData = data.filter((item: any) => 
      normalizeString(item.state) === normalizeString(region)
    );

    if (filteredData.length === 0) {
      console.warn('No data found for selected region');
      setRegionError('No pay gap data found for the selected region.');
      return;
    }

    filteredData.forEach((item: any) => {
      const [year, month] = item.y_m.split('-');  
      const formattedDate = `${year}-${month}`;
      dates.push(formattedDate);
      maleSalaries.push(item.males);
      femaleSalaries.push(item.females);
    });
  
    setRegionPayGapData({
      dates,
      maleSalaries,
      femaleSalaries
    });

    const latestMaleSalary = maleSalaries[maleSalaries.length - 1];
    const latestFemaleSalary = femaleSalaries[femaleSalaries.length - 1];
    const averageMaleSalary = maleSalaries.reduce((a, b) => a + b, 0) / maleSalaries.length;
    const averageFemaleSalary = femaleSalaries.reduce((a, b) => a + b, 0) / femaleSalaries.length;
    const latestPayGap = ((latestMaleSalary - latestFemaleSalary) / latestMaleSalary) * 100;
    const averagePayGap = ((averageMaleSalary - averageFemaleSalary) / averageMaleSalary) * 100;

    setRegionSummary(generateDescription(region, latestPayGap, averagePayGap, latestFemaleSalary, averageFemaleSalary, true));
  };

  const generateDescription = (context: string, latestGap: number, averageGap: number, latestFemaleSalary: number, averageFemaleSalary: number, isRegion: boolean = false) => {
    const contextType = isRegion ? "region" : "industry";
    let description = `In the ${context} ${contextType}, women currently earn ${latestGap.toFixed(1)}% less than men on average. `;
    
    if (latestGap > averageGap) {
      description += `The pay gap has widened compared to the historical average. `;
    } else {
      description += `The pay gap has narrowed compared to the historical average. `;
    }

    if (latestFemaleSalary > averageFemaleSalary) {
      description += `Women's salaries in this ${contextType} have increased over time.`;
    } else {
      description += `Women's salaries in this ${contextType} have decreased over time.`;
    }

    return description;
  };

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
        tension: 0.4,
      },
      {
        label: 'Female Salary',
        data: payGapData?.femaleSalaries || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const regionChartData = {
    labels: regionPayGapData?.dates || [],
    datasets: [
      {
        label: `Male Salary in ${region}`,  
        data: regionPayGapData?.maleSalaries || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: `Female Salary in ${region}`, 
        data: regionPayGapData?.femaleSalaries || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
    },
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
          text: 'Weekly Salary (AUD)',
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  const SummaryBox = ({ title, description }: { title: string, description: string }) => (
    <div className="summary-box">
      <h4 className="summary-title">{title}</h4>
      <p className="summary-description">{description}</p>
    </div>
  );

  const handleShowLabourForce = () => {
    onNext('show-labour-force');  
  };

  return (
    <div className="paygap-container">
      <h2 className="page-title">Pay Gap Analysis</h2>
      
      {loading || regionLoading ? (
        <CircularProgress />
      ) : error || regionError ? (
        <p className="error-message">{error || regionError}</p>
      ) : (
        <>
          <div className="chart-container">
            <h3 className="chart-title">
              Gender Pay Gap Over Time in {industry}
            </h3>
            <div className="chart-content">
              <div className="chart">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="summary-container">
                <SummaryBox title="Industry Summary" description={industrySummary} />
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">
              Gender Pay Gap in {region}
            </h3>
            <div className="chart-content">
              <div className="chart">
                <Line data={regionChartData} options={chartOptions} />
              </div>
              <div className="summary-container">
                <SummaryBox title="Region Summary" description={regionSummary} />
              </div>
            </div>
          </div>
        </>
      )}

    <div className="button-container">
        <button className="button secondary" onClick={onPrevious}>
          Previous
        </button>
        <button className="button primary" onClick={handleShowLabourForce}>
          Show Labour Force Info
        </button>
      </div>
    </div>
    
  );
};

export default PayGapVisual;