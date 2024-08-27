import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PayGapMap from './pages/PayGapMap';
import LabourForceChart from './pages/LabourForceChart';
import PasswordProtection from './PasswordProtectedWebsite';

const App: React.FC = () => {
  return (
    <PasswordProtection password={import.meta.env.VITE_WEBSITE_PASSWORD}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paygapmap" element={<PayGapMap />} />
          <Route path="/labourforcechart" element={<LabourForceChart />} />
        </Routes>
      </Router>
    </PasswordProtection>
  );
};

export default App;