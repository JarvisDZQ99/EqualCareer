import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      color: '#02426c',
      padding: '1rem',
      textAlign: 'center',
      marginTop: 'auto',
      fontFamily: "'Montserrat', sans-serif" 
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Equal Career. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
