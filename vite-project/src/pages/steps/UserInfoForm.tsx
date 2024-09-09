import React, { useState } from 'react';

interface UserInfoFormProps {
  onNext: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onNext }) => {
  const [gender, setGender] = useState('');
  const [industry, setIndustry] = useState('');
  const [level, setLevel] = useState('');
  const [region, setRegion] = useState('');

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
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
      </label>
      <label>
        Industry:
        <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g., Technology" />
      </label>
      <label>
        Experience Level:
        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">Select Experience Level</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Mid Level">Mid Level</option>
          <option value="Senior Level">Senior Level</option>
          <option value="Executive">Executive</option>
        </select>
      </label>
      <label>
        Region:
        <input type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g., Melbourne" />
      </label>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default UserInfoForm;
