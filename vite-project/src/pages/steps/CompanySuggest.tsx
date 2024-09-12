import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface JobSeekingResultsProps {
  region: string;
  industry: string;
}

interface Company {
  primary_abn: number;
  primary_employer_name: string;
  primary_division_name: string;
  primary_abn_score: number;
  State: string;
  Action_on_gender_equality: string;
  Employee_support: string;
  Flexible_work: string;
  Workplace_overview: string;
}

function isCompany(obj: unknown): obj is Company {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'primary_employer_name' in obj &&
    'primary_abn' in obj &&
    'primary_division_name' in obj &&
    'primary_abn_score' in obj &&
    typeof (obj as Company).primary_abn === 'number'
  );
}

function areCompanies(arr: unknown[]): arr is Company[] {
  return Array.isArray(arr) && arr.every(isCompany);
}

const JobSeekingResults: React.FC<JobSeekingResultsProps> = ({ region, industry }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [region, industry]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/company_suggest', {
        params: { state: region, industry: industry }
      });
      console.log('Server response:', response.data);

      let companiesData: unknown[];
      if (typeof response.data.body === 'string') {
        companiesData = JSON.parse(response.data.body);
      } else if (Array.isArray(response.data)) {
        companiesData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        companiesData = Object.values(response.data).flat();
      } else {
        throw new Error('Unexpected data format');
      }

      if (areCompanies(companiesData)) {
        const filteredCompanies = companiesData.filter(company => 
          company.primary_division_name.toLowerCase() === industry.toLowerCase()
        );
        setCompanies(filteredCompanies);
      } else {
        console.error('Invalid company data:', companiesData);
        throw new Error('Data does not match expected format');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error fetching company data: ${err.message}`);
        console.error('API error details:', err.response?.data);
      } else {
        setError(`An unexpected error occurred: ${(err as Error).message}`);
      }
      console.error('Error fetching company data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading recommended companies...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h3>Recommended Companies List - {region} ({industry})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Company Name</th>
            <th style={tableHeaderStyle}>ABN</th>
            <th style={tableHeaderStyle}>Division</th>
            <th style={tableHeaderStyle}>Score</th>
            <th style={tableHeaderStyle}>Gender Equality Action</th>
            <th style={tableHeaderStyle}>Employee Support</th>
            <th style={tableHeaderStyle}>Flexible Work</th>
            <th style={tableHeaderStyle}>Workplace Overview</th>
          </tr>
        </thead>
        <tbody>
          {companies.length > 0 ? (
            companies.map((company, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{company.primary_employer_name}</td>
                <td style={tableCellStyle}>{company.primary_abn}</td>
                <td style={tableCellStyle}>{company.primary_division_name}</td>
                <td style={tableCellStyle}>{company.primary_abn_score}</td>
                <td style={tableCellStyle}>{company.Action_on_gender_equality}</td>
                <td style={tableCellStyle}>{company.Employee_support}</td>
                <td style={tableCellStyle}>{company.Flexible_work}</td>
                <td style={tableCellStyle}>{company.Workplace_overview}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>No companies found for the selected industry and region</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd'
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid #ddd'
};

export default JobSeekingResults;
