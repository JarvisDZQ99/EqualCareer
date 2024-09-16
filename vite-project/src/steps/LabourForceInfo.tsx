import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
  onLabourForceChoice: (choice: 'home' | 'previous') => void;
}

const LabourForceInfo: React.FC<LabourForceInfoProps> = ({
  selectedIndustry,
  onLabourForceChoice,
}) => {
  const [labourForceData, setLabourForceData] = useState<LabourForceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    if (selectedIndustry) {
      fetchLabourForceData();
    }
  }, [selectedIndustry]);

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

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getSummary = (type: string) => {
    if (!labourForceData) return '';

    switch (type) {
      case 'difference':
        return `The difference between men and women in the ${selectedIndustry} industry is ${labourForceData.difference.toLocaleString()} employees.`;
      case 'total':
        return `The total number of employees in the ${selectedIndustry} industry is ${labourForceData.total_employees.toLocaleString()}.`;
      case 'ratio':
        return `The gender gap ratio in the ${selectedIndustry} industry is ${labourForceData.gap_ratio.toFixed(2)}%. This indicates the relative difference between men and women in the workforce.`;
      default:
        return '';
    }
  };

  const toggleCard = (cardType: string) => {
    if (expandedCard === cardType) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardType);
    }
  };

  const ExpandableCard: React.FC<{
    title: string;
    value: string | number;
    type: string;
  }> = ({ title, value, type }) => (
    <motion.div
      className={`data-card small-card ${expandedCard === type ? 'expanded' : ''}`}
      onClick={() => toggleCard(type)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <h3>{title}</h3>
      <Typography className="typography-h5">{value}</Typography>
      <AnimatePresence>
        {expandedCard === type && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-summary"
          >
            <Typography>{getSummary(type)}</Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.div className="labour-force-info" initial="hidden" animate="visible" variants={fadeInVariants}>
      <h2 className="title">
        Labour Force Information for {selectedIndustry}
      </h2>

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

      {labourForceData && (
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

          <ExpandableCard
            title="Difference"
            value={labourForceData.difference.toLocaleString()}
            type="difference"
          />

          <ExpandableCard
            title="Total Employees"
            value={labourForceData.total_employees.toLocaleString()}
            type="total"
          />

          <ExpandableCard
            title="Gender Gap Ratio"
            value={`${labourForceData.gap_ratio.toFixed(2)}%`}
            type="ratio"
          />
        </div>
      )}

      <div className="labourbutton-container">
        <button
          className="labourbutton labourbutton-secondary"
          onClick={() => onLabourForceChoice('previous')}
        >
          Previous
        </button>
      </div>
    </motion.div>
  );
};

export default LabourForceInfo;
