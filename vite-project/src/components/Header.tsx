import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logoImage from '/logo.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logoImage} alt="Equal Career Logo" className="logo-image" />
        <h1>Equal Career</h1>
      </div>
      <nav>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/journey" className="nav-link">Career Journey</Link>
      </nav>
    </header>
  );
};

export default Header;