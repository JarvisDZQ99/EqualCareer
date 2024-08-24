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
        <Link to="/paygapmap" className="nav-link">Pay Gap Map</Link>
        <Link to="/labourforcechart" className="nav-link">Labour Force Chart</Link>
      </nav>
    </header>
  );
};

export default Header;