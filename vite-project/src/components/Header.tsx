import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; 

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Gender Equality Dashboard</h1>
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