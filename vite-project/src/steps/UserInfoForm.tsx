import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface UserInfoFormProps {
  onNext: (userInfo: { gender: string; industry: string; /*level: string;*/ region: string }) => void;
}

interface Option {
  value: string;
  label: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onNext }) => {
  const [gender, setGender] = useState<Option | null>(null);
  const [industry, setIndustry] = useState<Option | null>(null);
  // const [level, setLevel] = useState<Option | null>(null);
  const [region, setRegion] = useState<Option | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const genderOptions: Option[] = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' }
  ];

  // const experienceLevelOptions: Option[] = [
  //   { value: 'Entry Level', label: 'Entry Level' },
  //   { value: 'Mid Level', label: 'Mid Level' },
  //   { value: 'Senior Level', label: 'Senior Level' },
  //   { value: 'Executive', label: 'Executive' }
  // ];

  const australianStates: Option[] = [
    { value: 'NSW', label: 'NSW' },
    { value: 'VIC', label: 'VIC' },
    { value: 'QLD', label: 'QLD' },
    { value: 'SA', label: 'SA' },
    { value: 'WA', label: 'WA' },
    { value: 'TAS', label: 'TAS' },
    { value: 'NT', label: 'NT' },
    { value: 'ACT', label: 'ACT' }
  ];

  const industryOptions: Option[] = [
    { value: 'Accommodation and Food Services', label: 'Accommodation and Food Services' },
    { value: 'Administrative and Support Services', label: 'Administrative and Support Services' },
    { value: 'Agriculture, Forestry and Fishing', label: 'Agriculture, Forestry and Fishing' },
    { value: 'Arts and Recreation Services', label: 'Arts and Recreation Services' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Education and Training', label: 'Education and Training' },
    { value: 'Electricity, Gas, Water and Waste Services', label: 'Electricity, Gas, Water and Waste Services' },
    { value: 'Financial and Insurance Services', label: 'Financial and Insurance Services' },
    { value: 'Health Care and Social Assistance', label: 'Health Care and Social Assistance' },
    { value: 'Information Media and Telecommunications', label: 'Information Media and Telecommunications' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Mining', label: 'Mining' },
    { value: 'Other Services', label: 'Other Services' },
    { value: 'Professional, Scientific and Technical Services', label: 'Professional, Scientific and Technical Services' },
    { value: 'Public Administration and Safety', label: 'Public Administration and Safety' },
    { value: 'Rental, Hiring and Real Estate Services', label: 'Rental, Hiring and Real Estate Services' },
    { value: 'Retail Trade', label: 'Retail Trade' },
    { value: 'Transport, Postal and Warehousing', label: 'Transport, Postal and Warehousing' },
    { value: 'Wholesale Trade', label: 'Wholesale Trade' }
  ];

  const handleNext = () => {
    if (gender && industry /*&& level*/ && region) {
      onNext({
        gender: gender.value,
        industry: industry.value,
        // level: level.value,
        region: region.value
      });
    } else {
      alert('Please fill out all fields');
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '25px',
    border: 'none',
    background: isHovered ? 'linear-gradient(45deg, #5dade2, #2980b9)' : 'linear-gradient(45deg, #3498db, #2980b9)',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'block',
    margin: '20px auto 0',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)', 
  };

  return (
    <div className="step-container">
      <h2>Enter Your Information</h2>
      <label>
        Gender:
        <Select
          value={gender}
          onChange={(selectedOption: SingleValue<Option>) => setGender(selectedOption)}
          options={genderOptions}
          placeholder="Select Gender"
        />
      </label>
      <label>
        Industry:
        <Select
          value={industry}
          onChange={(selectedOption: SingleValue<Option>) => setIndustry(selectedOption)}
          options={industryOptions}
          placeholder="Select or Search Industry"
        />
      </label>
      {/* <label>
        Experience Level:
        <Select
          value={level}
          onChange={(selectedOption: SingleValue<Option>) => setLevel(selectedOption)}
          options={experienceLevelOptions}
          placeholder="Select Experience Level"
        />
      </label> */}
      <label>
        Region:
        <Select
          value={region}
          onChange={(selectedOption: SingleValue<Option>) => setRegion(selectedOption)}
          options={australianStates}
          placeholder="Select Region"
        />
      </label>
      <button
        onClick={handleNext}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Next
      </button>
    </div>
  );
};

export default UserInfoForm;
