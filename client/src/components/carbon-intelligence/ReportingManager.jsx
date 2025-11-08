import React, { useState } from 'react';
import {
  FileText, Download, Share, Calendar, CheckCircle, AlertCircle,
  Filter, Search, Plus, Eye, Settings
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, ArcElement
);

const ReportingManager = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('current-year');

  // Report templates
  const reportTemplates = [
    {
      id: 1,
      name: 'NGER Annual Report',
      category: 'compliance',
      description: 'National Greenhouse and Energy Reporting annual compliance report',
      frequency: 'Annual',
      deadline: '31 Oct 2024',
      status: 'Draft',
      lastGenerated: '2024-10-15',
      fields: ['Scope 1', 'Scope 2', 'Scope 3', 'Energy Consumption'],
      authority: 'Clean Energy Regulator',
      icon: '🇦🇺',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Safeguard Mechanism Report',
      category: 'compliance',
      description: 'Safeguard Mechanism baseline and emissions report',
      frequency: 'Annual',
      deadline: '31 Aug 2024',
      status: 'Pending',
      lastGenerated: '2024-08-10',
      fields: ['Baseline Emissions', 'Actual Emissions', 'Credits/Deficits'],
      authority: 'Clean Energy Regulator',
      icon: '🛡️',
      color: 'green'
    },
    {
      id: 3,
      name: 'NCC Section J Compliance',
      category: 'compliance',
      description: 'National Construction Code Section J energy efficiency report',
      frequency: 'Per Project',
      deadline: 'Project Dependent',
      status: 'Complete',
      lastGenerated: '2024-11-01',
      fields: ['J1.2 Fabric', 'J1.3 Glazing', 'J1.5 Sealing', 'J1.6 Lighting', 'J5 Embodied'],
      authority: 'Australian Building Codes Board',
      icon: '🏗️',
      color: 'purple'
    },
    {
      id: 4,
      name: 'State Planning Report',
      category: 'compliance',
      description: 'State-level planning authority sustainability report',
      frequency: 'Per Project',
      deadline: 'As Required',
      status: 'Draft',
      lastGenerated: '2024-10-25',
      fields: ['BASIX', 'Green Star', 'ESD Strategy', 'Carbon Neutrality'],
      authority: 'State Planning Authority',
      icon: '📋',
      color: 'orange'
    },
    {
      id: 5,
      name: 'Portfolio Carbon Summary',
      category: 'management',
      description: 'Executive summary of portfolio-wide carbon performance',
      frequency: 'Monthly',
      deadline: '5th of Month',
      status: 'Complete',
      lastGenerated: '2024-11-05',
      fields: ['Total Emissions', 'Trends', 'Top Projects', 'Forecasts'],
      authority: 'Internal',
      icon: '📊',
      color: 'indigo'
    },
    {
      id: 6,
      name: 'LCA Assessment Report',
      category: 'technical',
      description: 'Full Life Cycle Assessment report (EN 15978)',
      frequency: 'Per Project',
      deadline: 'As Required',
      status: 'Draft',
      lastGenerated: '2024-11-03',
      fields: ['A1-A3', 'A4-A5', 'B1-B7', 'C1-C4', 'Module D'],
      authority: 'Internal/Client',
      icon: '🔬',
      color: 'teal'
    },
    {
      id: 7,
      name: 'Materiality Assessment',
      category: 'technical',
      description: 'Material carbon impact and optimization opportunities',
      frequency: 'Per Project',
      deadline: 'Design Phase',
      status: 'Complete',
      lastGenerated: '2024-10-28',
      fields: ['Material Breakdown', 'Alternatives', 'Savings Potential'],
      authority: 'Internal',
      icon: '📦',
      color: 'pink'
    },
    {
      id: 8,
      name: 'Investment Carbon ROI',
      category: 'financial',
      description: 'Carbon reduction investment analysis and ROI projection',
      frequency: 'Quarterly',
      deadline: 'Quarter End',
      status: 'Pending',
      lastGenerated: '2024-09-30',
      fields: ['Investment Amount', 'Carbon Reduction', 'ROI', 'Payback Period'],
      authority: 'Internal',
      icon: '💰',
      color: 'emerald'
    },
    {
      id: 9,
      name: 'CDP Climate Disclosure',
      category: 'disclosure',
      description: 'Carbon Disclosure Project climate change questionnaire',
      frequency: 'Annual',
      deadline: '29 July 2024',
      status: 'Complete',
      lastGenerated: '2024-07-15',
      fields: ['Governance', 'Risks', 'Opportunities', 'Emissions', 'Targets'],
      authority: 'CDP',
      icon: '🌍',
      color: 'cyan'
    },
    {
      id: 10,
      name: 'TCFD Alignment Report',
      category: 'disclosure',
      description: 'Task Force on Climate-related Financial Disclosures report',
      frequency: 'Annual',
      deadline: 'Annual Report',
      status: 'Draft',
      lastGenerated: '2024-10-20',
      fields: ['Governance', 'Strategy', 'Risk Management', 'Metrics & Targets'],
      authority: 'TCFD',
      icon: '📈',
      color: 'violet'
    }
  ];

  // Sample recent reports
  const recentReports = [
    {
      id: 1,
      name: 'Q3 2024 Portfolio Summary',
      type: 'Portfolio Carbon Summary',
      date: '2024-11-05',
      format: 'PDF',
      size: '2.4 MB',
      status: 'Generated'
    },
    {
      id: 2,
      name: 'Green Office Tower - LCA Report',
      type: 'LCA Assessment Report',
      date: '2024-11-03',
      format: 'PDF',
      size: '5.8 MB',
      status: 'Generated'
    },
    {
      id: 3,
      name: 'NGER 2023-24 Draft',
      type: 'NGER Annual Report',
      date: '2024-10-15',
      format: 'Excel',
      size: '1.2 MB',
      status: 'Draft'
    },
    {
      id: 4,
      name: 'Residential Complex - NCC J Compliance',
      type: 'NCC Section J Compliance',
      date: '2024-11-01',
      format: 'PDF',
      size: '3.1 MB',
      status: 'Generated'
    }
  ];

  // Filter templates
  const filteredTemplates = reportTemplates.filter(template => {
    if (reportType === 'all') return true;
    return template.category === reportType;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-gray-700 dark:text-neutral-300';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'compliance':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'management':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'technical':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'financial':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'disclosure':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-gray-700 dark:text-neutral-300';
    }
  };

  // Sample data for charts
  const reportingTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Reports Generated',
      data: [12, 14, 18, 15, 22, 19, 25, 28, 24, 30, 27, 0],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1
    }]
  };

  const reportTypeDistribution = {
    labels: ['Compliance', 'Management', 'Technical', 'Financial', 'Disclosure'],
    datasets: [{
      data: [35, 25, 20, 12, 8],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(6, 182, 212, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6B7280',
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#6B7280' },
        grid: { color: 'rgba(229, 231, 235, 0.5)' }
      },
      x: {
        ticks: { color: '#6B7280' },
        grid: { display: false }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#6B7280',
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Reporting & Export Manager
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Generate compliance reports, export data, and manage documentation
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Report
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Reports</div>
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">127</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12 this month</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Compliance Reports</div>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">45</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">35% of total</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Pending Deadlines</div>
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">3</div>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Next: 15 Nov</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Data Exports</div>
              <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">82</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Last 30 days</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Reporting Activity Trend
            </h3>
            <div className="h-64">
              <Bar data={reportingTrendData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Report Type Distribution
            </h3>
            <div className="h-64">
              <Pie data={reportTypeDistribution} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Report Category
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="compliance">Compliance Reports</option>
                  <option value="management">Management Reports</option>
                  <option value="technical">Technical Reports</option>
                  <option value="financial">Financial Reports</option>
                  <option value="disclosure">Disclosure Reports</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date Range
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="current-year">Current Financial Year</option>
                  <option value="last-year">Last Financial Year</option>
                  <option value="quarter">This Quarter</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Search Reports
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search by name or type..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Report Templates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-neutral-50 dark:bg-gray-900 rounded-lg p-4 border border-neutral-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer"
                onClick={() => setSelectedReport(template)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">
                        {template.name}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {template.authority}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                  {template.description}
                </p>

                {/* Metadata */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 dark:text-neutral-400">Frequency:</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{template.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 dark:text-neutral-400">Next Deadline:</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{template.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 dark:text-neutral-400">Last Generated:</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{template.lastGenerated}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(template.status)}`}>
                    {template.status}
                  </span>
                </div>

                {/* Action Button */}
                <button className="w-full mt-3 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Recent Reports
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Report Name</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Type</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Date</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Format</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Size</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  <th className="text-center py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-neutral-100 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-900">
                    <td className="py-3 px-2 text-sm font-medium text-neutral-900 dark:text-white">
                      {report.name}
                    </td>
                    <td className="py-3 px-2 text-xs text-neutral-600 dark:text-neutral-400">
                      {report.type}
                    </td>
                    <td className="py-3 px-2 text-xs text-neutral-600 dark:text-neutral-400">
                      {report.date}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 bg-neutral-100 dark:bg-gray-700 text-neutral-700 dark:text-neutral-300 rounded text-xs font-medium">
                        {report.format}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs text-neutral-600 dark:text-neutral-400">
                      {report.size}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingManager;
