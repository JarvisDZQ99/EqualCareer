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
  submission_group_size?: string;
  total_employees?: number;
  manager_CEOs_men?: number;
  manager_CEOs_women?: number;
  manager_heads_of_business_men?: number;
  manager_heads_of_business_women?: number;
  manager_key_mgmt_personnel_men?: number;
  manager_key_mgmt_personnel_women?: number;
  manager_other_exec_men?: number;
  manager_other_exec_women?: number;
  manager_other_mgmt_men?: number;
  manager_other_mgmt_women?: number;
  manager_overseas_mgmt_men?: number;
  manager_overseas_mgmt_women?: number;
  manager_senior_mgmt_men?: number;
  manager_senior_mgmt_women?: number;
  non_manager_clerical_men?: number;
  non_manager_clerical_women?: number;
  non_manager_service_men?: number;
  non_manager_service_women?: number;
  non_manager_labourers_men?: number;
  non_manager_labourers_women?: number;
  non_manager_operators_men?: number;
  non_manager_operators_women?: number;
  non_manager_other_men?: number;
  non_manager_other_women?: number;
  non_manager_professionals_men?: number;
  non_manager_professionals_women?: number;
  non_manager_sales_men?: number;
  non_manager_sales_women?: number;
  non_manager_technicians_men?: number;
  non_manager_technicians_women?: number;
  manager_men?: number;
  manager_women?: number;
  non_manager_men?: number;
  non_manager_women?: number;
  ceased_paid_leave_mid_mgmt_men?: number;
  ceased_paid_leave_mid_mgmt_women?: number;
  ceased_paid_leave_non_mgmt_men?: number;
  ceased_paid_leave_non_mgmt_women?: number;
  ceased_paid_leave_top_mgmt_men?: number;
  ceased_paid_leave_top_mgmt_women?: number;
  ext_appoint_mid_mgmt_men?: number;
  ext_appoint_mid_mgmt_women?: number;
  ext_appoint_non_mgmt_men?: number;
  ext_appoint_non_mgmt_women?: number;
  ext_appoint_top_mgmt_men?: number;
  ext_appoint_top_mgmt_women?: number;
  internal_appoint_mid_mgmt_men?: number;
  internal_appoint_mid_mgmt_women?: number;
  internal_appoint_non_mgmt_men?: number;
  internal_appoint_non_mgmt_women?: number;
  internal_appoint_top_mgmt_men?: number;
  internal_appoint_top_mgmt_women?: number;
  primary_carers_mid_mgmt_men?: number;
  primary_carers_mid_mgmt_women?: number;
  primary_carers_non_mgmt_men?: number;
  primary_carers_non_mgmt_women?: number;
  primary_carers_top_mgmt_men?: number;
  primary_carers_top_mgmt_women?: number;
  promotions_mid_mgmt_men?: number;
  promotions_mid_mgmt_women?: number;
  promotions_non_mgmt_men?: number;
  promotions_non_mgmt_women?: number;
  promotions_top_mgmt_men?: number;
  promotions_top_mgmt_women?: number;
  resignations_mid_mgmt_men?: number;
  resignations_mid_mgmt_women?: number;
  resignations_non_mgmt_men?: number;
  resignations_non_mgmt_women?: number;
  resignations_top_mgmt_men?: number;
  resignations_top_mgmt_women?: number;
  sec_carers_mid_mgmt_men?: number;
  sec_carers_mid_mgmt_women?: number;
  sec_carers_non_mgmt_men?: number;
  sec_carers_non_mgmt_women?: number;
  sec_carers_top_mgmt_men?: number;
  sec_carers_top_mgmt_women?: number;
  total_appoint_excl_prom_mid_mgmt_men?: number;
  total_appoint_excl_prom_mid_mgmt_women?: number;
  total_appoint_excl_prom_non_mgmt_men?: number;
  total_appoint_excl_prom_non_mgmt_women?: number;
  total_appoint_excl_prom_top_mgmt_men?: number;
  total_appoint_excl_prom_top_mgmt_women?: number;
  total_appoint_incl_prom_mid_mgmt_men?: number;
  total_appoint_incl_prom_mid_mgmt_women?: number;
  total_appoint_incl_prom_non_mgmt_men?: number;
  total_appoint_incl_prom_non_mgmt_women?: number;
  total_appoint_incl_prom_top_mgmt_men?: number;
  total_appoint_incl_prom_top_mgmt_women?: number;
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
    return <div className="cd-loading-spinner"></div>;
  }

  if (error) {
    return <div className="cd-error">{error}</div>;
  }

  if (!companyDetails) {
    return <div className="cd-no-data">No additional data available for this company.</div>;
  }

  return (
    <div className="cd-container">
      <button onClick={onBack} className="cd-back-button">Back to Results</button>
      <h1 className="cd-title">{companyDetails.primary_employer_name}</h1>
      <div className="cd-info-box">
        <p className="cd-info-item"><span className="cd-info-label">Industry:</span> {companyDetails.primary_division_name}</p>
        <p className="cd-info-item"><span className="cd-info-label">State:</span> {companyDetails.State}</p>
        <p className="cd-info-item"><span className="cd-info-label">Total Employees:</span> {companyDetails.total_employees || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Group Size:</span> {companyDetails.submission_group_size || 'N/A'}</p>
      </div>
      <div className="cd-section">
        <h2 className="cd-section-title">Gender Equality Scores</h2>
        <div className="cd-score-item">
          <span className="cd-score-label">Total Score:</span>
          <StarRating score={companyDetails.primary_abn_score} />
        </div>
        <div className="cd-score-item">
          <span className="cd-score-label">Gender Equality Action:</span>
          <StarRating score={Number(companyDetails["Action on gender equality"])} />
        </div>
        <div className="cd-score-item">
          <span className="cd-score-label">Employee Support:</span>
          <StarRating score={Number(companyDetails["Employee support"])} />
        </div>
        <div className="cd-score-item">
          <span className="cd-score-label">Flexible Work:</span>
          <StarRating score={Number(companyDetails["Flexible work"])} />
        </div>
        <div className="cd-score-item">
          <span className="cd-score-label">Workplace Overview:</span>
          <StarRating score={Number(companyDetails["Workplace overview"])} />
        </div>
      </div>
      <div className="cd-section">
        <h2 className="cd-section-title">Workforce Composition</h2>
        <h3 className="cd-subsection-title">Management</h3>
        <p className="cd-info-item"><span className="cd-info-label">CEOs:</span> Men: {companyDetails.manager_CEOs_men || 'N/A'}, Women: {companyDetails.manager_CEOs_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Heads of Business:</span> Men: {companyDetails.manager_heads_of_business_men || 'N/A'}, Women: {companyDetails.manager_heads_of_business_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Key Management Personnel:</span> Men: {companyDetails.manager_key_mgmt_personnel_men || 'N/A'}, Women: {companyDetails.manager_key_mgmt_personnel_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Other Executives:</span> Men: {companyDetails.manager_other_exec_men || 'N/A'}, Women: {companyDetails.manager_other_exec_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Other Management:</span> Men: {companyDetails.manager_other_mgmt_men || 'N/A'}, Women: {companyDetails.manager_other_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Overseas Management:</span> Men: {companyDetails.manager_overseas_mgmt_men || 'N/A'}, Women: {companyDetails.manager_overseas_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Senior Management:</span> Men: {companyDetails.manager_senior_mgmt_men || 'N/A'}, Women: {companyDetails.manager_senior_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Total Managers:</span> Men: {companyDetails.manager_men || 'N/A'}, Women: {companyDetails.manager_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">Non-Management</h3>
        <p className="cd-info-item"><span className="cd-info-label">Clerical:</span> Men: {companyDetails.non_manager_clerical_men || 'N/A'}, Women: {companyDetails.non_manager_clerical_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Service:</span> Men: {companyDetails.non_manager_service_men || 'N/A'}, Women: {companyDetails.non_manager_service_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Labourers:</span> Men: {companyDetails.non_manager_labourers_men || 'N/A'}, Women: {companyDetails.non_manager_labourers_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Operators:</span> Men: {companyDetails.non_manager_operators_men || 'N/A'}, Women: {companyDetails.non_manager_operators_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Other:</span> Men: {companyDetails.non_manager_other_men || 'N/A'}, Women: {companyDetails.non_manager_other_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Professionals:</span> Men: {companyDetails.non_manager_professionals_men || 'N/A'}, Women: {companyDetails.non_manager_professionals_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Sales:</span> Men: {companyDetails.non_manager_sales_men || 'N/A'}, Women: {companyDetails.non_manager_sales_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Technicians:</span> Men: {companyDetails.non_manager_technicians_men || 'N/A'}, Women: {companyDetails.non_manager_technicians_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Total Non-Managers:</span> Men: {companyDetails.non_manager_men || 'N/A'}, Women: {companyDetails.non_manager_women || 'N/A'}</p>
      </div>
      <div className="cd-section">
        <h2 className="cd-section-title">Employment Metrics</h2>
        <h3 className="cd-subsection-title">Ceased Paid Leave</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.ceased_paid_leave_mid_mgmt_men || 'N/A'}, Women: {companyDetails.ceased_paid_leave_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.ceased_paid_leave_non_mgmt_men || 'N/A'}, Women: {companyDetails.ceased_paid_leave_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.ceased_paid_leave_top_mgmt_men || 'N/A'}, Women: {companyDetails.ceased_paid_leave_top_mgmt_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">External Appointments</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.ext_appoint_mid_mgmt_men || 'N/A'}, Women: {companyDetails.ext_appoint_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.ext_appoint_non_mgmt_men || 'N/A'}, Women: {companyDetails.ext_appoint_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.ext_appoint_top_mgmt_men || 'N/A'}, Women: {companyDetails.ext_appoint_top_mgmt_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">Internal Appointments</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.internal_appoint_mid_mgmt_men || 'N/A'}, Women: {companyDetails.internal_appoint_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.internal_appoint_non_mgmt_men || 'N/A'}, Women: {companyDetails.internal_appoint_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.internal_appoint_top_mgmt_men || 'N/A'}, Women: {companyDetails.internal_appoint_top_mgmt_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">Primary Carers</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.primary_carers_mid_mgmt_men || 'N/A'}, Women: {companyDetails.primary_carers_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.primary_carers_non_mgmt_men || 'N/A'}, Women: {companyDetails.primary_carers_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.primary_carers_top_mgmt_men || 'N/A'}, Women: {companyDetails.primary_carers_top_mgmt_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">Promotions</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.promotions_mid_mgmt_men || 'N/A'}, Women: {companyDetails.promotions_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.promotions_non_mgmt_men || 'N/A'}, Women: {companyDetails.promotions_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.promotions_top_mgmt_men || 'N/A'}, Women: {companyDetails.promotions_top_mgmt_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">Resignations</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.resignations_mid_mgmt_men || 'N/A'}, Women: {companyDetails.resignations_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.resignations_non_mgmt_men || 'N/A'}, Women: {companyDetails.resignations_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.resignations_top_mgmt_men || 'N/A'}, Women: {companyDetails.resignations_top_mgmt_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">Secondary Carers</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.sec_carers_mid_mgmt_men || 'N/A'}, Women: {companyDetails.sec_carers_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.sec_carers_non_mgmt_men || 'N/A'}, Women: {companyDetails.sec_carers_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.sec_carers_top_mgmt_men || 'N/A'}, Women: {companyDetails.sec_carers_top_mgmt_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">Total Appointments (Excluding Promotions)</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.total_appoint_excl_prom_mid_mgmt_men || 'N/A'}, Women: {companyDetails.total_appoint_excl_prom_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.total_appoint_excl_prom_non_mgmt_men || 'N/A'}, Women: {companyDetails.total_appoint_excl_prom_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.total_appoint_excl_prom_top_mgmt_men || 'N/A'}, Women: {companyDetails.total_appoint_excl_prom_top_mgmt_women || 'N/A'}</p>
        
        <h3 className="cd-subsection-title">Total Appointments (Including Promotions)</h3>
        <p className="cd-info-item"><span className="cd-info-label">Middle Management:</span> Men: {companyDetails.total_appoint_incl_prom_mid_mgmt_men || 'N/A'}, Women: {companyDetails.total_appoint_incl_prom_mid_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Non-Management:</span> Men: {companyDetails.total_appoint_incl_prom_non_mgmt_men || 'N/A'}, Women: {companyDetails.total_appoint_incl_prom_non_mgmt_women || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Top Management:</span> Men: {companyDetails.total_appoint_incl_prom_top_mgmt_men || 'N/A'}, Women: {companyDetails.total_appoint_incl_prom_top_mgmt_women || 'N/A'}</p>
      </div>
      <p className="cd-wgea-resource">
        For more information on gender equality in the workplace, visit the 
        <a href="https://www.wgea.gov.au" target="_blank" rel="noopener noreferrer" className="cd-wgea-link"> Workplace Gender Equality Agency (WGEA)</a>.
      </p>
    </div>
  );
};

export default CompanyDetail;