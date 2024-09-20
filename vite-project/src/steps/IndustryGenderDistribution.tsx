import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, CardContent, Divider } from '@mui/material';

interface LabourForceData {
  industry: string;
  men: number;
  women: number;
  difference: number;
  total_employees: number;
  gap_ratio: number;
}

interface IndustryGenderDistributionProps {
  data: LabourForceData;
}

const IndustryGenderDistribution: React.FC<IndustryGenderDistributionProps> = ({ data }) => {
  const InfoCard: React.FC<{
    title: string;
    value: string | number;
  }> = ({ title, value }) => (
    <motion.div
      className="info-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Typography variant="subtitle1" className="info-card-title">{title}</Typography>
      <Typography variant="h4" className="info-card-value">{value}</Typography>
    </motion.div>
  );

  return (
    <Card className="industry-gender-distribution-card">
      <CardContent>
        <div className="men-women-section">
          <Typography variant="h5" className="section-title">
            Men & Women
          </Typography>
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar-fill progress-bar-men"
              initial={{ width: 0 }}
              animate={{
                width: `${(data.men / data.total_employees) * 100}%`,
              }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="progress-bar-fill progress-bar-women"
              initial={{ width: '100%' }}
              animate={{
                width: `${(data.women / data.total_employees) * 100}%`,
              }}
              transition={{ duration: 1 }}
            />
          </div>
          <Typography className="typography-body2">
            Men: {((data.men / data.total_employees) * 100).toFixed(2)}%, 
            Women: {((data.women / data.total_employees) * 100).toFixed(2)}%
          </Typography>
        </div>

        <Divider style={{ margin: '20px 0' }} />

        <div className="info-card-container">
          <InfoCard
            title="Difference"
            value={data.difference.toLocaleString()}
          />
          <InfoCard
            title="Total Employees"
            value={data.total_employees.toLocaleString()}
          />
          <InfoCard
            title="Gender Gap Ratio"
            value={`${data.gap_ratio.toFixed(2)}%`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryGenderDistribution;