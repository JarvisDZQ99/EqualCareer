import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Typography, CircularProgress, Box } from '@mui/material';
import IndustryGenderDistribution from './IndustryGenderDistribution';
import CompanySizeGenderDistribution from './CompanySizeGenderDistribution';
import '../styles/LabourForceInfo.css';

interface LabourForceData {
  industry: string;
  men: number;
  women: number;
  difference: number;
  total_employees: number;
  gap_ratio: number;
}

interface IndustrySizeData {
  industry: string;
  submission_group_size: string;
  men: number;
  women: number;
  difference: number;
  total_employees: number;
  gap_ratio: number;
}

interface LabourForceInfoProps {
  selectedIndustry: string;
  onLabourForceChoice: (choice: 'home' | 'previous' | 'payGap') => void;
}

const LabourForceInfo: React.FC<LabourForceInfoProps> = ({
  selectedIndustry,
  onLabourForceChoice,
}) => {
  const [labourForceData, setLabourForceData] = useState<LabourForceData | null>(null);
  const [industrySizeData, setIndustrySizeData] = useState<IndustrySizeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedIndustry) {
      fetchLabourForceData();
      fetchIndustrySizeData();
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
      const filteredData = parsedData.find(item => item.industry === selectedIndustry);
      
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

  const fetchIndustrySizeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/generalfunc3'
      );
      const parsedData: IndustrySizeData[] = JSON.parse(response.data.body);
      const filteredData = parsedData.filter(item => item.industry === selectedIndustry);
      
      if (filteredData.length > 0) {
        setIndustrySizeData(filteredData);
      } else {
        setError('No size data found for the selected industry.');
      }
    } catch (err) {
      setError('Failed to fetch industry size data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div className="labour-force-info" initial="hidden" animate="visible" variants={fadeInVariants}>
      <h2 className="title">
        Labour Force Information for {selectedIndustry}
      </h2>
      <div className="user-info-form-info-box">
        <span className="user-info-form-info-icon">ℹ</span>
        This section provides an overview of the labour force data in your selected industry. <br />
        You can explore the total number of employees, the gender distribution, and the gender gap ratio. <br />
        The chart below shows the breakdown by company size.
      </div>
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
        <>
          <IndustryGenderDistribution data={labourForceData} />
          {industrySizeData.length > 0 && (
            <CompanySizeGenderDistribution data={industrySizeData} industry={selectedIndustry} />
          )}
        </>
      )}

      <div className="labourbutton-container">
        <button
          className="labourbutton labourbutton-secondary"
          onClick={() => onLabourForceChoice('previous')}
        >
          Previous Step
        </button>
        <button
          className="labourbutton labourbutton-primary"
          onClick={() => onLabourForceChoice('payGap')}
        >
          Show Pay Gap Analysis
        </button>
      </div>
      <p className="wgea-resource">
        For resources and more information on gender equality in the workplace, visit the   
        <a href="https://www.wgea.gov.au" target="_blank" rel="noopener noreferrer" className="wgea-link"> Workplace Gender Equality Agency (WGEA)</a>.
      </p>
    </motion.div>
  );
};

export default LabourForceInfo;