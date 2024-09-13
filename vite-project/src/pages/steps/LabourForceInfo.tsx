import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

interface LabourForceData {
  industry: string;
  men: number;
  women: number;
  difference: number;
  total_employees: number;
  gap_ratio: number;
}

interface LabourForceInfoProps {
  selectedIndustry: string;
  showLabourForceQuestion: boolean;
  onLabourForceChoice: (choice: 'home' | 'next') => void;
}

const LabourForceInfo: React.FC<LabourForceInfoProps> = ({ 
  selectedIndustry, 
  showLabourForceQuestion, 
  onLabourForceChoice 
}) => {
  const [labourForceData, setLabourForceData] = useState<LabourForceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (showInfo && selectedIndustry) {
      fetchLabourForceData();
    }
  }, [selectedIndustry, showInfo]);

  const fetchLabourForceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/labour-force', {
        params: { industry: selectedIndustry },
      });
      const parsedData: LabourForceData[] = JSON.parse(response.data.body);

      const filteredData = parsedData.find((item) => item.industry === selectedIndustry);
      if (filteredData) {
        setLabourForceData(filteredData);
      } else {
        setError('No data found for the selected industry.');
      }
    } catch (err) {
      setError('Failed to fetch labour force data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLabourForceChoice = (choice: 'home' | 'next') => {
    if (choice === 'next') {
      setShowInfo(true);
    } else {
      onLabourForceChoice(choice);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const containerStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '8px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.8em',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  };

  const thTdStyle: React.CSSProperties = {
    padding: '12px 15px',
    textAlign: 'center',
    border: '1px solid #ddd',
    fontSize: '1.1em',
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 15px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <motion.div
      style={containerStyle}
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      {showLabourForceQuestion && (
        <>
          <h2 style={titleStyle}>Would you like to know more about Labour Force information?</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <button 
                style={{...buttonStyle, backgroundColor: '#f44336'}}
              >
                Go back to Home
              </button>
            </NavLink>
            <button 
              style={{...buttonStyle, backgroundColor: '#4CAF50'}}
              onClick={() => handleLabourForceChoice('next')}
            >
              {showInfo ? 'Refresh Labour Force Info' : 'Show Labour Force Info'}
            </button>
          </div>
        </>
      )}

      {loading && <p>Loading labour force data...</p>}
      
      {error && <p>{error}</p>}

      {showInfo && labourForceData && (
        <>
          <motion.h2 style={titleStyle} variants={fadeInVariants}>
            Labour Force Information for {labourForceData.industry}
          </motion.h2>
          <motion.table style={tableStyle} variants={fadeInVariants}>
            <thead>
              <tr>
                <th style={{ ...thTdStyle, ...thStyle }}>Men</th>
                <th style={{ ...thTdStyle, ...thStyle }}>Women</th>
                <th style={{ ...thTdStyle, ...thStyle }}>Difference</th>
                <th style={{ ...thTdStyle, ...thStyle }}>Total Employees</th>
                <th style={{ ...thTdStyle, ...thStyle }}>Gender Gap Ratio (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={thTdStyle}>{labourForceData.men.toLocaleString()}</td>
                <td style={thTdStyle}>{labourForceData.women.toLocaleString()}</td>
                <td style={thTdStyle}>{labourForceData.difference.toLocaleString()}</td>
                <td style={thTdStyle}>{labourForceData.total_employees.toLocaleString()}</td>
                <td style={thTdStyle}>{labourForceData.gap_ratio.toFixed(2)}%</td>
              </tr>
            </tbody>
          </motion.table>
        </>
      )}
    </motion.div>
  );
};

export default LabourForceInfo;
