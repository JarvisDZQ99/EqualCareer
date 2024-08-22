import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Map from '../components/Map';
import '../styles/PayGapMap.css';

const PayGapMap: React.FC = () => {
    return (
      <div className="container">
        <Header />
        <h2 className="map-title">Gender Pay Gap Across Australian States</h2>
        <div className="map-container">
          <Map />
        </div>
        <Footer />
      </div>
    );
  };

export default PayGapMap;
