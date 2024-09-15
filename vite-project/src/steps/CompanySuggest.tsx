// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import StarRating from '../components/StarRating';

// interface JobSeekingResultsProps {
//   region: string;
//   industry: string;
// }

// interface Company {
//   primary_abn: number;
//   primary_employer_name: string;
//   primary_division_name: string;
//   primary_abn_score: number;
//   State: string;
//   "Action on gender equality": string; 
//   "Employee support": string; 
//   "Flexible work": string; 
//   "Workplace overview": string; 
// }


// function isCompany(obj: unknown): obj is Company {
//   return (
//     typeof obj === 'object' &&
//     obj !== null &&
//     'primary_employer_name' in obj &&
//     'primary_abn' in obj &&
//     'primary_division_name' in obj &&
//     'primary_abn_score' in obj &&
//     typeof (obj as Company).primary_abn === 'number'
//   );
// }

// function areCompanies(arr: unknown[]): arr is Company[] {
//   return Array.isArray(arr) && arr.every(isCompany);
// }

// const JobSeekingResults: React.FC<JobSeekingResultsProps> = ({ region, industry }) => {
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const companiesPerPage = 5;

//   useEffect(() => {
//     fetchCompanies();
//   }, [region, industry]);

//   const fetchCompanies = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         'https://ve0zg43wv0.execute-api.ap-southeast-2.amazonaws.com/production/api/company_suggest',
//         {
//           params: { state: region, industry: industry }
//         }
//       );
      
//       let companiesData: unknown[];
//       if (typeof response.data.body === 'string') {
//         companiesData = JSON.parse(response.data.body);
//       } else if (Array.isArray(response.data)) {
//         companiesData = response.data;
//       } else if (response.data && typeof response.data === 'object') {
//         companiesData = Object.values(response.data).flat();
//       } else {
//         throw new Error('Unexpected data format');
//       }

//       if (areCompanies(companiesData)) {
//         const filteredCompanies = companiesData.filter(
//           (company) => company.primary_division_name.toLowerCase() === industry.toLowerCase()
//         );
//         setCompanies(filteredCompanies);
//       } else {
//         throw new Error('Data does not match expected format');
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         setError(`Error fetching company data: ${err.message}`);
//       } else {
//         setError(`An unexpected error occurred: ${(err as Error).message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPages = Math.ceil(companies.length / companiesPerPage);
//   const indexOfLastCompany = currentPage * companiesPerPage;
//   const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
//   const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   if (loading) {
//     return <div>Loading recommended companies...</div>;
//   }

//   if (error) {
//     return <div style={{ color: 'red' }}>{error}</div>;
//   }

//   return (
//     <div>
//       <h3>Recommended Companies List - {region} ({industry})</h3>
//       <div style={cardContainerStyle}>
//         {currentCompanies.length > 0 ? (
//           currentCompanies.map((company, index) => (
//             <div key={index} style={longCardStyle}>
//               <div style={cardHeaderStyle}>
//                 <h4>{company.primary_employer_name}</h4>
//                 <p><strong>ABN:</strong> {company.primary_abn}</p>
//                 <p><strong>Industry:</strong> {company.primary_division_name}</p>
//               </div>
//               <div style={cardContentStyle}>
//                 <p><strong>Total Score:</strong> <StarRating score={company.primary_abn_score} /></p>
//                 <p><strong>Gender Equality Action Score:</strong> 
//                   <StarRating score={Number(company["Action on gender equality"])} />
//                 </p>
//                 <p><strong>Employee Support Score:</strong> 
//                   <StarRating score={Number(company["Employee support"])} />
//                 </p>
//                 <p><strong>Flexible Work Score:</strong> 
//                   <StarRating score={Number(company["Flexible work"])} />
//                 </p>
//                 <p><strong>Workplace Overview Score:</strong> 
//                   <StarRating score={Number(company["Workplace overview"])} />
//                 </p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div>No companies found for the selected industry and region</div>
//         )}
//       </div>

//       <div style={paginationStyle}>
//         {Array.from({ length: totalPages }, (_, index) => (
//           <button
//             key={index + 1}
//             onClick={() => paginate(index + 1)}
//             style={{
//               ...paginationButtonStyle,
//               backgroundColor: currentPage === index + 1 ? '#4CAF50' : '#f2f2f2',
//             }}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// const cardContainerStyle: React.CSSProperties = {
//   display: 'flex',
//   flexDirection: 'column',
//   gap: '16px',
//   marginTop: '16px',
// };

// const longCardStyle: React.CSSProperties = {
//   display: 'flex',
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   border: '1px solid #ddd',
//   borderRadius: '8px',
//   padding: '16px',
//   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//   backgroundColor: '#f9f9f9',
//   width: '100%',
//   maxWidth: '900px',
//   margin: '0 auto',
// };

// const cardHeaderStyle: React.CSSProperties = {
//   flex: 1,
//   marginRight: '16px',
// };

// const cardContentStyle: React.CSSProperties = {
//   flex: 2,
//   display: 'flex',
//   flexDirection: 'column',
//   gap: '8px',
// };

// const paginationStyle: React.CSSProperties = {
//   display: 'flex',
//   justifyContent: 'center',
//   marginTop: '16px',
// };

// const paginationButtonStyle: React.CSSProperties = {
//   padding: '8px 16px',
//   margin: '0 4px',
//   borderRadius: '4px',
//   cursor: 'pointer',
//   border: '1px solid #ddd',
// };

// export default JobSeekingResults;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 5;

  useEffect(() => {
    fetchCompanies();
  }, [region, industry]);

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

  const totalPages = Math.ceil(companies.length / companiesPerPage);
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading recommended companies...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h3>Recommended Companies List - {region} ({industry})</h3>
      <div style={cardContainerStyle}>
        {currentCompanies.length > 0 ? (
          currentCompanies.map((company, index) => (
            <div key={index} style={longCardStyle}>
              <div style={cardHeaderStyle}>
                <h4>{company.primary_employer_name}</h4>
                <p><strong>ABN:</strong> {company.primary_abn}</p>
                <p><strong>Industry:</strong> {company.primary_division_name}</p>
              </div>
              <div style={cardContentStyle}>
                <p><strong>Total Score:</strong> <StarRating score={company.primary_abn_score} /></p>
                <p><strong>Gender Equality Action Score:</strong> 
                  <StarRating score={Number(company["Action on gender equality"])} />
                </p>
                <p><strong>Employee Support Score:</strong> 
                  <StarRating score={Number(company["Employee support"])} />
                </p>
                <p><strong>Flexible Work Score:</strong> 
                  <StarRating score={Number(company["Flexible work"])} />
                </p>
                <p><strong>Workplace Overview Score:</strong> 
                  <StarRating score={Number(company["Workplace overview"])} />
                </p>
              </div>
            </div>
          ))
        ) : (
          <div>No companies found for the selected industry and region</div>
        )}
      </div>

      <div style={paginationStyle}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            style={{
              ...paginationButtonStyle,
              backgroundColor: currentPage === index + 1 ? '#4CAF50' : '#f2f2f2',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div style={previousButtonContainerStyle}>
        <button
          onClick={onPrevious}
          style={previousButtonStyle}
        >
          Previous
        </button>
      </div>
    </div>
  );
};

const cardContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '16px',
};

const longCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
};

const cardHeaderStyle: React.CSSProperties = {
  flex: 1,
  marginRight: '16px',
};

const cardContentStyle: React.CSSProperties = {
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '16px',
};

const paginationButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  margin: '0 4px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '1px solid #ddd',
};

const previousButtonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '16px',
};

const previousButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#f2f2f2',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default JobSeekingResults;