import React, { useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { useUserInfo } from '../steps/UserInfoStorage';
import '../styles/UserInfoForm.css';

interface UserInfoFormProps {
  onNext: () => void;
}

interface Option {
  value: string;
  label: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onNext }) => {
  const { userInfo, setUserInfo } = useUserInfo();

  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem('hasVisited');
    
    if (isFirstVisit) {
      setUserInfo({ gender: '', industry: '', region: '' });
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, [setUserInfo]);

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
    if (userInfo.industry && userInfo.region) {
      onNext();
    } else {
      alert('Please fill out all fields');
    }
  };

  const handleChange = (field: keyof typeof userInfo) => (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setUserInfo({ ...userInfo, [field]: selectedOption.value });
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
        Industry
        <Select
          value={industryOptions.find(option => option.value === userInfo.industry)}
          onChange={handleChange('industry')}
          options={industryOptions}
          placeholder="Select or Search Industry"
          className="user-info-form-select"
          classNamePrefix="react-select"
        />
      </label>
      <label className="user-info-form-label">
        Region
        <Select
          value={australianStates.find(option => option.value === userInfo.region)}
          onChange={handleChange('region')}
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