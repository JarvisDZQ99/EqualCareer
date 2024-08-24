import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      color: '#333',
      padding: '1rem',
      textAlign: 'center',
      borderTop: '1px solid #e7e7e7',
      marginTop: 'auto'
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Equal Career. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;