import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import '../styles/UserInfoForm.css';  

interface UserInfoFormProps {
  onNext: (userInfo: { gender: string; industry: string; region: string }) => void;
}

interface Option {
  value: string;
  label: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onNext }) => {
  const [gender, setGender] = useState<Option | null>(null);
  const [industry, setIndustry] = useState<Option | null>(null);
  const [region, setRegion] = useState<Option | null>(null);

  const genderOptions: Option[] = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' }
  ];

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
    if (gender && industry && region) {
      onNext({
        gender: gender.value,
        industry: industry.value,
        region: region.value
      });
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <div className="user-info-form-container">
      <h2 className="user-info-form-heading">Personalize Your Career Journey</h2>
      <div className="user-info-form-info-box">
        <span className="user-info-form-info-icon">ℹ</span>
        Your responses help us tailor our recommendations and insights to your specific situation. We take your privacy seriously and do not share your personal information.
      </div>
      <label className="user-info-form-label">
        Gender
        <Select
          value={gender}
          onChange={(selectedOption: SingleValue<Option>) => setGender(selectedOption)}
          options={genderOptions}
          placeholder="Select Gender"
          className="user-info-form-select"
          classNamePrefix="react-select"
        />
      </label>
      <label className="user-info-form-label">
        Industry
        <Select
          value={industry}
          onChange={(selectedOption: SingleValue<Option>) => setIndustry(selectedOption)}
          options={industryOptions}
          placeholder="Select or Search Industry"
          className="user-info-form-select"
          classNamePrefix="react-select"
        />
      </label>
      <label className="user-info-form-label">
        Region
        <Select
          value={region}
          onChange={(selectedOption: SingleValue<Option>) => setRegion(selectedOption)}
          options={australianStates}
          placeholder="Select Region"
          className="user-info-form-select"
          classNamePrefix="react-select"
        />
      </label>
      <button
        onClick={handleNext}
        className="user-info-form-button"
      >
        Next
      </button>
    </div>
  );
};

export default UserInfoForm;