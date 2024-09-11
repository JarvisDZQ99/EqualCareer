import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Map from './Map';
import '../styles/PayGapMap.css';

const PayGapMap: React.FC = () => {
  return (
    <div className="container">
      <Header />
      <div className="intro">
        <h1 className="intro-title">Australian Gender Pay Gap Map</h1>
        <p className="intro-text">
          This interactive map visualizes the gender pay gap across different Australian states and territories. 
          Explore the map to see how the pay gap varies regionally and track changes over time.
        </p>
      </div>
      <div className="map-container">
        <Map />
      </div>
      <Footer />
    </div>
  );
};

export default PayGapMap;
