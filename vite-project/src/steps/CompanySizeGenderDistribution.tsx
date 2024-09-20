import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

interface IndustrySizeData {
  industry: string;
  submission_group_size: string;
  men: number;
  women: number;
  difference: number;
  total_employees: number;
  gap_ratio: number;
}

interface CompanySizeGenderDistributionProps {
  data: IndustrySizeData[];
  industry: string;
}

const CompanySizeGenderDistribution: React.FC<CompanySizeGenderDistributionProps> = ({ data, industry }) => {
  const sizeOrder = {
    '< 250 employees': 1,
    '250-499 employees': 2,
    '500-999 employees': 3,
    '1000-4999 employees': 4,
    '5000+ employees': 5
  };

  const sortedData = [...data].sort((a, b) => 
    sizeOrder[a.submission_group_size as keyof typeof sizeOrder] - 
    sizeOrder[b.submission_group_size as keyof typeof sizeOrder]
  );

  const chartData = sortedData.map(item => ({
    size: item.submission_group_size,
    Men: item.men,
    Women: item.women,
    gapRatio: item.gap_ratio
  }));

  return (
    <Card className="company-size-distribution">
      <CardContent>
        <Typography variant="h5" className="section-title">
          {industry} - Employee Distribution by Company Size
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="size" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: '#f8f9fa', border: 'none', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="Men" fill="#4a90e2" />
            <Bar dataKey="Women" fill="#e15f81" />
          </BarChart>
        </ResponsiveContainer>
        <div className="gap-ratio-title">
          <span className="title-accent"></span>
          <Typography variant="h6">Gap Ratio by Company Size</Typography>
          <span className="title-accent"></span>
        </div>
        <div className="info-card-container">
          {chartData.map((item, index) => (
            <motion.div
              key={index}
              className="info-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Typography variant="subtitle1" className="info-card-title">
                {item.size}
              </Typography>
              <Typography variant="h4" className="info-card-value">
                {item.gapRatio.toFixed(2)}%
              </Typography>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySizeGenderDistribution;