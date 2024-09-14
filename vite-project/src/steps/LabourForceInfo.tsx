import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import '../styles/LabourForceInfo.css';

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
  onLabourForceChoice,
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
      const response = await axios.get(
        'https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/labour-force',
        {
          params: { industry: selectedIndustry },
        }
      );
      const parsedData: LabourForceData[] = JSON.parse(response.data.body);

      const filteredData = parsedData.find(
        (item) => item.industry === selectedIndustry
      );
      if (filteredData) {
        setLabourForceData(filteredData);
      } else {
        setError('No data found for the selected industry.');
      }
    } catch (err) {
      setError('Failed to fetch labour force data.');
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div className="labour-force-info" initial="hidden" animate="visible" variants={fadeInVariants}>
      {showLabourForceQuestion && (
        <>
          <h2 className="title">
            Would you like to learn more about the labour force?
          </h2>
          <div className="button-container">
            <NavLink to="/" className="button-link">
              <button className="button button-home">
                Return to Home
              </button>
            </NavLink>
            <button
              className="button button-next"
              onClick={() => handleLabourForceChoice('next')}
            >
              {showInfo ? 'Refresh Labour Force Info' : 'Show Labour Force Info'}
            </button>
          </div>
        </>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {showInfo && labourForceData && (
        <>
          <h2 className="title">
            Labour Force Information for {labourForceData.industry}
          </h2>

          <div className="data-card-container">
            <motion.div
              className="data-card men-women-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>Men & Women</h3>
              <div className="progress-bar-container">
                <motion.div
                  className="progress-bar-fill progress-bar-men"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(labourForceData.men / labourForceData.total_employees) * 100}%`,
                  }}
                  transition={{ duration: 1 }}
                />
                <motion.div
                  className="progress-bar-fill progress-bar-women"
                  initial={{ width: '100%' }}
                  animate={{
                    width: `${(labourForceData.women / labourForceData.total_employees) * 100}%`,
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
              <Typography className="typography-body2">
                Men: {((labourForceData.men / labourForceData.total_employees) * 100).toFixed(2)}%, 
                Women: {((labourForceData.women / labourForceData.total_employees) * 100).toFixed(2)}%
              </Typography>
            </motion.div>

            <motion.div
              className="data-card small-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>Difference</h3>
              <Typography className="typography-h5">
                {labourForceData.difference.toLocaleString()}
              </Typography>
            </motion.div>

            <motion.div
              className="data-card small-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>Total Employees</h3>
              <Typography className="typography-h5">
                {labourForceData.total_employees.toLocaleString()}
              </Typography>
            </motion.div>

            <motion.div
              className="data-card small-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3>Gender Gap Ratio</h3>
              <Typography className="typography-h5">
                {labourForceData.gap_ratio.toFixed(2)}%
              </Typography>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default LabourForceInfo;