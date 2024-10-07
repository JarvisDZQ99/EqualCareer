import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer 
      className={className} 
      style={{
        padding: '1rem',
        textAlign: 'center',
        marginTop: 'auto',
        fontFamily: "'Montserrat', sans-serif", 
        color: "#333",
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      <p style={{ 
        margin: 0, 
        fontSize: '0.9rem',
        maxWidth: '1200px', 
        width: '100%', 
      }}>
        &copy; {new Date().getFullYear()} Equal Career. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;