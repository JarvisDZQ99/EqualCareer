import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import CircularProgress from '@mui/material/CircularProgress';
import { TrendingUp, TrendingDown, Percent } from 'lucide-react';
import '../styles/PayGapVisual.css';

interface PayGapVisualProps {
  industry: string;
  region: string;
  onPrevious: () => void;
  onNext: (choice: string) => void;
}

interface PayGapData {
  dates: string[];
  maleSalaries: number[];
  femaleSalaries: number[];
}

interface SummaryData {
  description: string;
  payGap: number;
  trend: 'widened' | 'narrowed';
}

const PayGapVisual: React.FC<PayGapVisualProps> = ({ industry, region, onPrevious, onNext }) => {
  const [payGapData, setPayGapData] = useState<PayGapData | null>(null);
  const [regionPayGapData, setRegionPayGapData] = useState<PayGapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [regionLoading, setRegionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regionError, setRegionError] = useState<string | null>(null);
  const [industrySummary, setIndustrySummary] = useState<SummaryData | null>(null);
  const [regionSummary, setRegionSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    fetchGenderPayData();
    fetchRegionPayGapData();
  }, [industry, region]);

  const fetchGenderPayData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap', {
        params: { industry: industry }
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
        params: { state: region }
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

  const processPayGapData = (data: any[]) => {
    const filteredData = data.filter((item) => 
      normalizeString(item.industry) === normalizeString(industry)
    );

    if (filteredData.length === 0) {
      console.warn('No data found for selected industry');
      setError('No pay gap data found for the selected industry.');
      return;
    }

    const sortedData = filteredData
      .map((item) => ({
        date: item.time_period,
        maleSalary: item.males_earnings,
        femaleSalary: item.females_earnings,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const processedData: PayGapData = {
      dates: sortedData.map((item) => item.date),
      maleSalaries: sortedData.map((item) => item.maleSalary),
      femaleSalaries: sortedData.map((item) => item.femaleSalary),
    };

    setPayGapData(processedData);

    const latestMaleSalary = processedData.maleSalaries[processedData.maleSalaries.length - 1];
    const latestFemaleSalary = processedData.femaleSalaries[processedData.femaleSalaries.length - 1];
    const averageMaleSalary = processedData.maleSalaries.reduce((a, b) => a + b, 0) / processedData.maleSalaries.length;
    const averageFemaleSalary = processedData.femaleSalaries.reduce((a, b) => a + b, 0) / processedData.femaleSalaries.length;
    const latestPayGap = ((latestMaleSalary - latestFemaleSalary) / latestMaleSalary) * 100;
    const averagePayGap = ((averageMaleSalary - averageFemaleSalary) / averageMaleSalary) * 100;

    setIndustrySummary(generateDescription(industry, latestPayGap, averagePayGap, latestFemaleSalary, averageFemaleSalary));
  };

  const processRegionPayGapData = (data: any[]) => {
    const filteredData = data.filter((item) => 
      normalizeString(item.state) === normalizeString(region)
    );

    if (filteredData.length === 0) {
      console.warn('No data found for selected region');
      setRegionError('No pay gap data found for the selected region.');
      return;
    }

    const processedData: PayGapData = {
      dates: filteredData.map((item) => item.y_m),
      maleSalaries: filteredData.map((item) => item.males),
      femaleSalaries: filteredData.map((item) => item.females),
    };

    setRegionPayGapData(processedData);

    const latestMaleSalary = processedData.maleSalaries[processedData.maleSalaries.length - 1];
    const latestFemaleSalary = processedData.femaleSalaries[processedData.femaleSalaries.length - 1];
    const averageMaleSalary = processedData.maleSalaries.reduce((a, b) => a + b, 0) / processedData.maleSalaries.length;
    const averageFemaleSalary = processedData.femaleSalaries.reduce((a, b) => a + b, 0) / processedData.femaleSalaries.length;
    const latestPayGap = ((latestMaleSalary - latestFemaleSalary) / latestMaleSalary) * 100;
    const averagePayGap = ((averageMaleSalary - averageFemaleSalary) / averageMaleSalary) * 100;

    setRegionSummary(generateDescription(region, latestPayGap, averagePayGap, latestFemaleSalary, averageFemaleSalary, true));
  };

  const generateDescription = (context: string, latestGap: number, averageGap: number, latestFemaleSalary: number, averageFemaleSalary: number, isRegion: boolean = false): SummaryData => {
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

    return {
      description,
      payGap: latestGap,
      trend: latestGap > averageGap ? 'widened' : 'narrowed'
    };
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

  const SummaryBox = ({ title, description, payGap, trend }: { title: string } & SummaryData) => {
    const isTrendPositive = trend === 'narrowed';
    const TrendIcon = isTrendPositive ? TrendingDown : TrendingUp;
    const trendColor = isTrendPositive ? 'text-green-500' : 'text-red-500';

    return (
      <div className="summary-box">
        <h4 className="summary-title">{title}</h4>
        <div className="summary-content">
          <div className="pay-gap-info">
            <Percent className="pay-gap-icon" />
            <span className="pay-gap-value">{payGap.toFixed(1)}%</span>
          </div>
          <div className={`trend-info ${trendColor}`}>
            <TrendIcon className="trend-icon" />
            <span className="trend-text">
              {isTrendPositive ? 'Gap Narrowed' : 'Gap Widened'}
            </span>
          </div>
        </div>
        <p className="summary-description">{description}</p>
      </div>
    );
  };

  const handleShowLabourForce = () => {
    onNext('show-labour-force');
  };

  return (
    <div className="paygap-container">
      <h2 className="page-title">Pay Gap Analysis</h2>
      <div className="user-info-form-info-box">
        <span className="user-info-form-info-icon">ℹ</span>
        The charts below provide insights into the gender pay gap over time in your selected industry and region. <br />
        You can analyze the data and compare the average salaries of men and women in the charts. 
      </div>
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
                {industrySummary && <SummaryBox title="Industry Summary" {...industrySummary} />}
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
                {regionSummary && <SummaryBox title="Region Summary" {...regionSummary} />}
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
      <p className="wgea-resource">
        For more information on gender equality in the workplace, visit the 
        <a href="https://www.wgea.gov.au" target="_blank" rel="noopener noreferrer" className="wgea-link"> Workplace Gender Equality Agency (WGEA)</a>.
      </p>
    </div>
  );
};

export default PayGapVisual;

