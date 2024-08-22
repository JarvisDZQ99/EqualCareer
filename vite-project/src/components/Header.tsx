import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <h1>Gender Equality Dashboard</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/paygapmap">Pay Gap Map</Link>
        <Link to="/labourforcechart">Labour Force Chart</Link>
      </nav>
    </header>
  );
};

export default Header;
