import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import './styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/journey');
  };

  return (
    <div className="homecontainer">
      <div className="background-container">
        <Header/>
        <div className="home-content">
          <p className="home-subtitle">Empowering Women in the Workplace with Data-Driven Career Insights</p>
          <button className="start-button" onClick={handleStartClick}>
            Let's Start Your Journey
          </button>
        </div>
        <footer className="home-footer">
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Equal Career. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;