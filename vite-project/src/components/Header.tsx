import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../pages/styles/Header.css';
import logoImage from '/logo.png';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logoImage} alt="Equal Career Logo" className="logo-image" />
        <h1>Equal Career</h1>
      </Link>
      <nav>
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/journey"
          className={`nav-link ${location.pathname === '/journey' ? 'active' : ''}`}
        >
          Career Journey
        </Link>
      </nav>
    </header>
  );
};

export default Header;
