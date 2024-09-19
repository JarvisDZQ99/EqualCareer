import React, { useState, ReactElement } from 'react';
import { UserInfoProvider, useUserInfo } from './steps/UserInfoStorage';
import UserInfoForm from './steps/UserInfoForm';
import EmploymentChoice from './steps/EmploymentChoice';
import EmployedChoice from './steps/EmployedChoice';
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
      case 'EmployedChoice':
        setCurrentStep(5);
        break;
      case 'UserInfoForm':  
        setCurrentStep(0);
        break;
      case 'home':
        setCurrentStep(0);
        break;
      default:
        console.error('Invalid choice:', choice);
    }
  }

  function handleEmployedChoice(choice: string) {
    switch(choice) {
      case 'PayGapVisual':
        setCurrentStep(3);
        break;
      case 'LabourForceInfo':
        setCurrentStep(4);
        break;
      default:
        console.error('Invalid choice:', choice);
    }
  }

  function handleLabourForceChoice(choice: 'home' | 'previous' | 'payGap') {
    switch(choice) {
      case 'home':
        setCurrentStep(0);
        break;
      case 'previous':
        setCurrentStep(5);
        break;
      case 'payGap':
        setCurrentStep(3);
        break;
      default:
        console.error('Invalid choice:', choice);
    }
  }

  function handlePrevious() {
    setCurrentStep(prevStep => {
      if (prevStep === 5) { 
        return 1; 
      } else if (prevStep === 4) {  
        return 5; 
      } else if (prevStep === 3) {  
        return 5;
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
    />,
    <EmployedChoice
      key="employed-choice"
      onNext={handleEmployedChoice}
      onPrevious={handlePrevious}
      userData={{industry: userInfo.industry, region: userInfo.region}}
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