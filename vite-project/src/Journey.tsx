import React, { useState, ReactElement } from 'react';
import { UserInfoProvider, useUserInfo } from './steps/UserInfoStorage';
import UserInfoForm from './steps/UserInfoForm';
import EmploymentChoice from './steps/EmploymentChoice';
import JobSeekingResults from './steps/CompanySuggest';
import LabourForceInfo from './steps/LabourForceInfo';
import PayGapVisual from './steps/PayGapVisual'; 
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/Journey.css';

const JourneyContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { userInfo } = useUserInfo();

  function handleUserInfoSubmit() {
    setCurrentStep(1);
  }

  function handleEmploymentChoice(choice: string) {
    switch(choice) {
      case 'JobSeekingResults':
        setCurrentStep(2);
        break;
      case 'PayGapVisual':
        setCurrentStep(3);
        break;
      case 'UserInfoForm':  
        setCurrentStep(0);
        break;
      case 'LabourForceInfo':  
        setCurrentStep(4);
        break;
      case 'home':
        setCurrentStep(0);
        break;
      default:
        console.error('Invalid choice:', choice);
    }
  }

  function handleLabourForceChoice(choice: 'home' | 'previous') {
    if (choice === 'home') {
      setCurrentStep(0);
    } else if (choice === 'previous') {
      setCurrentStep(3); 
    }
  }

  function handlePrevious() {
    setCurrentStep(prevStep => {
      if (prevStep === 4) {  
        return 3;  
      } else if (prevStep === 3) {  
        return 1;  
      }
      return Math.max(0, prevStep - 1); 
    });
  }  

  function handlePayGapNavigation(choice: string) {
    if (choice === 'show-labour-force') {
      setCurrentStep(4);  
    }
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
      userData={{industry: userInfo.industry, region: userInfo.region}} 
    />,
    <JobSeekingResults 
      key="job-seeking-results"
      region={userInfo.region} 
      industry={userInfo.industry} 
      onPrevious={handlePrevious}
    />,
    <PayGapVisual 
      key="pay-gap-visual"
      industry={userInfo.industry}
      region={userInfo.region}
      onPrevious={handlePrevious}
      onNext={handlePayGapNavigation}
    />,
    <LabourForceInfo
      key="labour-force-info"
      selectedIndustry={userInfo.industry}
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

const Journey: React.FC = () => {
  return (
    <UserInfoProvider>
      <JourneyContent />
    </UserInfoProvider>
  );
};

export default Journey;