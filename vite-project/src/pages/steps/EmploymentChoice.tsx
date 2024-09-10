import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; 
import 'chart.js/auto';  

interface EmploymentChoiceProps {
  onNext: (choice: string) => void;
  userData: {
    industry: string;
    region: string;
  };
}

const EmploymentChoice: React.FC<EmploymentChoiceProps> = ({ onNext, userData }) => {
  const [payGapData, setPayGapData] = useState<any>(null);  
  const [loading, setLoading] = useState(false);  
  const [choice, setChoice] = useState(''); 

  useEffect(() => {
    if (choice === 'Already Employed') {
      fetchGenderPayData();
    }
  }, [choice]);

  const fetchGenderPayData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/paygap', {
        params: {
          industry: userData.industry,
          region: userData.region
        }
      });
      const responseData = JSON.parse(response.data.body); 
      processPayGapData(responseData);
    } catch (error) {
      console.error('Error fetching gender pay data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processPayGapData = (data: any) => {
    const dates: string[] = [];
    const maleSalaries: number[] = [];
    const femaleSalaries: number[] = [];
  
    data.forEach((item: any) => {
      if (item.state === userData.region) {
        const [year, month] = item.y_m.split('-');
        const formattedDate = `${month}-${year}`; 
        dates.push(formattedDate);
        maleSalaries.push(item.males);
        femaleSalaries.push(item.females);
      }
    });
  
    setPayGapData({
      dates,
      maleSalaries,
      femaleSalaries
    });
  };

  const handleChoice = (selectedChoice: string) => {
    setChoice(selectedChoice); 
    onNext(selectedChoice);     
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
      },
      {
        label: 'Female Salary',
        data: payGapData?.femaleSalaries || [],  
        borderColor: 'rgba(255, 99, 132, 1)',  
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        borderWidth: 2,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
        ticks: {
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
        beginAtZero: false, 
        min: 1000, 
        max: 2500, 
        ticks: {
          stepSize: 200, 
        }
      },
    },
  };
  
  return (
    <div className="step-container">
      <h2>Choose Your Current Status</h2>

      <div className="button-group">
        <button onClick={() => handleChoice('Job-Seeking')}>Job-Seeking</button>
        <button onClick={() => handleChoice('Already Employed')}>Already Employed</button>
      </div>

      {choice === 'Already Employed' && (
        <div>
          {loading ? (
            <p>Loading gender pay data...</p>
          ) : (
            payGapData && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '700px', height: '400px', margin: '20px auto' }}>
                  <h3 style={{ textAlign: 'center' }}>Gender Pay Gap Over Time in {userData.industry}</h3>
                  <Line data={chartData} options={chartOptions} />
                </div>
            </div>             
            )
          )}
        </div>
      )}
    </div>
  );
};

export default EmploymentChoice;
