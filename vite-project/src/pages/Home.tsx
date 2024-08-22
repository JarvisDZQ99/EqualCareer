import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home: React.FC = () => {
    return (
      <div className="container">
        <Header />
        <div className="home-content">
          <h1 className="home-header">Welcome to the Gender Equality Dashboard</h1>
        </div>
        <Footer />
      </div>
    );
  };

export default Home;
