import React, { useState } from 'react';

const EmploymentChoice: React.FC = () => {
  const [choice, setChoice] = useState('');

  const handleNext = () => {
    if (choice) {
      alert(`You selected: ${choice}`);
    } else {
      alert('Please make a selection');
    }
  };

  return (
    <div className="step-container">
      <h2>Choose Your Current Status</h2>

      <div className="button-group">
        <button onClick={() => setChoice('Job-Seeking')}>Job-Seeking</button>
        <button onClick={() => setChoice('Already Employed')}>Already Employed</button>
      </div>

      <button className="submit-button" onClick={handleNext}>Submit</button>
    </div>
  );
};

export default EmploymentChoice;
