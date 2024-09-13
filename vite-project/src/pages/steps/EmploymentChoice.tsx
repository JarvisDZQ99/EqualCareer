import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PayGapVisual from './PayGapVisual';
import JobSeekingResults from './CompanySuggest';
import LabourForceInfo from './LabourForceInfo';

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
  const [error, setError] = useState<string | null>(null);
  const [choice, setChoice] = useState('');
  const [showLabourForceQuestion, setShowLabourForceQuestion] = useState(false);

  useEffect(() => {
    if (choice === 'Already Employed') {
      fetchGenderPayData();
    } else {
      clearEmployedData();
    }
  }, [choice]);

  const clearEmployedData = () => {
    setPayGapData(null);
    setShowLabourForceQuestion(false);
    setLoading(false);
    setError(null);
  };

  const fetchGenderPayData = async () => {
    setLoading(true);
    setError(null);
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
      setError('Failed to fetch gender pay data');
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
      setError('No pay gap data found for the selected industry.');
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
    if (selectedChoice !== choice) {
      clearEmployedData();
    }
    setChoice(selectedChoice);
    if (selectedChoice === 'Job-Seeking') {
      onNext(selectedChoice);
    }
  };

  const handleLabourForceChoice = (choice: 'home' | 'next') => {
    if (choice === 'home') {
      onNext('home');
    } else {
      setShowLabourForceQuestion(false);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="step-container">
      <h2 className="text-2xl font-bold mb-4">Choose Your Current Status</h2>

      <div className="button-group mb-4">
        <button 
          className={`px-4 py-2 ${choice === 'Job-Seeking' ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded mr-2`}
          onClick={() => handleChoice('Job-Seeking')}
        >
          Job-Seeking
        </button>
        <button 
          className={`px-4 py-2 ${choice === 'Already Employed' ? 'bg-green-700' : 'bg-green-500'} text-white rounded`}
          onClick={() => handleChoice('Already Employed')}
        >
          Already Employed
        </button>
      </div>

      {choice === 'Already Employed' && (
        <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {payGapData && <PayGapVisual payGapData={payGapData} industry={userData.industry} />}
              <LabourForceInfo
                selectedIndustry={userData.industry}
                showLabourForceQuestion={showLabourForceQuestion}
                onLabourForceChoice={handleLabourForceChoice}
              />
            </>
          )}
        </motion.div>
      )}

      {choice === 'Job-Seeking' && (
        <JobSeekingResults region={userData.region} industry={userData.industry} />
      )}
    </div>
  );
};

export default EmploymentChoice;

