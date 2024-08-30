import React from 'react';
import { Link } from 'react-router-dom';
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
          <p className="home-subtitle">Empowering gender equality in the workplace</p>
          <div className="home-buttons">
            <Link to="/PayGapMap">
              <button className="home-button">Pay Gap Map</button>
            </Link>
            <Link to="/LabourForceChart">
              <button className="home-button">Labour Force Chart</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="about-section">
        <div className="about-content">
          <h2>About Equal Career</h2>
          <p>
            Equal Career is dedicated to promoting gender equality in the workplace. 
            Our platform provides tools and resources to help organizations close the gender pay gap 
            and create more inclusive work environments.
          </p>
          <section className="mission">
            <h2>Our Mission</h2>
            <div className="mission-items">
              <div className="mission-item">
                <img src="/icon1.png" alt="Policy making" />
                <p>Support evidence-based<br />policy making</p>
              </div>
              <div className="mission-item">
                <img src="/icon2.png" alt="Gender challenges" />
                <p>Raise awareness of workplace<br />gender challenges</p>
              </div>
              <div className="mission-item">
                <img src="/icon3.png" alt="Progress tracking" />
                <p>Track progress over time</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;