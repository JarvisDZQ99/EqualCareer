import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/journey');
  };

  return (
    <div className="homecontainer">
      <div className="background-container">
        <Header />
        <div className="home-content">
          <p className="home-subtitle">Empowering Your Career Path with Data-Driven Insights</p>
          <button className="start-button" onClick={handleStartClick}>
            Let's Start Your Journey
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;