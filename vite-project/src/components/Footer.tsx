import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={className} style={{
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