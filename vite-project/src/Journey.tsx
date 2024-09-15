import React, { useState, ReactElement } from 'react';
import UserInfoForm from './steps/UserInfoForm';
import EmploymentChoice from './steps/EmploymentChoice';
import JobSeekingResults from './steps/CompanySuggest';
import LabourForceInfo from './steps/LabourForceInfo';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/Journey.css';

type UserData = {
  gender: string;
  industry: string;
  region: string;
};

const Journey: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    gender: '',
    industry: '',
    region: ''
  });

  function handleUserInfoSubmit(userInfo: UserData) {
    setUserData(userInfo);
    setCurrentStep(1);
  }

  function handleEmploymentChoice(choice: string) {
    switch(choice) {
      case 'Job-Seeking':
        setCurrentStep(2);
        break;
      case 'show-labour-force':
        setCurrentStep(3);
        break;
      case 'home':
        setCurrentStep(0);
        break;
    }
  }

  function handleLabourForceChoice(choice: 'home' | 'previous') {
    if (choice === 'home') {
      setCurrentStep(0);
    } else if (choice === 'previous') {
      setCurrentStep(1); 
    }
  }

  function handlePrevious() {
    setCurrentStep(prevStep => Math.max(0, prevStep - 1));
  }

  const steps: Array<ReactElement> = [
    <UserInfoForm 
      key="user-info" 
      onNext={handleUserInfoSubmit} 
    />,
    <EmploymentChoice 
      key="employment-choice" 
      onNext={handleEmploymentChoice} 
      onPrevious={handlePrevious}
      userData={{industry: userData.industry, region: userData.region}} 
    />,
    <JobSeekingResults 
      key="job-seeking-results"
      region={userData.region} 
      industry={userData.industry} 
      onPrevious={handlePrevious}
    />,
    <LabourForceInfo
      key="labour-force-info"
      selectedIndustry={userData.industry}
      onLabourForceChoice={handleLabourForceChoice}
    />
  ];

  return (
    <div className="journey-page">
      <Header />
      
      <div className="content-container">
        {steps[currentStep]}
      </div>
      
      <Footer />
    </div>
  );
};

export default Journey;