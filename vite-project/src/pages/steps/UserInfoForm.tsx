import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface UserInfoFormProps {
  onNext: () => void;
}

interface Option {
  value: string;
  label: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onNext }) => {
  const [gender, setGender] = useState<Option | null>(null);
  const [industry, setIndustry] = useState<Option | null>(null);
  const [level, setLevel] = useState<Option | null>(null);
  const [region, setRegion] = useState<Option | null>(null);

  const genderOptions: Option[] = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' }
  ];

  const experienceLevelOptions: Option[] = [
    { value: 'Entry Level', label: 'Entry Level' },
    { value: 'Mid Level', label: 'Mid Level' },
    { value: 'Senior Level', label: 'Senior Level' },
    { value: 'Executive', label: 'Executive' }
  ];

  const australianStates: Option[] = [
    { value: 'New South Wales', label: 'New South Wales' },
    { value: 'Victoria', label: 'Victoria' },
    { value: 'Queensland', label: 'Queensland' },
    { value: 'South Australia', label: 'South Australia' },
    { value: 'Western Australia', label: 'Western Australia' },
    { value: 'Tasmania', label: 'Tasmania' },
    { value: 'Northern Territory', label: 'Northern Territory' },
    { value: 'Australian Capital Territory', label: 'Australian Capital Territory' }
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
    if (gender && industry && level && region) {
      onNext();
    } else {
      alert('Please fill out all fields');
    }
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
      <label>
        Experience Level:
        <Select
          value={level}
          onChange={(selectedOption: SingleValue<Option>) => setLevel(selectedOption)}
          options={experienceLevelOptions}
          placeholder="Select Experience Level"
        />
      </label>
      <label>
        Region:
        <Select
          value={region}
          onChange={(selectedOption: SingleValue<Option>) => setRegion(selectedOption)}
          options={australianStates}
          placeholder="Select Region"
        />
      </label>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default UserInfoForm;
