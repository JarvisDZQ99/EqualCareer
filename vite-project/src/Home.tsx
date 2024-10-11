import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { FaChartLine, FaBuilding, FaSearch, FaUsers, FaClipboardCheck, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
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

  const featureItems = [
    {
      icon: <FaBuilding />,
      title: "Gender-Friendly Company Directory",
      description: "Explore a curated list of companies known for their inclusive policies and supportive work environments for women."
    },
    {
      icon: <FaSearch />,
      title: "Company Insights",
      description: "Access detailed information about companies, including their diversity initiatives, work culture, and career growth opportunities."
    },
    {
      icon: <FaChartLine />,
      title: "Pay Gap Visualization",
      description: "Understand industry-specific gender pay gaps through interactive visual data representations."
    },
    {
      icon: <FaUsers />,
      title: "Labor Force Analytics",
      description: "Gain insights into workforce trends and opportunities for women across various industries and roles."
    },
    {
      icon: <FaClipboardCheck />,
      title: "Skill Assessment Tools",
      description: "Evaluate your professional skills and identify areas for growth to enhance your career prospects."
    },
    {
      icon: <FaGraduationCap />,
      title: "Career Development Resources",
      description: "Access tailored resources for job search, career advancement, and professional development."
    }
  ];

  return (
    <div className="home-container">
      <Header />
      <div className="home-parallax-wrapper">
        <div className="home-background-container" ref={parallaxRef}>
          <div className="home-content">
            <p className="home-subtitle">Empowering Women in the Workplace with Comprehensive Career Support</p>
            <button className="home-start-button" onClick={handleStartClick}>
              Start Your Career Journey
            </button>
          </div>
        </div>
      </div>
      <div className="home-content-section">
        <div className="home-mission-section">
          <h2 className="home-section-title">Our Mission</h2>
          <p className="home-section-text">At Equal Career, we are committed to supporting women at all stages of their professional lives. Our mission is to empower both job-seeking and employed women with data-driven insights, tools, and resources to advance their careers, make informed decisions, and thrive in the workplace.</p>
        </div>

        <div className="home-features-section">
          <h2 className="home-section-title">Key Features</h2>
          <div className="home-features-grid">
            {featureItems.map((item, index) => (
              <motion.div
                key={index}
                className="home-feature-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="home-feature-icon-container">
                  {item.icon}
                </div>
                <h3 className="home-feature-title">{item.title}</h3>
                <p className="home-feature-description">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;