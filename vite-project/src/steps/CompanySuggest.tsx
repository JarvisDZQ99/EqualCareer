import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUp, ArrowDown } from 'lucide-react';
import StarRating from '../components/StarRating';
import '../styles/CompanySuggest.css';

interface JobSeekingResultsProps {
  region: string;
  industry: string;
  onPrevious: () => void;
}

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

interface ScoreOptions {
  [key: string]: boolean;
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

const JobSeekingResults: React.FC<JobSeekingResultsProps> = ({ region, industry, onPrevious }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriterion, setSortCriterion] = useState<keyof Company>('primary_abn_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState('');
  const [scoreOptions, setScoreOptions] = useState<ScoreOptions>({
    "Total Score": true,
    "Gender Equality Action": true,
    "Employee Support": true,
    "Flexible Work": true,
    "Workplace Overview": true
  });
  const companiesPerPage = 5;

  useEffect(() => {
    fetchCompanies();
  }, [region, industry]);

  useEffect(() => {
    filterCompanies();
  }, [companies, filterText]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/company_suggest',
        {
          params: { state: region, industry: industry }
        }
      );
      
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
        const filteredCompanies = companiesData.filter(
          (company) => company.primary_division_name.toLowerCase() === industry.toLowerCase()
        );
        setCompanies(filteredCompanies);
      } else {
        throw new Error('Data does not match expected format');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error fetching company data: ${err.message}`);
      } else {
        setError(`An unexpected error occurred: ${(err as Error).message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    const filtered = companies.filter(company => 
      company.primary_employer_name.toLowerCase().includes(filterText.toLowerCase()) ||
      company.primary_division_name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1);
  };

  const sortCompanies = (companies: Company[], criterion: keyof Company, order: 'asc' | 'desc') => {
    return [...companies].sort((a, b) => {
      const aValue = Number(a[criterion]) || 0;
      const bValue = Number(b[criterion]) || 0;
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const handleSort = (criterion: keyof Company) => {
    if (criterion === sortCriterion) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriterion(criterion);
      setSortOrder('desc');
    }
  };

  const handleScoreOptionChange = (option: string) => {
    setScoreOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const sortedCompanies = sortCompanies(filteredCompanies, sortCriterion, sortOrder);
  const totalPages = Math.ceil(sortedCompanies.length / companiesPerPage);
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = sortedCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const SortingSection: React.FC = () => (
    <div className="sorting-container">
      <label htmlFor="sort-select" className="label">Sort companies by: </label>
      <select
        id="sort-select"
        value={sortCriterion}
        onChange={(e) => handleSort(e.target.value as keyof Company)}
        className="select"
      >
        <option value="primary_abn_score">Total Score</option>
        <option value="Action on gender equality">Gender Equality Action Score</option>
        <option value="Employee support">Employee Support Score</option>
        <option value="Flexible work">Flexible Work Score</option>
        <option value="Workplace overview">Workplace Overview Score</option>
      </select>
      <button 
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} 
        className="sort-order-button"
      >
        {sortOrder === 'asc' 
          ? <><ArrowUp size={18} /> Ascending</> 
          : <><ArrowDown size={18} /> Descending</>
        }
      </button>
    </div>
  );

  const ScoreOptions: React.FC = () => (
    <div className="score-options">
      {Object.entries(scoreOptions).map(([option, checked]) => (
        <label key={option} className="score-option">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => handleScoreOptionChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );

  const ScoreItem: React.FC<{ title: string; score: number }> = ({ title, score }) => (
    scoreOptions[title] && (
      <div className="score-item">
        <span className="score-title">{title}:</span>
        <StarRating score={score} />
      </div>
    )
  );

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Recommended Companies - {region} ({industry})</h2>
      <div className="user-info-form-info-box">
        <span className="user-info-form-info-icon">ℹ</span>
        Below are the recommended companies based on your selected region and industry. You can sort and filter the companies using the options below.
      </div>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by company name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="filter-input"
        />
      </div>
      <SortingSection />
      <ScoreOptions />
      <div className="card-container">
        {currentCompanies.length > 0 ? (
          currentCompanies.map((company, index) => (
            <div key={index} className="card">
              <div className="card-header">
                <h3 className="company-name">{company.primary_employer_name}</h3>
                <p className="info"><strong>ABN:</strong> {company.primary_abn}</p>
                <p className="info"><strong>Industry:</strong> {company.primary_division_name}</p>
              </div>
              <div className="card-content">
                <ScoreItem title="Total Score" score={company.primary_abn_score} />
                <ScoreItem title="Gender Equality Action" score={Number(company["Action on gender equality"])} />
                <ScoreItem title="Employee Support" score={Number(company["Employee support"])} />
                <ScoreItem title="Flexible Work" score={Number(company["Flexible work"])} />
                <ScoreItem title="Workplace Overview" score={Number(company["Workplace overview"])} />
              </div>
            </div>
          ))
        ) : (
          <div className="no-companies">No companies found for the selected criteria</div>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="previous-button-container">
        <button onClick={onPrevious} className="previous-button">
          Previous
        </button>
      </div>
      <p className="wgea-resource">
        For resources and more information on gender equality in the workplace, visit the 
        <a href="https://www.wgea.gov.au" target="_blank" rel="noopener noreferrer" className="wgea-link"> Workplace Gender Equality Agency (WGEA)</a>.
      </p>
    </div>
  );
};

export default JobSeekingResults;