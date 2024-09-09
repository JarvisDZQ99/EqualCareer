import React, { useState, useRef } from 'react';
import Welcome from '../pages/steps/Welcome';
import UserInfoForm from '../pages/steps/UserInfoForm';
import EmploymentChoice from '../pages/steps/EmploymentChoice';
import Header from '../components/Header';  
import Footer from '../components/Footer';
import '../styles/Journey.css';  

const Journey: React.FC = () => {
  const [showUserInfoForm] = useState(true);
  const [showEmploymentChoice, setShowEmploymentChoice] = useState(false);
  const employmentChoiceRef = useRef<HTMLDivElement>(null);  

  const handleUserInfoSubmit = () => {
    setShowEmploymentChoice(true);

    setTimeout(() => {
      if (employmentChoiceRef.current) {
        employmentChoiceRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); 
  };

  return (
    <div className="journey-page">
      <Header />
      
      <div className="content-container">
        <Welcome />

        {showUserInfoForm && <UserInfoForm onNext={handleUserInfoSubmit} />}

        {showEmploymentChoice && (
          <div ref={employmentChoiceRef}> 
            <EmploymentChoice />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Journey;
