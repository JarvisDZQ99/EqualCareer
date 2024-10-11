import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`header ${className} ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        <div className="logo-text">
          <span className="logo-equal">Equal</span>
          <span className="logo-career">Career</span>
        </div>
      </Link>
      <nav className="nav">
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