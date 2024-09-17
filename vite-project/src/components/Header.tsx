import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import logoImage from '/logo.png';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const location = useLocation();

  return (
    <header className={`header ${className}`}>
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