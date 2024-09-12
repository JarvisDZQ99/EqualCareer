import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PayGapVisual from './PayGapVisual';
import JobSeekingResults from './CompanySuggest';

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
  const [showLabourForceQuestion, setShowLabourForceQuestion] = useState(false);

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
        }
      });
      const responseData = JSON.parse(response.data.body);
      
      processPayGapData(responseData);
    } catch (error) {
      console.error('Error fetching gender pay data:', error);
    } finally {
      setLoading(false);
      setShowLabourForceQuestion(true);
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
      normalizeString(item.industry) === normalizeString(userData.industry)
    );
    
    if (filteredData.length === 0) {
      console.warn('No data found for selected industry');
    }

    filteredData.forEach((item: any) => {
      const [year, month] = item.time_period.split('-');
      const formattedDate = `${month}-${year}`;
      dates.push(formattedDate);
      maleSalaries.push(item.males_earnings);
      femaleSalaries.push(item.females_earnings);
    });
  
    setPayGapData({
      dates,
      maleSalaries,
      femaleSalaries
    });
  };

  const handleChoice = (selectedChoice: string) => {
    setChoice(selectedChoice);
    if (selectedChoice === 'Job-Seeking') {
      onNext(selectedChoice);
    }
  };

  const handleLabourForceChoice = (answer: string) => {
    if (answer === 'next') {
      onNext('labour-force-info');
    } else {
      onNext('home');
    }
  };

  return (
    <div className="step-container">
      <h2 className="text-2xl font-bold mb-4">Choose Your Current Status</h2>

      <div className="button-group mb-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          onClick={() => handleChoice('Job-Seeking')}
        >
          Job-Seeking
        </button>
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => handleChoice('Already Employed')}
        >
          Already Employed
        </button>
      </div>

      {choice === 'Already Employed' && (
        <div>
          {loading ? (
            <p>Loading gender pay gap data...</p>
          ) : (
            payGapData && <PayGapVisual payGapData={payGapData} industry={userData.industry} />
          )}
        </div>
      )}

      {choice === 'Job-Seeking' && (
        <JobSeekingResults region={userData.region} industry={userData.industry} />
      )}

      {showLabourForceQuestion && (
        <div className="labour-force-question mt-4">
          <p className="mb-2">Would you like to know more about Labour Force information?</p>
          <div className="button-group">
            <button 
              className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              onClick={() => handleLabourForceChoice('home')}
            >
              Go back to Home
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleLabourForceChoice('next')}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmploymentChoice;