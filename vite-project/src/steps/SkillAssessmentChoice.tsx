import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Code, CheckSquare } from 'lucide-react';
import '../styles/SkillAssessment.css';

interface UserData {
  industry: string;
}

interface SkillAssessmentPageProps {
  onNext: (choice: 'Task' | 'Tech', occupation: string) => void;
  onPrevious: () => void;
  userData: UserData;
}

interface OccupationOption {
  value: string;
  label: string;
}

const SkillAssessmentPage: React.FC<SkillAssessmentPageProps> = ({ onNext, onPrevious, userData }) => {
  const [selectedChoice, setSelectedChoice] = useState<'Task' | 'Tech' | null>(null);
  const [occupations, setOccupations] = useState<OccupationOption[]>([]);
  const [selectedOccupation, setSelectedOccupation] = useState<OccupationOption | null>(null);

  useEffect(() => {
    fetchOccupations();
  }, [userData.industry]);

  const fetchOccupations = async () => {
    try {
      const response = await fetch(`https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/generalfunc7?industry=${encodeURIComponent(userData.industry)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch occupations');
      }
      const data = await response.json();
      const occupationList = data.map((item: { occupation: string }) => ({
        value: item.occupation,
        label: item.occupation
      }));
      setOccupations(occupationList);
    } catch (error) {
      console.error('Error fetching occupations:', error);
    }
  };

  const handleChoice = (choice: 'Task' | 'Tech') => {
    setSelectedChoice(choice);
  };

  const handleNext = () => {
    if (selectedChoice && selectedOccupation) {
      onNext(selectedChoice, selectedOccupation.value);
    }
  };

  return (
    <div className="skill-assessment-container">
      <h1 className="skill-assessment-title">Skill Assessment</h1>
      <div className="skill-assessment-info-box">
        <p>Choose your occupation and assessment type to evaluate your skills in the {userData.industry} industry and get personalized recommendations.</p>
      </div>

      <div className="occupation-selection">
        <label className="user-info-form-label">
          Occupation
          <Select
            value={selectedOccupation}
            onChange={(option) => setSelectedOccupation(option as OccupationOption)}
            options={occupations}
            placeholder="Select or Search Occupation"
            className="user-info-form-select"
            classNamePrefix="react-select"
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: '#9966cc',
                '&:hover': {
                  borderColor: '#9400d3'
                }
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#9966cc' : state.isFocused ? '#f3e9ff' : undefined,
                color: state.isSelected ? '#ffffff' : '#9966cc',
                '&:hover': {
                  backgroundColor: '#9400d3',
                  color: '#ffffff'
                }
              })
            }}
          />
        </label>
      </div>

      <div className="skill-assessment-choice-container">
        <div 
        className={`skill-assessment-choice-box ${selectedChoice === 'Task' ? 'selected' : ''}`}
        onClick={() => handleChoice('Task')}
        >
        <CheckSquare size={24} color="#9966cc" />
        <h2>Task-based Assessment</h2>
        <p>Evaluate your ability to perform specific tasks in the {userData.industry} industry</p>
        <ul>
            <li><CheckSquare size={16} color="#9966cc" /> Industry-specific problem-solving scenarios</li>
            <li><CheckSquare size={16} color="#9966cc" /> Time management exercises</li>
            <li><CheckSquare size={16} color="#9966cc" /> Project planning simulations</li>
        </ul>
        </div>

        <div 
        className={`skill-assessment-choice-box ${selectedChoice === 'Tech' ? 'selected' : ''}`}
        onClick={() => handleChoice('Tech')}
        >
        <Code size={24} color="#9966cc" />
        <h2>Technical Assessment</h2>
        <p>Test your technical knowledge and skills relevant to the {userData.industry} industry</p>
        <ul>
            <li><Code size={16} color="#9966cc" /> Industry-specific technical challenges</li>
            <li><Code size={16} color="#9966cc" /> Relevant tool and software proficiency</li>
            <li><Code size={16} color="#9966cc" /> {userData.industry}-related technical knowledge questions</li>
        </ul>
        </div>
      </div>

      <div className="skill-assessment-button-group">
        <button 
          className="skill-assessment-button secondary"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button 
          className={`skill-assessment-button primary ${(!selectedChoice || !selectedOccupation) ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!selectedChoice || !selectedOccupation}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SkillAssessmentPage;