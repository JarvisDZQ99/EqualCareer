import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Map from '../components/Map';
import '../styles/PayGapMap.css';

const PayGapMap: React.FC = () => {
    return (
      <div className="container">
        <Header />
        <div className="map-container">
          <Map />
        </div>
        <Footer />
      </div>
    );
  };

export default PayGapMap;
