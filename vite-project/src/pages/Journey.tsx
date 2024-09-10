import React, { useState, useRef } from 'react';
import Welcome from '../pages/steps/Welcome';
import UserInfoForm from '../pages/steps/UserInfoForm';
import EmploymentChoice from '../pages/steps/EmploymentChoice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Journey.css';

const Journey: React.FC = () => {
  const [showEmploymentChoice, setShowEmploymentChoice] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null); 
  const employmentChoiceRef = useRef<HTMLDivElement>(null);

  const [userData, setUserData] = useState({
    gender: '',
    industry: '',
    level: '',
    region: ''
  });

  const handleUserInfoSubmit = (userInfo: { gender: string; industry: string; level: string; region: string }) => {
    setUserData(userInfo); 
    setShowEmploymentChoice(true);

    setTimeout(() => {
      if (employmentChoiceRef.current) {
        employmentChoiceRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleEmploymentChoice = (choice: string) => {
    setSelectedChoice(choice); 
    if (selectedChoice) {
        console.log(`User selected: ${selectedChoice}`);
      }
  };

  return (
    <div className="journey-page">
      <Header />
      
      <div className="content-container">
        <Welcome />

        <UserInfoForm onNext={handleUserInfoSubmit} />

        {showEmploymentChoice && (
          <div ref={employmentChoiceRef}>
            <EmploymentChoice onNext={handleEmploymentChoice} userData={userData} />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Journey;

