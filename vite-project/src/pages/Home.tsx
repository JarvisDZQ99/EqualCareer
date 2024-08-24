import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="container">
      <div className="background-shape shape-1"></div>
      <div className="background-shape shape-2"></div>
      <div className="background-shape shape-3"></div>
      <Header />
      <div className="home-content">
        <section className="home-section">
          <h2 className="home-section-title">Addressing Workplace Inequality in Australia</h2>
          <p className="home-paragraph">
            Despite recent progress, gender inequality remains a significant challenge in Australian workplaces. 
            Our dashboard visualizes key data to drive awareness and inform policy decisions.
          </p>
        </section>

        <section className="home-section">
          <h2 className="home-section-title">Key Issues We're Tracking:</h2>
          <ul className="home-list">
            <li className="home-list-item">
              <strong>Gender Pay Gap:</strong> Currently at 11.5% (a record low)
              <br />
              <Link to="/paygapmap" className="home-link">Explore our Pay Gap Map</Link>
            </li>
            <li className="home-list-item">
              <strong>Labour Force Participation:</strong> Examining gender differences
              <br />
              <Link to="/labourforcechart" className="home-link">View our Labour Force Chart</Link>
            </li>
          </ul>
        </section>

        <section className="home-section">
          <h2 className="home-section-title">Our Mission</h2>
          <p className="home-paragraph">
            We provide data-driven insights into gender equality issues in Australian workplaces, aiming to:
          </p>
          <ul className="home-list">
            <li>Raise awareness of ongoing challenges</li>
            <li>Support evidence-based policy making</li>
            <li>Track progress over time</li>
            <li>Identify areas needing urgent attention</li>
          </ul>
        </section>

        <blockquote className="home-quote">
          "How might we address these systemic inequalities to ensure that women, whether as employers or employees, 
          can fully realize their potential in a fair and inclusive workplace environment?"
        </blockquote>

        <p className="home-call-to-action">
          Help us answer this crucial question. Explore our{' '}
          <Link to="/paygapmap" className="home-link">Pay Gap Map</Link> and{' '}
          <Link to="/labourforcechart" className="home-link">Labour Force Chart</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;