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

interface CombinedSummaryData {
  description: string;
  industryPayGap: number;
  regionPayGap: number;
  recommendation: string;
  industryMedianSalary: number;
  regionMedianSalary: number;
}

const PayGapVisual: React.FC<PayGapVisualProps> = ({ industry, region, onPrevious, onNext }) => {
  const [data, setData] = useState<{ industry: PayGapData | null; region: PayGapData | null }>({ industry: null, region: null });
  const [loading, setLoading] = useState<{ industry: boolean; region: boolean }>({ industry: false, region: false });
  const [error, setError] = useState<{ industry: string | null; region: string | null }>({ industry: null, region: null });
  const [summary, setSummary] = useState<{ industry: SummaryData | null; region: SummaryData | null }>({ industry: null, region: null });
  const [combinedSummary, setCombinedSummary] = useState<CombinedSummaryData | null>(null);

  useEffect(() => {
    fetchData('industry', industry);
    fetchData('region', region);
  }, [industry, region]);

  useEffect(() => {
    if (summary.industry && summary.region && data.industry && data.region) {
      setCombinedSummary(generateCombinedSummary(summary.industry, summary.region, data.industry, data.region));
    }
  }, [summary.industry, summary.region, data.industry, data.region]);

  const fetchData = async (type: 'industry' | 'region', param: string) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));
    try {
      const url = type === 'industry' 
        ? 'https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap'
        : 'https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap_region';
      const response = await axios.get(url, { params: { [type]: param } });
      const responseData = JSON.parse(response.data.body);
      processData(type, responseData, param);
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      setError(prev => ({ ...prev, [type]: `Failed to fetch ${type} data` }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const processData = (type: 'industry' | 'region', data: any[], param: string) => {
    const normalizeString = (str: string | undefined) => str ? str.replace(/&/g, 'and').trim().toLowerCase() : '';
    const filteredData = data.filter(item => {
      const itemValue = type === 'industry' ? item.industry : item.state;
      return normalizeString(itemValue) === normalizeString(param);
    });

    if (filteredData.length === 0) {
      setError(prev => ({ ...prev, [type]: `No pay gap data found for the selected ${type}.` }));
      return;
    }

    const sortedData = filteredData
      .map(item => ({
        date: item.time_period || item.y_m,
        maleSalary: item.males_earnings || item.males,
        femaleSalary: item.females_earnings || item.females,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const processedData: PayGapData = {
      dates: sortedData.map(item => item.date),
      maleSalaries: sortedData.map(item => item.maleSalary),
      femaleSalaries: sortedData.map(item => item.femaleSalary),
    };

    setData(prev => ({ ...prev, [type]: processedData }));

    const latestMaleSalary = processedData.maleSalaries[processedData.maleSalaries.length - 1];
    const latestFemaleSalary = processedData.femaleSalaries[processedData.femaleSalaries.length - 1];
    const averageMaleSalary = processedData.maleSalaries.reduce((a, b) => a + b, 0) / processedData.maleSalaries.length;
    const averageFemaleSalary = processedData.femaleSalaries.reduce((a, b) => a + b, 0) / processedData.femaleSalaries.length;
    const latestPayGap = ((latestMaleSalary - latestFemaleSalary) / latestMaleSalary) * 100;
    const averagePayGap = ((averageMaleSalary - averageFemaleSalary) / averageMaleSalary) * 100;

    const summaryData = type === 'industry' 
    ? generateIndustrySummary(param, latestPayGap, averagePayGap, latestFemaleSalary, averageFemaleSalary)
    : generateRegionSummary(param, latestPayGap, averagePayGap, latestFemaleSalary, averageFemaleSalary);

  setSummary(prev => ({ ...prev, [type]: summaryData }));
};

  const generateIndustrySummary = (industry: string, latestGap: number, averageGap: number, latestFemaleSalary: number, averageFemaleSalary: number): SummaryData => {
    let description = `In the ${industry} industry, `;
  
    if (latestGap <= 5) {
      description += `the gender pay gap is relatively small at ${latestGap.toFixed(1)}%. This industry shows promising progress towards pay equity. `;
    } else if (latestGap <= 15) {
      description += `there is a moderate gender pay gap of ${latestGap.toFixed(1)}%. While some progress has been made, there's still room for improvement. `;
    } else {
      description += `there is a substantial gender pay gap of ${latestGap.toFixed(1)}%. This indicates significant pay inequity that needs to be addressed. `;
    }
  
    if (latestGap > averageGap) {
      description += `The pay gap has widened compared to the historical average of ${averageGap.toFixed(1)}%, which is a concerning trend. `;
    } else {
      description += `The pay gap has narrowed compared to the historical average of ${averageGap.toFixed(1)}%, showing positive progress. `;
    }
  
    description += latestFemaleSalary > averageFemaleSalary 
      ? `Women's salaries in this industry have increased over time.` 
      : `Women's salaries in this industry have decreased over time.`;
  
    return {
      description,
      payGap: latestGap,
      trend: latestGap > averageGap ? 'widened' : 'narrowed'
    };
  };
  
  const generateRegionSummary = (region: string, latestGap: number, averageGap: number, latestFemaleSalary: number, averageFemaleSalary: number): SummaryData => {
    let description = `In ${region}, `;
  
    if (latestGap <= 5) {
      description += `the gender pay gap is relatively small at ${latestGap.toFixed(1)}%. This region has made significant progress towards pay equity. `;
    } else if (latestGap <= 15) {
      description += `there is a moderate gender pay gap of ${latestGap.toFixed(1)}%. While progress has been made, there's still room for improvement in achieving pay equity. `;
    } else {
      description += `there is a substantial gender pay gap of ${latestGap.toFixed(1)}%. This suggests that significant efforts are needed to address pay inequity in this region. `;
    }
  
    if (latestGap > averageGap) {
      description += `The pay gap has widened compared to the historical average of ${averageGap.toFixed(1)}%, which is a concerning trend. `;
    } else {
      description += `The pay gap has narrowed compared to the historical average of ${averageGap.toFixed(1)}%, showing positive progress. `;
    }
  
    description += latestFemaleSalary > averageFemaleSalary 
      ? `Women's salaries in this region have increased over time.` 
      : `Women's salaries in this region have decreased over time.`;
  
    return {
      description,
      payGap: latestGap,
      trend: latestGap > averageGap ? 'widened' : 'narrowed'
    };
  };

  const generateCombinedSummary = (industrySummary: SummaryData, regionSummary: SummaryData, industryData: PayGapData, regionData: PayGapData): CombinedSummaryData => {
    const industryPayGap = industrySummary.payGap;
    const regionPayGap = regionSummary.payGap;
    
    const industryMedianSalary = calculateMedianSalary(industryData);
    const regionMedianSalary = calculateMedianSalary(regionData);
    
    let description = `As a woman in the ${industry} industry located in ${region}, you're facing a complex pay gap situation. `;
    description += `In your industry, women earn ${industryPayGap.toFixed(1)}% less than men, while in your region, the gap is ${regionPayGap.toFixed(1)}%. `;
    
    if (industryPayGap < regionPayGap) {
      description += `Your industry actually has a smaller pay gap than your region overall, which is a positive sign. `;
    } else {
      description += `Your industry has a larger pay gap than your region overall, which presents some challenges. `;
    }

    description += `The industry gap has ${industrySummary.trend}, while the regional gap has ${regionSummary.trend}. `;

    let recommendation = "Based on this data, ";
    if (industryPayGap < regionPayGap) {
      recommendation += "you might consider focusing on career growth within your current industry, while potentially exploring opportunities in other regions with smaller pay gaps. ";
    } else {
      recommendation += "you might want to explore opportunities in industries with smaller pay gaps, or consider advocating for pay equity initiatives within your current workplace. ";
    }
    recommendation += "Remember, these are general trends, and individual experiences may vary. It's always beneficial to negotiate your salary and advocate for your worth in the workplace.";

    return {
      description,
      industryPayGap,
      regionPayGap,
      recommendation,
      industryMedianSalary,
      regionMedianSalary
    };
  };

  const calculateMedianSalary = (data: PayGapData): number => {
    const allSalaries = [...data.maleSalaries, ...data.femaleSalaries].sort((a, b) => a - b);
    const mid = Math.floor(allSalaries.length / 2);
    return allSalaries.length % 2 !== 0 ? allSalaries[mid] : (allSalaries[mid - 1] + allSalaries[mid]) / 2;
  };

  const createChartData = (payGapData: PayGapData | null, labels: string[]) => ({
    labels: payGapData?.dates || [],
    datasets: [
      {
        label: labels[0],
        data: payGapData?.maleSalaries || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: labels[1],
        data: payGapData?.femaleSalaries || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 2000 },
    scales: {
      x: {
        title: { display: true, text: 'Year' },
        ticks: { maxTicksLimit: 6, autoSkip: true, maxRotation: 0, minRotation: 0 },
      },
      y: {
        title: { display: true, text: 'Weekly Salary (AUD)' },
        ticks: { callback: (value: any) => '$' + value.toLocaleString() }
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
            <span className="trend-text">{isTrendPositive ? 'Gap Narrowed' : 'Gap Widened'}</span>
          </div>
        </div>
        <p className="summary-description">{description}</p>
      </div>
    );
  };

  const ChartContainer = ({ title, chartData, summaryData, summaryType }: { title: string, chartData: any, summaryData: SummaryData | null, summaryType: 'industry' | 'region' }) => (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        <div className="chart">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="summary-container">
          {summaryData && <SummaryBox title={`${summaryType.charAt(0).toUpperCase() + summaryType.slice(1)} Summary`} {...summaryData} />}
        </div>
      </div>
    </div>
  );

  const CombinedSummaryBox = ({ data }: { data: CombinedSummaryData }) => {
    const salaryDifference = data.industryMedianSalary - data.regionMedianSalary;
    const salaryDifferencePercentage = (salaryDifference / data.regionMedianSalary) * 100;

    return (
      <div className="combined-summary-box">
        <h4 className="summary-title">Combined Industry and Region Analysis</h4>
        <p className="summary-description">{data.description}</p>
        <div className="salary-comparison">
          <h5 className="salary-comparison-title">Salary Comparison</h5>
          <p>
            The median salary in your industry is{' '}
            <span className={`salary-difference ${salaryDifference >= 0 ? 'positive' : 'negative'}`}>
              {salaryDifference >= 0 ? 'higher' : 'lower'} by ${Math.abs(salaryDifference).toFixed(2)} 
              ({Math.abs(salaryDifferencePercentage).toFixed(1)}%)
            </span>{' '}
            compared to the median salary in your region.
          </p>
        </div>
        <p className="summary-recommendation">{data.recommendation}</p>
      </div>
    );
  };

  return (
    <div className="paygap-container">
      <h2 className="page-title">Pay Gap Analysis</h2>
      <div className="user-info-form-info-box">
        <span className="user-info-form-info-icon">ℹ</span>
        The charts below provide insights into the gender pay gap over time in your selected industry and region. <br />
        You can analyze the data and compare the average salaries of men and women in the charts. 
      </div>
      {loading.industry || loading.region ? (
        <CircularProgress />
      ) : error.industry || error.region ? (
        <p className="error-message">{error.industry || error.region}</p>
      ) : (
        <>
          <ChartContainer 
            title={`Gender Pay Gap Over Time in ${industry}`}
            chartData={createChartData(data.industry, ['Male Salary', 'Female Salary'])}
            summaryData={summary.industry}
            summaryType="industry"
          />
          <ChartContainer 
            title={`Gender Pay Gap in ${region}`}
            chartData={createChartData(data.region, [`Male Salary in ${region}`, `Female Salary in ${region}`])}
            summaryData={summary.region}
            summaryType="region"
          />
          {combinedSummary && <CombinedSummaryBox data={combinedSummary} />}
        </>
      )}
      <div className="button-container">
        <button className="button secondary" onClick={onPrevious}>Previous</button>
        <button className="button primary" onClick={() => onNext('show-labour-force')}>Show Labour Force Info</button>
      </div>
      <p className="wgea-resource">
        For resources and more information on gender equality in the workplace, visit the  
        <a href="https://www.wgea.gov.au" target="_blank" rel="noopener noreferrer" className="wgea-link"> Workplace Gender Equality Agency (WGEA)</a>.
      </p>
    </div>
  );
};

export default PayGapVisual;
