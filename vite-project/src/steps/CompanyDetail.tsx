import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as Tabs from '@radix-ui/react-tabs';
import '../styles/CompanyDetail.css';

interface Company {
  primary_abn: number;
  primary_employer_name: string;
  primary_division_name: string;
  State: string;
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

const WorkforceComposition: React.FC<{ companyDetails: CompanyDetails }> = ({ companyDetails }) => {
  const managementData = [
    { position: 'CEOs', men: companyDetails.manager_CEOs_men || 0, women: companyDetails.manager_CEOs_women || 0 },
    { position: 'Heads of Business', men: companyDetails.manager_heads_of_business_men || 0, women: companyDetails.manager_heads_of_business_women || 0 },
    { position: 'Key Management', men: companyDetails.manager_key_mgmt_personnel_men || 0, women: companyDetails.manager_key_mgmt_personnel_women || 0 },
    { position: 'Other Executives', men: companyDetails.manager_other_exec_men || 0, women: companyDetails.manager_other_exec_women || 0 },
    { position: 'Senior Management', men: companyDetails.manager_senior_mgmt_men || 0, women: companyDetails.manager_senior_mgmt_women || 0 },
  ];

  const nonManagementData = [
    { position: 'Clerical', men: companyDetails.non_manager_clerical_men || 0, women: companyDetails.non_manager_clerical_women || 0 },
    { position: 'Service', men: companyDetails.non_manager_service_men || 0, women: companyDetails.non_manager_service_women || 0 },
    { position: 'Labourers', men: companyDetails.non_manager_labourers_men || 0, women: companyDetails.non_manager_labourers_women || 0 },
    { position: 'Professionals', men: companyDetails.non_manager_professionals_men || 0, women: companyDetails.non_manager_professionals_women || 0 },
    { position: 'Technicians', men: companyDetails.non_manager_technicians_men || 0, women: companyDetails.non_manager_technicians_women || 0 },
  ];

  const renderChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          dataKey="position" 
          type="category" 
          width={150}
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: 'none' }}
          axisLine={{ stroke: 'none' }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          itemStyle={{ color: '#333' }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          iconType="circle"
        />
        <Bar dataKey="men" fill="#4a90e2" name="Men" radius={[0, 4, 4, 0]} />
        <Bar dataKey="women" fill="#e15f81" name="Women" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="workforce-composition">
      <h2 className="cd-section-title">Workforce Composition</h2>
      <Tabs.Root className="tabs-root" defaultValue="management">
        <Tabs.List className="tabs-list">
          <Tabs.Trigger className="tabs-trigger" value="management">Management</Tabs.Trigger>
          <Tabs.Trigger className="tabs-trigger" value="non-management">Non-Management</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="tabs-content" value="management">
          {renderChart(managementData)}
        </Tabs.Content>
        <Tabs.Content className="tabs-content" value="non-management">
          {renderChart(nonManagementData)}
        </Tabs.Content>
      </Tabs.Root>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Total Employees</h3>
        <p>Managers: Men: {companyDetails.manager_men || 'N/A'}, Women: {companyDetails.manager_women || 'N/A'}</p>
        <p>Non-Managers: Men: {companyDetails.non_manager_men || 'N/A'}, Women: {companyDetails.non_manager_women || 'N/A'}</p>
      </div>
    </div>
  );
};

const EmploymentMetrics: React.FC<{ companyDetails: CompanyDetails }> = ({ companyDetails }) => {
    const [selectedMetric, setSelectedMetric] = useState('ceased_paid_leave');

    const calculateRatio = (men: number, women: number) => {
      const total = men + women;
      if (total === 0) return { men: 0, women: 0 };
      return {
        men: Math.round((men / total) * 100),
        women: Math.round((women / total) * 100)
      };
    };
  
    const metricData = {
      ceased_paid_leave: [
        { level: 'Middle Management', ...calculateRatio(companyDetails.ceased_paid_leave_mid_mgmt_men ?? 0, companyDetails.ceased_paid_leave_mid_mgmt_women ?? 0) },
        { level: 'Non-Management', ...calculateRatio(companyDetails.ceased_paid_leave_non_mgmt_men ?? 0, companyDetails.ceased_paid_leave_non_mgmt_women ?? 0) },
        { level: 'Top Management', ...calculateRatio(companyDetails.ceased_paid_leave_top_mgmt_men ?? 0, companyDetails.ceased_paid_leave_top_mgmt_women ?? 0) },
      ],
      appointments: [
        { level: 'Middle Management', ...calculateRatio(companyDetails.ext_appoint_mid_mgmt_men ?? 0, companyDetails.ext_appoint_mid_mgmt_women ?? 0), ...calculateRatio(companyDetails.internal_appoint_mid_mgmt_men ?? 0, companyDetails.internal_appoint_mid_mgmt_women ?? 0) },
        { level: 'Non-Management', ...calculateRatio(companyDetails.ext_appoint_non_mgmt_men ?? 0, companyDetails.ext_appoint_non_mgmt_women ?? 0), ...calculateRatio(companyDetails.internal_appoint_non_mgmt_men ?? 0, companyDetails.internal_appoint_non_mgmt_women ?? 0) },
        { level: 'Top Management', ...calculateRatio(companyDetails.ext_appoint_top_mgmt_men ?? 0, companyDetails.ext_appoint_top_mgmt_women ?? 0), ...calculateRatio(companyDetails.internal_appoint_top_mgmt_men ?? 0, companyDetails.internal_appoint_top_mgmt_women ?? 0) },
      ],
      carers: [
        { level: 'Middle Management', ...calculateRatio(companyDetails.primary_carers_mid_mgmt_men ?? 0, companyDetails.primary_carers_mid_mgmt_women ?? 0), ...calculateRatio(companyDetails.sec_carers_mid_mgmt_men ?? 0, companyDetails.sec_carers_mid_mgmt_women ?? 0) },
        { level: 'Non-Management', ...calculateRatio(companyDetails.primary_carers_non_mgmt_men ?? 0, companyDetails.primary_carers_non_mgmt_women ?? 0), ...calculateRatio(companyDetails.sec_carers_non_mgmt_men ?? 0, companyDetails.sec_carers_non_mgmt_women ?? 0) },
        { level: 'Top Management', ...calculateRatio(companyDetails.primary_carers_top_mgmt_men ?? 0, companyDetails.primary_carers_top_mgmt_women ?? 0), ...calculateRatio(companyDetails.sec_carers_top_mgmt_men ?? 0, companyDetails.sec_carers_top_mgmt_women ?? 0) },
      ],
      promotions: [
        { level: 'Middle Management', ...calculateRatio(companyDetails.promotions_mid_mgmt_men ?? 0, companyDetails.promotions_mid_mgmt_women ?? 0) },
        { level: 'Non-Management', ...calculateRatio(companyDetails.promotions_non_mgmt_men ?? 0, companyDetails.promotions_non_mgmt_women ?? 0) },
        { level: 'Top Management', ...calculateRatio(companyDetails.promotions_top_mgmt_men ?? 0, companyDetails.promotions_top_mgmt_women ?? 0) },
      ],
      resignations: [
        { level: 'Middle Management', ...calculateRatio(companyDetails.resignations_mid_mgmt_men ?? 0, companyDetails.resignations_mid_mgmt_women ?? 0) },
        { level: 'Non-Management', ...calculateRatio(companyDetails.resignations_non_mgmt_men ?? 0, companyDetails.resignations_non_mgmt_women ?? 0) },
        { level: 'Top Management', ...calculateRatio(companyDetails.resignations_top_mgmt_men ?? 0, companyDetails.resignations_top_mgmt_women ?? 0) },
      ],
    };
  
    const renderChart = () => {
      const data = metricData[selectedMetric as keyof typeof metricData];
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis 
              dataKey="level" 
              type="category" 
              width={150}
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: 'none' }}
              axisLine={{ stroke: 'none' }}
            />
            <Tooltip 
              formatter={(value: number) => `${value}%`}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              itemStyle={{ color: '#333' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
            />
            <Bar dataKey="men" fill="#4a90e2" name="Men %" radius={[0, 4, 4, 0]} />
            <Bar dataKey="women" fill="#e15f81" name="Women %" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    };
  
    return (
      <div className="employment-metrics">
        <h2 className="cd-section-title">Employment Metrics</h2>
        <Tabs.Root className="tabs-root" defaultValue="ceased_paid_leave" onValueChange={setSelectedMetric}>
          <Tabs.List className="tabs-list">
            <Tabs.Trigger className="tabs-trigger" value="ceased_paid_leave">Ceased Paid Leave</Tabs.Trigger>
            <Tabs.Trigger className="tabs-trigger" value="appointments">Appointments</Tabs.Trigger>
            <Tabs.Trigger className="tabs-trigger" value="carers">Carers</Tabs.Trigger>
            <Tabs.Trigger className="tabs-trigger" value="promotions">Promotions</Tabs.Trigger>
            <Tabs.Trigger className="tabs-trigger" value="resignations">Resignations</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="tabs-content" value={selectedMetric}>
            {renderChart()}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    );
  };

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
      <h1 className="cd-title">{companyDetails.primary_employer_name}</h1>
      <div className="cd-info-box">
        <p className="cd-info-item"><span className="cd-info-label">Industry:</span> {companyDetails.primary_division_name}</p>
        <p className="cd-info-item"><span className="cd-info-label">State:</span> {companyDetails.State}</p>
        <p className="cd-info-item"><span className="cd-info-label">Total Employees:</span> {companyDetails.total_employees || 'N/A'}</p>
        <p className="cd-info-item"><span className="cd-info-label">Group Size:</span> {companyDetails.submission_group_size || 'N/A'}</p>
      </div>
      <div className="cd-section">
        <WorkforceComposition companyDetails={companyDetails} />
      </div>
      <div className="cd-section">
        <EmploymentMetrics companyDetails={companyDetails} />
      </div>
      <button onClick={onBack} className="cd-back-button">Back to Results</button>
      <p className="cd-wgea-resource">
        For more information on gender equality in the workplace, visit the 
        <a href="https://www.wgea.gov.au" target="_blank" rel="noopener noreferrer" className="cd-wgea-link"> Workplace Gender Equality Agency (WGEA)</a>.
      </p>
    </div>
  );
};

export default CompanyDetail;