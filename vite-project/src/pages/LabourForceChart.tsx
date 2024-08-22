import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LabourForceChart.css';

const LabourForceChart: React.FC = () => {
    return (
      <div className="container">
        <Header />
        <h2 className="chart-title">Gender Employment Ratios Across Industries</h2>
        <div className="chart">
        </div>
        <Footer />
      </div>
    );
  };

export default LabourForceChart;
