import React from 'react';

interface InfoPopupProps {
  stateName: string;
  date: string;
  payGap: string;
  onClose: () => void;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ stateName, date, payGap, onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }}>
      <h2 style={{ marginTop: 0 }}>{stateName}</h2>
      <p>Date: {date}</p>
      <p>Gender Pay Gap: {payGap}</p>
      <button onClick={onClose} style={{
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}>
        Close
      </button>
    </div>
  );
};

export default InfoPopup;