import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';
import '../styles/CompanyDetail.css';

interface Company {
  primary_abn: number;
  primary_employer_name: string;
  primary_division_name: string;
  primary_abn_score: number;
  State: string;
  "Action on gender equality": string;
  "Employee support": string;
  "Flexible work": string;
  "Workplace overview": string;
}

interface CompanyDetails extends Company {
  total_employees?: number;
  submission_group_size?: string;
  manager_men?: number;
  manager_women?: number;
  non_manager_men?: number;
  non_manager_women?: number;
}

interface CompanyDetailProps {
  company: Company;
  onBack: () => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company, onBack }) => {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/generalfunc4', {
          params: { company_name: company.primary_employer_name }
        });
        if (response.data && response.data.length > 0) {
          setCompanyDetails({ ...company, ...response.data[0] });
        } else {
          setError('No additional data available for this company.');
        }
      } catch (err) {
        setError('Failed to fetch company details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [company.primary_employer_name]);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!companyDetails) {
    return <div className="no-data">No additional data available for this company.</div>;
  }

  return (
    <div className="company-detail-container">
      <button onClick={onBack} className="back-button">Back to Results</button>
      <h1 className="company-name">{companyDetails.primary_employer_name}</h1>
      <div className="company-info">
        <p><strong>Industry:</strong> {companyDetails.primary_division_name}</p>
        <p><strong>State:</strong> {companyDetails.State}</p>
        <p><strong>Total Employees:</strong> {companyDetails.total_employees || 'N/A'}</p>
        <p><strong>Group Size:</strong> {companyDetails.submission_group_size || 'N/A'}</p>
      </div>
      <div className="scores-container">
        <h2>Gender Equality Scores</h2>
        <div className="score-item">
          <span>Total Score:</span>
          <StarRating score={companyDetails.primary_abn_score} />
        </div>
        <div className="score-item">
          <span>Gender Equality Action:</span>
          <StarRating score={Number(companyDetails["Action on gender equality"])} />
        </div>
        <div className="score-item">
          <span>Employee Support:</span>
          <StarRating score={Number(companyDetails["Employee support"])} />
        </div>
        <div className="score-item">
          <span>Flexible Work:</span>
          <StarRating score={Number(companyDetails["Flexible work"])} />
        </div>
        <div className="score-item">
          <span>Workplace Overview:</span>
          <StarRating score={Number(companyDetails["Workplace overview"])} />
        </div>
      </div>
      <div className="workforce-composition">
        <h2>Workforce Composition</h2>
        <p>Managers (Men): {companyDetails.manager_men || 'N/A'}</p>
        <p>Managers (Women): {companyDetails.manager_women || 'N/A'}</p>
        <p>Non-Managers (Men): {companyDetails.non_manager_men || 'N/A'}</p>
        <p>Non-Managers (Women): {companyDetails.non_manager_women || 'N/A'}</p>
      </div>
      <p className="wgea-resource">
        For more information on gender equality in the workplace, visit the 
        <a href="https://www.wgea.gov.au" target="_blank" rel="noopener noreferrer" className="wgea-link"> Workplace Gender Equality Agency (WGEA)</a>.
      </p>
    </div>
  );
};

export default CompanyDetail;