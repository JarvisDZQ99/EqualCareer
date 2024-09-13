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
//     }
  
//     filteredData.forEach((item: any) => {
//       const [year, month] = item.time_period.split('-');
//       const formattedDate = `${month}-${year}`; 
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
//       const formattedDate = `${month}-${year}`;
//       dates.push(formattedDate);
//       maleSalaries.push(item.males);
//       femaleSalaries.push(item.females);
//     });
  
//     setRegionPayGapData({
//       dates,
//       maleSalaries,
//       femaleSalaries
//     });
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

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
//       {loading ? (
//         <p>Loading data...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <div style={{ width: '700px', maxWidth: '900px', margin: '20px 0', textAlign: 'center' }}>
//           <h3>Gender Pay Gap Over Time in {industry}</h3>
//           <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <Line data={chartData} options={chartOptions} />
//           </div>
//         </div>
//       )}

//       {regionLoading ? (
//         <p>Loading region data...</p>
//       ) : regionError ? (
//         <p className="text-red-500">{regionError}</p>
//       ) : (
//         <div style={{ width: '700px', maxWidth: '900px', margin: '20px 0', textAlign: 'center' }}>
//           <h3>Gender Pay Gap Over Time in {region}</h3>
//           <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <Line data={regionChartData} options={chartOptions} />
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
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p>{description}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4">
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full my-8">
          <h3 className="text-2xl font-bold mb-4 text-center">Gender Pay Gap Over Time in {industry}</h3>
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="w-full md:w-2/3 h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className="w-full md:w-1/3 mt-4 md:mt-0 md:ml-4">
              <SummaryBox title="Industry Summary" description={industrySummary} />
            </div>
          </div>
        </div>
      )}

      {regionLoading ? (
        <p>Loading region data...</p>
      ) : regionError ? (
        <p className="text-red-500">{regionError}</p>
      ) : (
        <div className="w-full my-8">
          <h3 className="text-2xl font-bold mb-4 text-center">Gender Pay Gap in {region}</h3>
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="w-full md:w-2/3 h-96">
              <Line data={regionChartData} options={chartOptions} />
            </div>
            <div className="w-full md:w-1/3 mt-4 md:mt-0 md:ml-4">
              <SummaryBox title="Region Summary" description={regionSummary} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayGapVisual;