import React, { useState, useRef } from 'react';
import UserInfoForm from './steps/UserInfoForm';
import EmploymentChoice from './steps/EmploymentChoice';
import LabourForceInfo from './steps/LabourForceInfo'; 
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/Journey.css';

const Journey: React.FC = () => {
  const [showEmploymentChoice, setShowEmploymentChoice] = useState(false);
  const [showLabourForceInfo, setShowLabourForceInfo] = useState(false); 
  const employmentChoiceRef = useRef<HTMLDivElement>(null);

  const [userData, setUserData] = useState({
    gender: '',
    industry: '',
    // level: '',
    region: ''
  });

  const handleUserInfoSubmit = (userInfo: { gender: string; industry: string; /*level: string;*/ region: string }) => {
    setUserData(userInfo); 
    setShowEmploymentChoice(true);

    setTimeout(() => {
      if (employmentChoiceRef.current) {
        employmentChoiceRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleEmploymentChoice = (choice: string) => {
    if (choice === 'labour-force-info') {
      setShowLabourForceInfo(true);
    }
  };

  const handleLabourForceChoice = (choice: 'home' | 'next') => {
    if (choice === 'home') {
      setShowLabourForceInfo(false); 
    } else if (choice === 'next') {
      setShowLabourForceInfo(true); 
    }
  };

  return (
    <div className="journey-page">
      <Header />
      
      <div className="content-container">

        <UserInfoForm onNext={handleUserInfoSubmit} />

        {showEmploymentChoice && (
          <div ref={employmentChoiceRef}>
            <EmploymentChoice onNext={handleEmploymentChoice} userData={userData} />
          </div>
        )}

        {showLabourForceInfo && (
          <LabourForceInfo 
            selectedIndustry={userData.industry} 
            showLabourForceQuestion={true} 
            onLabourForceChoice={handleLabourForceChoice} 
          />
        )}

      </div>
      
      <Footer />
    </div>
  );
};

export default Journey;