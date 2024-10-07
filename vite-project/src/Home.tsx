import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { FaChartLine, FaBuilding, FaSearch, FaUsers, FaClipboardCheck, FaGraduationCap } from 'react-icons/fa';
import './styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const handleStartClick = () => {
    navigate('/journey');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (parallaxRef.current) {
      parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
  }, [scrollPosition]);

  return (
    <div className="homecontainer">
      <div className="parallax-wrapper">
        <div className="background-container" ref={parallaxRef}>
          <Header />
          <div className="home-content">
            <p className="home-subtitle">Empowering Women in the Workplace with Comprehensive Career Support</p>
            <button className="start-button" onClick={handleStartClick}>
              Start Your Career Journey
            </button>
          </div>
        </div>
      </div>
      <div className="content-section">
        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>At Equal Career, we are committed to supporting women at all stages of their professional lives. Our mission is to empower both job-seeking and employed women with data-driven insights, tools, and resources to advance their careers, make informed decisions, and thrive in the workplace.</p>
        </div>

        <div className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <FaBuilding className="feature-icon" />
              <h3>Gender-Friendly Company Directory</h3>
              <p>Explore a curated list of companies known for their inclusive policies and supportive work environments for women.</p>
            </div>
            <div className="feature-item">
              <FaSearch className="feature-icon" />
              <h3>Company Insights</h3>
              <p>Access detailed information about companies, including their diversity initiatives, work culture, and career growth opportunities.</p>
            </div>
            <div className="feature-item">
              <FaChartLine className="feature-icon" />
              <h3>Pay Gap Visualization</h3>
              <p>Understand industry-specific gender pay gaps through interactive visual data representations.</p>
            </div>
            <div className="feature-item">
              <FaUsers className="feature-icon" />
              <h3>Labor Force Analytics</h3>
              <p>Gain insights into workforce trends and opportunities for women across various industries and roles.</p>
            </div>
            <div className="feature-item">
              <FaClipboardCheck className="feature-icon" />
              <h3>Skill Assessment Tools</h3>
              <p>Evaluate your professional skills and identify areas for growth to enhance your career prospects.</p>
            </div>
            <div className="feature-item">
              <FaGraduationCap className="feature-icon" />
              <h3>Career Development Resources</h3>
              <p>Access tailored resources for job search, career advancement, and professional development.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;