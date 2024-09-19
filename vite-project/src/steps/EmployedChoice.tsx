import React, { useState } from 'react';
import { TrendingUp, MapPin, Users } from 'lucide-react';
import '../styles/EmpolyedChoice.css';

interface EmployedChoiceProps {
  onNext: (choice: string) => void;
  onPrevious: () => void;
  userData: {
    industry: string;
    region: string;
  };
}

const EmployedChoice: React.FC<EmployedChoiceProps> = ({ onNext, onPrevious }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
  };

  const handleNext = () => {
    if (selectedChoice) {
      onNext(selectedChoice);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Explore Your Career Insights</h1>
      <div className="user-info-form-info-box">
        <span className="user-info-form-info-icon">ℹ</span>
        Discover personalized gender equality insights for your industry and region
      </div>

      <div className="choice-container">
        <div 
          className={`choice-box ${selectedChoice === 'PayGapVisual' ? 'selected' : ''}`}
          onClick={() => handleChoice('PayGapVisual')}
        >
          <TrendingUp size={24} />
          <h2>Pay Gap Analysis</h2>
          <p>Explore detailed gender pay gap trends and statistics</p>
          <ul>
            <li><TrendingUp size={16} /> Gender pay gap over time</li>
            <li><MapPin size={16} /> Pay gap in your state</li>
          </ul>
        </div>

        <div 
          className={`choice-box ${selectedChoice === 'LabourForceInfo' ? 'selected' : ''}`}
          onClick={() => handleChoice('LabourForceInfo')}
        >
          <Users size={24} />
          <h2>Labour Force Insights</h2>
          <p>Uncover workforce demographics and trends</p>
          <ul>
            <li><Users size={16} /> Gender distribution in your industry</li>
            <li><TrendingUp size={16} /> Workforce composition analysis</li>
          </ul>
        </div>
      </div>

      <div className="button-group">
        <button className="button secondary" onClick={onPrevious}>
          Previous
        </button>
        <button 
          className="button primary"
          onClick={handleNext}
          disabled={!selectedChoice}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployedChoice;