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
          <p className="home-subtitle">Empowering gender equality in the workplace</p>
          <p className="home-description">
            Equal Career is dedicated to promoting gender equality in the workplace. 
            Our platform provides tools and resources to help organizations close the gender pay gap 
            and create more inclusive work environments.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;