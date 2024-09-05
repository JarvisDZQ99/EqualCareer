import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="homecontainer">
      <div className="background-container">
        <Header />
        <div className="home-content">
          <h1 className="home-title">Equal Career</h1>
          <p className="home-subtitle">Helping You Shape Your Future Careers</p>
          <button className="start-button">Let's Start</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;