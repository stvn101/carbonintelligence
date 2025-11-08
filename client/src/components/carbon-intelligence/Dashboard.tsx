// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  BarChart3, PieChart, TrendingUp, ThermometerSun, Building2,
  Zap, AlertTriangle, Check, Shield, Map, Calendar, FileText
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement, PointElement, LineElement
);

const Dashboard = ({ projectData }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [materialBreakdown, setMaterialBreakdown] = useState(null);
  const [lcaStages, setLcaStages] = useState(null);
  const [optimizationData, setOptimizationData] = useState(null);
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading project data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data for demonstration
      setSummaryData({
        totalCarbon: 12450,
        embodiedCarbon: 4980,
        operationalCarbon: 7470,
        perSquareMeter: 1245,
        projectLife: 50,
        gfa: 10000,
        projectName: projectData?.name || "Green Office Tower",
        location: projectData?.location?.city || "Sydney",
        buildingType: projectData?.buildingType || "commercial"
      });

      setMaterialBreakdown({
        labels: ['Concrete', 'Steel', 'Timber', 'Glass', 'Insulation', 'Finishes', 'Other'],
        datasets: [{
          data: [1800, 2200, 150, 310, 120, 250, 150],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
          ],
          borderWidth: 1
        }]
      });

      setLcaStages({
        labels: ['A1-A3 (Product)', 'A4 (Transport)', 'A5 (Construction)', 'B1-B7 (Use)', 'C1-C4 (End of life)', 'D (Benefits)'],
        datasets: [{
          label: 'Carbon (tonnes CO₂-e)',
          data: [3500, 250, 750, 7500, 500, -500],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      });

      setOptimizationData({
        potentialSavings: 2490,
        savingsPercentage: 20,
        recommendations: [
          { title: "Replace 32MPa concrete with GPC", carbonSavings: 1200, costImpact: "Neutral", difficulty: "Medium" },
          { title: "Use recycled steel rebar", carbonSavings: 850, costImpact: "Minor Increase", difficulty: "Easy" },
          { title: "Increase CLT usage", carbonSavings: 440, costImpact: "Moderate Increase", difficulty: "Medium" }
        ]
      });

      setComplianceStatus({
        ncc: {
          overall: true,
          sections: {
            J1_2: true, // Building fabric
            J1_3: true, // Glazing
            J1_5: true, // Building sealing
            J1_6: false, // Lighting
            J5: true // Embodied carbon
          }
        },
        nabers: {
          rating: 5.0,
          grade: "Excellent"
        }
      });

      setIsLoading(false);
    };

    fetchData();
  }, [projectData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-700">Loading comprehensive carbon analysis...</p>
      </div>
    );
  }

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Carbon',
      value: `${summaryData.totalCarbon.toLocaleString()} tonnes CO₂-e`,
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Embodied Carbon',
      value: `${summaryData.embodiedCarbon.toLocaleString()} tonnes CO₂-e`,
      percentage: Math.round(summaryData.embodiedCarbon/summaryData.totalCarbon*100),
      icon: <Building2 className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Operational Carbon',
      value: `${summaryData.operationalCarbon.toLocaleString()} tonnes CO₂-e`,
      percentage: Math.round(summaryData.operationalCarbon/summaryData.totalCarbon*100),
      icon: <ThermometerSun className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200'
    },
    {
      title: 'Carbon Intensity',
      value: `${summaryData.perSquareMeter.toFixed(1)} kg CO₂-e/m²`,
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  // Horizontal bar chart options for LCA stages
  const lcaOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            let value = context.raw;
            return `${value.toLocaleString()} tonnes CO₂-e`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Project Information Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{summaryData.projectName}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 opacity-80" />
                <span>{summaryData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 opacity-80" />
                <span className="capitalize">{summaryData.buildingType}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 opacity-80" />
                <span>{summaryData.gfa.toLocaleString()} m² GFA</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 opacity-80" />
                <span>{summaryData.projectLife} year lifecycle</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{complianceStatus.nabers.rating} ★</span>
            <span className="bg-white text-blue-700 text-sm font-bold px-3 py-1 rounded">NABERS {complianceStatus.nabers.grade}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryCards.map((card, index) => (
          <div key={index} className={`${card.color} border rounded-lg p-5 shadow-sm`}>
            <div className="flex justify-between items-start mb-3">
              <div className="font-semibold text-gray-700">{card.title}</div>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            {card.percentage && (
              <div className="text-sm text-gray-600 mt-1">
                {card.percentage}% of total carbon
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Material Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            Material Carbon Breakdown
          </h2>
          <div className="h-80">
            <Pie
              data={materialBreakdown}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${value.toLocaleString()} tonnes CO₂-e (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* LCA Stages */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Lifecycle Stage Analysis
          </h2>
          <div className="h-80">
            <Bar data={lcaStages} options={lcaOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Optimization Opportunities */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Optimization Opportunities
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{optimizationData.potentialSavings.toLocaleString()} kg</div>
              <div className="text-sm text-green-600">Potential CO₂-e savings</div>
            </div>
          </div>
          <div className="space-y-4">
            {optimizationData.recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div className="font-semibold text-gray-900">{rec.title}</div>
                  <div className="font-bold text-green-600">{rec.carbonSavings.toLocaleString()} kg</div>
                </div>
                <div className="flex mt-2 text-sm gap-4">
                  <div className="text-gray-600">Cost Impact: <span className="font-medium">{rec.costImpact}</span></div>
                  <div className="text-gray-600">Implementation: <span className="font-medium">{rec.difficulty}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Compliance Status
          </h2>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">NCC Section J</h3>
              {complianceStatus.ncc.overall ? (
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <Check className="w-5 h-5" /> PASS
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 font-semibold">
                  <AlertTriangle className="w-5 h-5" /> FAIL
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {Object.entries(complianceStatus.ncc.sections).map(([key, value]) => (
                <div key={key} className={`border ${value ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} rounded-lg p-3 text-center`}>
                  <div className={`font-semibold ${value ? 'text-green-800' : 'text-red-800'}`}>
                    {key.replace('_', '.')}
                  </div>
                  <div className="text-sm">
                    {key === 'J1_2' && 'Building Fabric'}
                    {key === 'J1_3' && 'Glazing'}
                    {key === 'J1_5' && 'Building Sealing'}
                    {key === 'J1_6' && 'Lighting'}
                    {key === 'J5' && 'Embodied Carbon'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">NABERS Energy Rating</h3>
              <div className="flex items-center gap-1">
                <div className="text-xl font-bold text-amber-500">{complianceStatus.nabers.rating} ★</div>
                <div className="text-sm font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  {complianceStatus.nabers.grade}
                </div>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs text-gray-700 font-semibold">Rating Scale</div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-700">
                    6.0 stars maximum
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-amber-200">
                <div
                  style={{ width: `${(complianceStatus.nabers.rating/6) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
