import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Journey from './pages/Journey';
// import PayGapMap from './pages/PayGapMap';
// import LabourForceChart from './pages/LabourForceChart';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<Journey />} />
        {/* <Route path="/paygapmap" element={<PayGapMap />} /> */}
        {/* <Route path="/labourforcechart" element={<LabourForceChart />} /> */}
      </Routes>
    </Router>
  );
};

export default App;