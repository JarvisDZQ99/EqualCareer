import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PayGapVisual from './PayGapVisual';
import '../styles/EmploymentChoice.css';

interface EmploymentChoiceProps {
  onNext: (choice: string) => void;
  onPrevious: () => void;
  userData: {
    industry: string;
    region: string;
  };
}

const EmploymentChoice: React.FC<EmploymentChoiceProps> = ({ onNext, onPrevious, userData }) => {
  const [choice, setChoice] = useState('');

  const handleChoice = (selectedChoice: string) => {
    setChoice(selectedChoice);
    if (selectedChoice === 'Job-Seeking') {
      onNext(selectedChoice);
    }
  };

  const handleShowLabourForceInfo = () => {
    onNext('show-labour-force');
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="container">
      <h2 className="title">Choose Your Current Status</h2>

      <div className="employment-button-group">
        <button 
          className={`employment-button ${choice === 'Job-Seeking' ? 'bg-blue-700' : ''}`}
          onClick={() => handleChoice('Job-Seeking')}
        >
          Job-Seeking
        </button>
        <button 
          className={`employment-button ${choice === 'Already Employed' ? 'bg-green-700' : ''}`}
          onClick={() => handleChoice('Already Employed')}
        >
          Already Employed
        </button>
      </div>

      {choice === 'Already Employed' && (
        <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
          <PayGapVisual industry={userData.industry} region={userData.region} />
          <button 
            className="employment-button"
            onClick={handleShowLabourForceInfo}
          >
            Show Labour Force Information
          </button>
        </motion.div>
      )}

      <div className="button-group" style={{ marginTop: '20px' }}>
        <button 
          className="employment-button employment-button-secondary"
          onClick={onPrevious}
        >
          Previous
        </button>
        {choice === 'Job-Seeking' && (
          <button 
            className="button"
            onClick={() => onNext('Job-Seeking')}
          >
            View Job Recommendations
          </button>
        )}
      </div>
    </div>
  );
};

export default EmploymentChoice;