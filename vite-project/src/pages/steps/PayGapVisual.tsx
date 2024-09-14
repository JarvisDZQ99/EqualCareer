// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import axios from 'axios';
// import 'chart.js/auto';

// interface PayGapVisualProps {
//   industry: string;
//   region: string;  
// }

// const PayGapVisual: React.FC<PayGapVisualProps> = ({ industry, region }) => {
//   const [payGapData, setPayGapData] = useState<any>(null);
//   const [regionPayGapData, setRegionPayGapData] = useState<any>(null);  
//   const [loading, setLoading] = useState(false);
//   const [regionLoading, setRegionLoading] = useState(false);  
//   const [error, setError] = useState<string | null>(null);
//   const [regionError, setRegionError] = useState<string | null>(null);
//   const [industrySummary, setIndustrySummary] = useState<string>('');
//   const [regionSummary, setRegionSummary] = useState<string>('');

//   useEffect(() => {
//     fetchGenderPayData();  
//     fetchRegionPayGapData();  
//   }, [industry, region]);  

//   const fetchGenderPayData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap', {
//         params: {
//           industry: industry,
//         }
//       });
//       const responseData = JSON.parse(response.data.body);
//       processPayGapData(responseData);
//     } catch (error) {
//       console.error('Error fetching gender pay data:', error);
//       setError('Failed to fetch gender pay data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRegionPayGapData = async () => {
//     setRegionLoading(true);
//     setRegionError(null);
//     try {
//       const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap_region', {
//         params: {
//           state: region,  
//         }
//       });
//       const responseData = JSON.parse(response.data.body);
//       processRegionPayGapData(responseData);
//     } catch (error) {
//       console.error('Error fetching region pay gap data:', error);
//       setRegionError('Failed to fetch region pay gap data');
//     } finally {
//       setRegionLoading(false);
//     }
//   };

//   const normalizeString = (str: string) => {
//     return str.replace(/&/g, 'and').trim().toLowerCase();
//   };

//   const processPayGapData = (data: any) => {
//     const dates: string[] = [];
//     const maleSalaries: number[] = [];
//     const femaleSalaries: number[] = [];
  
//     const filteredData = data.filter((item: any) => 
//       normalizeString(item.industry) === normalizeString(industry)
//     );
  
//     if (filteredData.length === 0) {
//       console.warn('No data found for selected industry');
//       setError('No pay gap data found for the selected industry.');
//       return;
//     }
  
//     filteredData.forEach((item: any) => {
//       const [year, month] = item.time_period.split('-');
//       const formattedDate = `${year}-${month}`; 
//       dates.push(formattedDate);
//       maleSalaries.push(item.males_earnings);
//       femaleSalaries.push(item.females_earnings);
//     });
  
//     const sortedData = dates.map((date, index) => ({
//       date,
//       maleSalary: maleSalaries[index],
//       femaleSalary: femaleSalaries[index],
//     })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
//     const sortedDates = sortedData.map(item => item.date);
//     const sortedMaleSalaries = sortedData.map(item => item.maleSalary);
//     const sortedFemaleSalaries = sortedData.map(item => item.femaleSalary);
  
//     setPayGapData({
//       dates: sortedDates,
//       maleSalaries: sortedMaleSalaries,
//       femaleSalaries: sortedFemaleSalaries
//     });

//     const latestMaleSalary = sortedMaleSalaries[sortedMaleSalaries.length - 1];
//     const latestFemaleSalary = sortedFemaleSalaries[sortedFemaleSalaries.length - 1];
//     const averageMaleSalary = sortedMaleSalaries.reduce((a, b) => a + b, 0) / sortedMaleSalaries.length;
//     const averageFemaleSalary = sortedFemaleSalaries.reduce((a, b) => a + b, 0) / sortedFemaleSalaries.length;
//     const latestPayGap = ((latestMaleSalary - latestFemaleSalary) / latestMaleSalary) * 100;
//     const averagePayGap = ((averageMaleSalary - averageFemaleSalary) / averageMaleSalary) * 100;

//     setIndustrySummary(generateDescription(industry, latestPayGap, averagePayGap, latestFemaleSalary, averageFemaleSalary));
//   };
  
//   const processRegionPayGapData = (data: any) => {
//     const dates: string[] = [];
//     const maleSalaries: number[] = [];
//     const femaleSalaries: number[] = [];

//     const filteredData = data.filter((item: any) => 
//       normalizeString(item.state) === normalizeString(region)
//     );

//     if (filteredData.length === 0) {
//       console.warn('No data found for selected region');
//       setRegionError('No pay gap data found for the selected region.');
//       return;
//     }

//     filteredData.forEach((item: any) => {
//       const [year, month] = item.y_m.split('-');  
//       const formattedDate = `${year}-${month}`;
//       dates.push(formattedDate);
//       maleSalaries.push(item.males);
//       femaleSalaries.push(item.females);
//     });
  
//     setRegionPayGapData({
//       dates,
//       maleSalaries,
//       femaleSalaries
//     });

//     const latestMaleSalary = maleSalaries[maleSalaries.length - 1];
//     const latestFemaleSalary = femaleSalaries[femaleSalaries.length - 1];
//     const averageMaleSalary = maleSalaries.reduce((a, b) => a + b, 0) / maleSalaries.length;
//     const averageFemaleSalary = femaleSalaries.reduce((a, b) => a + b, 0) / femaleSalaries.length;
//     const latestPayGap = ((latestMaleSalary - latestFemaleSalary) / latestMaleSalary) * 100;
//     const averagePayGap = ((averageMaleSalary - averageFemaleSalary) / averageMaleSalary) * 100;

//     setRegionSummary(generateDescription(region, latestPayGap, averagePayGap, latestFemaleSalary, averageFemaleSalary, true));
//   };

//   const generateDescription = (context: string, latestGap: number, averageGap: number, latestFemaleSalary: number, averageFemaleSalary: number, isRegion: boolean = false) => {
//     const contextType = isRegion ? "region" : "industry";
//     let description = `In the ${context} ${contextType}, women currently earn ${latestGap.toFixed(1)}% less than men on average. `;
    
//     if (latestGap > averageGap) {
//       description += `The pay gap has widened compared to the historical average. `;
//     } else {
//       description += `The pay gap has narrowed compared to the historical average. `;
//     }

//     if (latestFemaleSalary > averageFemaleSalary) {
//       description += `Women's salaries in this ${contextType} have increased over time.`;
//     } else {
//       description += `Women's salaries in this ${contextType} have decreased over time.`;
//     }

//     return description;
//   };

//   const chartData = {
//     labels: payGapData?.dates || [],
//     datasets: [
//       {
//         label: 'Male Salary',
//         data: payGapData?.maleSalaries || [],
//         borderColor: 'rgba(54, 162, 235, 1)',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         fill: false,
//         borderWidth: 2,
//         tension: 0.4,
//       },
//       {
//         label: 'Female Salary',
//         data: payGapData?.femaleSalaries || [],
//         borderColor: 'rgba(255, 99, 132, 1)',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         fill: false,
//         borderWidth: 2,
//         tension: 0.4,
//       },
//     ],
//   };

//   const regionChartData = {
//     labels: regionPayGapData?.dates || [],
//     datasets: [
//       {
//         label: `Male Salary in ${region}`,  
//         data: regionPayGapData?.maleSalaries || [],
//         borderColor: 'rgba(54, 162, 235, 1)',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         fill: false,
//         borderWidth: 2,
//         tension: 0.4,
//       },
//       {
//         label: `Female Salary in ${region}`, 
//         data: regionPayGapData?.femaleSalaries || [],
//         borderColor: 'rgba(255, 99, 132, 1)',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         fill: false,
//         borderWidth: 2,
//         tension: 0.4,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     animation: {
//       duration: 2000,
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Year',
//         },
//         ticks: {
//           maxTicksLimit: 6,
//           autoSkip: true,
//           maxRotation: 0,
//           minRotation: 0,
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Salary',
//         },
//       },
//     },
//   };

//   const SummaryBox = ({ title, description }: { title: string, description: string }) => (
//     <div style={{
//       backgroundColor: '#f8f9fa',
//       border: '1px solid #e9ecef',
//       borderRadius: '8px',
//       padding: '16px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//       height: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'flex-start'
//     }}>
//       <h4 style={{
//         fontSize: '20px',
//         fontWeight: '600',
//         color: '#343a40',
//         marginBottom: '12px',
//         borderBottom: '2px solid #dee2e6',
//         paddingBottom: '8px'
//       }}>
//         {title}
//       </h4>
//       <p style={{
//         fontSize: '20px',
//         lineHeight: '1.6',
//         color: '#495057',
//         marginBottom: '0'
//       }}>
//         {description}
//       </p>
//     </div>
//   );

//   return (
//     <div style={{ 
//       width: '100%', 
//       display: 'flex', 
//       flexDirection: 'column', 
//       alignItems: 'center', 
//       padding: '0 20px'
//     }}>
//       {loading ? (
//         <p>Loading data...</p>
//       ) : error ? (
//         <p style={{ color: 'red' }}>{error}</p>
//       ) : (
//         <div style={{ 
//           width: '1000px', 
//           marginBottom: '40px'
//         }}>
//           <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
//             Gender Pay Gap Over Time in {industry}
//           </h3>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <div style={{ width: '700px', height: '400px' }}>
//               <Line data={chartData} options={chartOptions} />
//             </div>
//             <div style={{ width: '280px', marginLeft: '20px' }}>
//               <SummaryBox title="Industry Summary" description={industrySummary} />
//             </div>
//           </div>
//         </div>
//       )}
  
//       {regionLoading ? (
//         <p>Loading region data...</p>
//       ) : regionError ? (
//         <p style={{ color: 'red' }}>{regionError}</p>
//       ) : (
//         <div style={{ 
//           width: '1000px', 
//           marginBottom: '40px'
//         }}>
//           <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
//             Gender Pay Gap in {region}
//           </h3>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <div style={{ width: '700px', height: '400px' }}>
//               <Line data={regionChartData} options={chartOptions} />
//             </div>
//             <div style={{ width: '280px', marginLeft: '20px' }}>
//               <SummaryBox title="Region Summary" description={regionSummary} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PayGapVisual;

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import CircularProgress from '@mui/material/CircularProgress';  // Import CircularProgress

interface PayGapVisualProps {
  industry: string;
  region: string;  
}

const PayGapVisual: React.FC<PayGapVisualProps> = ({ industry, region }) => {
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
          text: 'Salary',
        },
      },
    },
  };

  const SummaryBox = ({ title, description }: { title: string, description: string }) => (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      <h4 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#343a40',
        marginBottom: '12px',
        borderBottom: '2px solid #dee2e6',
        paddingBottom: '8px'
      }}>
        {title}
      </h4>
      <p style={{
        fontSize: '20px',
        lineHeight: '1.6',
        color: '#495057',
        marginBottom: '0'
      }}>
        {description}
      </p>
    </div>
  );

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '0 20px'
    }}>
      {loading ? (
        <CircularProgress />  // Show CircularProgress while loading
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div style={{ 
          width: '1000px', 
          marginBottom: '40px'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            Gender Pay Gap Over Time in {industry}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '700px', height: '400px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
            <div style={{ width: '280px', marginLeft: '20px' }}>
              <SummaryBox title="Industry Summary" description={industrySummary} />
            </div>
          </div>
        </div>
      )}
  
      {regionLoading ? (
        <CircularProgress />  // Show CircularProgress while loading region data
      ) : regionError ? (
        <p style={{ color: 'red' }}>{regionError}</p>
      ) : (
        <div style={{ 
          width: '1000px', 
          marginBottom: '40px'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            Gender Pay Gap in {region}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '700px', height: '400px' }}>
              <Line data={regionChartData} options={chartOptions} />
            </div>
            <div style={{ width: '280px', marginLeft: '20px' }}>
              <SummaryBox title="Region Summary" description={regionSummary} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayGapVisual;
