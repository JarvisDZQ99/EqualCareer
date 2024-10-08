import React, { useState } from 'react';
import { Search, Briefcase, TrendingUp, MapPin, Users, BookOpen, Cpu } from 'lucide-react';
import '../styles/EmploymentChoice.css';

interface EmploymentChoiceProps {
  onNext: (choice: string) => void;
  onPrevious: () => void;
  userData: {
    industry: string;
    region: string;
  };
}

const EmploymentChoice: React.FC<EmploymentChoiceProps> = ({ onNext, onPrevious }) => {
  const [choice, setChoice] = useState('');

  const handleChoice = (selectedChoice: string) => {
    setChoice(selectedChoice);
  };

  const handleNext = () => {
    if (choice) {
      switch(choice) {
        case 'Already Employed':
          onNext('EmployedChoice');
          break;
        case 'Job-Seeking':
          onNext('JobSeekingResults');
          break;
        case 'Skill Assessment':
          onNext('SkillAssessment');
          break;
        default:
          console.error('Invalid choice:', choice);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">Choose Your Path</h1>
      <div className="user-info-form-info-box">
        Explore your personalized gender equality insights or assess your skills
      </div>

      <div className="choice-container">
        <div 
          className={`choice-box ${choice === 'Job-Seeking' ? 'selected' : ''}`}
          onClick={() => handleChoice('Job-Seeking')}
        >
          <Search size={24} />
          <h2>Job-Seeking</h2>
          <p>Discover companies with strong gender equality practices</p>
          <ul>
            <li><Search size={16} /> Company recommendations</li>
            <li><TrendingUp size={16} /> Gender equality scores</li>
          </ul>
        </div>

        <div 
          className={`choice-box ${choice === 'Already Employed' ? 'selected' : ''}`}
          onClick={() => handleChoice('Already Employed')}
        >
          <Briefcase size={24} />
          <h2>Already Employed</h2>
          <p>Explore gender equality insights for your sector and region</p>
          <ul>
            <li><TrendingUp size={16} /> Gender pay gap over time</li>
            <li><MapPin size={16} /> Pay gap in your state</li>
            <li><Users size={16} /> Labor force information</li>
          </ul>
        </div>

        <div 
          className={`choice-box ${choice === 'Skill Assessment' ? 'selected' : ''}`}
          onClick={() => handleChoice('Skill Assessment')}
        >
          <BookOpen size={24} />
          <h2>Skill Assessment</h2>
          <p>Evaluate your skills and get personalized recommendations</p>
          <ul>
            <li><BookOpen size={16} /> Task: Job tasks and skill requirements</li>
            <li><Cpu size={16} /> Tech: Technical tools for your profession</li>
          </ul>
        </div>
      </div>

      <div className="button-group">
        <button className="button secondary" onClick={onPrevious}>
          Back to Info Form
        </button>
        <button 
          className="button primary"
          onClick={handleNext}
          disabled={!choice}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmploymentChoice;