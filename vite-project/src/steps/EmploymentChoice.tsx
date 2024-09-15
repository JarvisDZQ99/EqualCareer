// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import PayGapVisual from './PayGapVisual';
// import JobSeekingResults from './CompanySuggest';
// import LabourForceInfo from './LabourForceInfo';

// interface EmploymentChoiceProps {
//   onNext: (choice: string) => void;
//   userData: {
//     industry: string;
//     region: string;
//   };
// }

// const EmploymentChoice: React.FC<EmploymentChoiceProps> = ({ onNext, userData }) => {
//   const [choice, setChoice] = useState('');

//   const handleChoice = (selectedChoice: string) => {
//     setChoice(selectedChoice);
//     if (selectedChoice === 'Job-Seeking') {
//       onNext(selectedChoice);
//     }
//   };

//   const handleLabourForceChoice = (choice: 'home' | 'next') => {
//     if (choice === 'home') {
//       onNext('home');
//     }
//   };

//   const fadeInVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.5 } },
//   };

//   return (
//     <div className="step-container">
//       <h2 className="text-2xl font-bold mb-4">Choose Your Current Status</h2>

//       <div className="button-group mb-4">
//         <button 
//           className={`px-4 py-2 ${choice === 'Job-Seeking' ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded mr-2`}
//           onClick={() => handleChoice('Job-Seeking')}
//         >
//           Job-Seeking
//         </button>
//         <button 
//           className={`px-4 py-2 ${choice === 'Already Employed' ? 'bg-green-700' : 'bg-green-500'} text-white rounded`}
//           onClick={() => handleChoice('Already Employed')}
//         >
//           Already Employed
//         </button>
//       </div>

//       {choice === 'Already Employed' && (
//         <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
//           <PayGapVisual industry={userData.industry} region={userData.region} />
//           <LabourForceInfo
//             selectedIndustry={userData.industry}
//             showLabourForceQuestion={true}
//             onLabourForceChoice={handleLabourForceChoice}
//           />
//         </motion.div>
//       )}

//       {choice === 'Job-Seeking' && (
//         <JobSeekingResults region={userData.region} industry={userData.industry} />
//       )}
//     </div>
//   );
// };

// export default EmploymentChoice;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PayGapVisual from './PayGapVisual';

interface EmploymentChoiceProps {
  onNext: (choice: string) => void;
  onPrevious: () => void;
  userData: {
    industry: string;
    region: string;
  };
}

const EmploymentChoice: React.FC<EmploymentChoiceProps> = ({ onNext, onPrevious, userData }) => {
  const [choice, setChoice] = useState('');

  const handleChoice = (selectedChoice: string) => {
    setChoice(selectedChoice);
    if (selectedChoice === 'Job-Seeking') {
      onNext(selectedChoice);
    }
  };

  const handleShowLabourForceInfo = () => {
    onNext('show-labour-force');
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="step-container">
      <h2 className="text-2xl font-bold mb-4">Choose Your Current Status</h2>

      <div className="button-group mb-4">
        <button 
          className={`px-4 py-2 ${choice === 'Job-Seeking' ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded mr-2`}
          onClick={() => handleChoice('Job-Seeking')}
        >
          Job-Seeking
        </button>
        <button 
          className={`px-4 py-2 ${choice === 'Already Employed' ? 'bg-green-700' : 'bg-green-500'} text-white rounded`}
          onClick={() => handleChoice('Already Employed')}
        >
          Already Employed
        </button>
      </div>

      {choice === 'Already Employed' && (
        <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
          <PayGapVisual industry={userData.industry} region={userData.region} />
          <button 
            className="px-4 py-2 bg-purple-500 text-white rounded mt-4"
            onClick={handleShowLabourForceInfo}
          >
            Show Labour Force Information
          </button>
        </motion.div>
      )}

      <div className="button-container mt-4">
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
          onClick={onPrevious}
        >
          Previous
        </button>
        {choice === 'Job-Seeking' && (
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => onNext('Job-Seeking')}
          >
            View Job Recommendations
          </button>
        )}
      </div>
    </div>
  );
};

export default EmploymentChoice;