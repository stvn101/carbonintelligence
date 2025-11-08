// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Layers, Building2, CloudRain, TrendingUp, Recycle, Zap, Truck } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement, PointElement, LineElement
);

const ProjectAnalysis = ({ projectData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [selectedStage, setSelectedStage] = useState('all');
  const [climateData, setClimateData] = useState(null);
  const [scopesData, setScopesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock comprehensive analysis data
      setAnalysis({
        lcaBreakdown: {
          stages: {
            A1A3: 3500,
            A4: 250,
            A5: 750,
            B1B7: 7500,
            C1C4: 500,
            D: -500
          }
        },
        materialDetails: [
          {
            name: 'Ready Mix Concrete 32MPa',
            quantity: 1200,
            unit: 'm³',
            totalCarbon: 438000,
            kgCO2ePerUnit: 365,
            transportDistance: 25,
            transportCarbon: 30000,
            alternatives: [
              { name: '32 MPa Geopolymer Concrete (GPC)', savingsPercentage: 60 },
              { name: 'Concrete with 30% Recycled Aggregate', savingsPercentage: 20 }
            ]
          },
          {
            name: 'Steel Rebar',
            quantity: 150,
            unit: 'tonnes',
            totalCarbon: 277500,
            kgCO2ePerUnit: 1850,
            transportDistance: 30,
            transportCarbon: 4500,
            alternatives: [
              { name: 'Recycled Steel Rebar', savingsPercentage: 70 }
            ]
          },
          {
            name: 'CLT Panels',
            quantity: 300,
            unit: 'm³',
            totalCarbon: -126000,
            kgCO2ePerUnit: -420,
            transportDistance: 100,
            transportCarbon: 30000,
            alternatives: []
          },
          {
            name: 'Glazing Units',
            quantity: 2000,
            unit: 'm²',
            totalCarbon: 100000,
            kgCO2ePerUnit: 50,
            transportDistance: 50,
            transportCarbon: 10000,
            alternatives: [
              { name: 'High Performance Double Glazing', savingsPercentage: 15 }
            ]
          }
        ]
      });

      setClimateData({
        location: projectData?.location?.city || 'Sydney, NSW',
        climateZone: '5',
        averageTemperature: 22.5,
        annualRainfall: 1213,
        relativeHumidity: 65,
        monthlyData: [
          { month: 'Jan', temperature: 26.5, rainfall: 104 },
          { month: 'Feb', temperature: 26.5, rainfall: 118 },
          { month: 'Mar', temperature: 25.0, rainfall: 130 },
          { month: 'Apr', temperature: 22.5, rainfall: 128 },
          { month: 'May', temperature: 19.0, rainfall: 120 },
          { month: 'Jun', temperature: 16.5, rainfall: 132 },
          { month: 'Jul', temperature: 16.0, rainfall: 98 },
          { month: 'Aug', temperature: 17.5, rainfall: 80 },
          { month: 'Sep', temperature: 20.0, rainfall: 69 },
          { month: 'Oct', temperature: 22.5, rainfall: 75 },
          { month: 'Nov', temperature: 24.5, rainfall: 104 },
          { month: 'Dec', temperature: 25.5, rainfall: 78 }
        ]
      });

      setScopesData({
        scope1: {
          total: 250000,
          categories: {
            'On-site combustion': 150000,
            'Fugitive emissions': 100000
          }
        },
        scope2: {
          total: 300000,
          categories: {
            'Purchased electricity': 250000,
            'Purchased heating/cooling': 50000
          }
        },
        scope3: {
          total: 9000000,
          categories: {
            'Purchased goods': 6000000,
            'Capital goods': 1500000,
            'Transportation': 500000,
            'Waste': 200000,
            'Business travel': 100000,
            'Employee commuting': 300000,
            'End of life treatment': 400000
          }
        },
        percentages: {
          scope1: 2.6,
          scope2: 3.1,
          scope3: 94.3
        },
        summary: {
          largestScope: 'Scope 3',
          materialsPercentage: 79
        }
      });

      setIsLoading(false);
    };

    fetchAnalysisData();
  }, [projectData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-700">Loading detailed project analysis...</p>
      </div>
    );
  }

  // Prepare data for LCA Stage chart
  const lcaStageData = {
    labels: ['A1-A3 (Product)', 'A4 (Transport)', 'A5 (Construction)', 'B1-B7 (Use)', 'C1-C4 (End of life)', 'D (Benefits)'],
    datasets: [
      {
        label: 'Carbon (tonnes CO₂-e)',
        data: [
          analysis.lcaBreakdown.stages.A1A3,
          analysis.lcaBreakdown.stages.A4,
          analysis.lcaBreakdown.stages.A5,
          analysis.lcaBreakdown.stages.B1B7,
          analysis.lcaBreakdown.stages.C1C4,
          analysis.lcaBreakdown.stages.D
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(40, 167, 69, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(40, 167, 69, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Climate data for chart
  const climateChartData = {
    labels: climateData.monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: climateData.monthlyData.map(d => d.temperature),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y',
        tension: 0.4
      },
      {
        label: 'Rainfall (mm)',
        data: climateData.monthlyData.map(d => d.rainfall),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y1',
        tension: 0.4
      }
    ]
  };

  // GHG Protocol Scopes data for chart
  const scopesChartData = {
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [
      {
        label: 'Carbon (kg CO₂-e)',
        data: [
          scopesData.scope1.total,
          scopesData.scope2.total,
          scopesData.scope3.total
        ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Scope 3 breakdown data
  const scope3BreakdownData = {
    labels: Object.keys(scopesData.scope3.categories),
    datasets: [
      {
        label: 'Carbon (kg CO₂-e)',
        data: Object.values(scopesData.scope3.categories),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Detailed Project Analysis</h1>

      {/* Life Cycle Assessment Stages */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          Life Cycle Assessment Stages
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Bar
              data={lcaStageData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
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
                }
              }}
            />
          </div>

          <div className="space-y-4">
            <p className="text-gray-800">
              Life Cycle Assessment (LCA) divides a building's carbon footprint into distinct stages from raw material extraction to end-of-life treatment.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">A1-A3 (Product Stage)</span>
                <span className="font-semibold">{analysis.lcaBreakdown.stages.A1A3.toLocaleString()} tonnes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">A4 (Transport)</span>
                <span className="font-semibold">{analysis.lcaBreakdown.stages.A4.toLocaleString()} tonnes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">A5 (Construction)</span>
                <span className="font-semibold">{analysis.lcaBreakdown.stages.A5.toLocaleString()} tonnes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">B1-B7 (Use Stage)</span>
                <span className="font-semibold">{analysis.lcaBreakdown.stages.B1B7.toLocaleString()} tonnes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">C1-C4 (End of Life)</span>
                <span className="font-semibold">{analysis.lcaBreakdown.stages.C1C4.toLocaleString()} tonnes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">D (Benefits/Loads)</span>
                <span className="font-semibold text-green-600">{analysis.lcaBreakdown.stages.D.toLocaleString()} tonnes</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Expert Insight:</strong> Your project shows significant carbon sequestration in Module D, primarily from timber elements. Consider increasing CLT usage to enhance this benefit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Material Details and Climate Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Material Details */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Material Details
          </h2>

          <div className="space-y-4">
            {analysis.materialDetails.map((material, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{material.name}</h3>
                    <div className="text-sm text-gray-600">{material.quantity.toLocaleString()} {material.unit}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{(material.totalCarbon/1000).toFixed(1)} tonnes CO₂-e</div>
                    <div className="text-sm text-gray-600">{material.kgCO2ePerUnit} kg CO₂-e/{material.unit}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <Truck className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="text-gray-600">Transport: {material.transportDistance} km</span>
                  </div>
                  <div className="text-sm text-right">
                    <span className="text-gray-600">{(material.transportCarbon/1000).toFixed(1)} tonnes CO₂-e</span>
                  </div>
                </div>

                {material.alternatives && material.alternatives.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm font-medium text-blue-600">Low Carbon Alternatives:</div>
                    <div className="space-y-2 mt-2">
                      {material.alternatives.map((alt, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{alt.name}</span>
                          <span className="text-green-600 font-medium">{alt.savingsPercentage}% reduction</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Climate Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-600" />
            Climate Analysis - {climateData.location}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <div className="text-sm text-blue-800">Climate Zone</div>
              <div className="text-2xl font-bold text-blue-800">{climateData.climateZone}</div>
              <div className="text-xs text-blue-700">{climateData.location}</div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <div className="text-sm text-red-800">Temperature</div>
              <div className="text-2xl font-bold text-red-800">{climateData.averageTemperature}°C</div>
              <div className="text-xs text-red-700">Annual Average</div>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center">
              <div className="text-sm text-cyan-800">Rainfall</div>
              <div className="text-2xl font-bold text-cyan-800">{climateData.annualRainfall}mm</div>
              <div className="text-xs text-cyan-700">Annual Total</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <div className="text-sm text-purple-800">Humidity</div>
              <div className="text-2xl font-bold text-purple-800">{climateData.relativeHumidity}%</div>
              <div className="text-xs text-purple-700">Relative Average</div>
            </div>
          </div>

          <div className="h-80 mt-4">
            <Line
              data={climateChartData}
              options={{
                responsive: true,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                stacked: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Temperature (°C)'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                      drawOnChartArea: false,
                    },
                    title: {
                      display: true,
                      text: 'Rainfall (mm)'
                    }
                  },
                },
              }}
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Climate Impact Analysis:</strong> This location experiences hot summers and mild winters (Climate Zone 5). Key recommendations include enhanced insulation (R-values 10% above minimum NCC requirements) and high-performance glazing (SHGC 0.28, U-value 2.8) to optimize thermal performance.
            </p>
          </div>
        </div>
      </div>

      {/* GHG Protocol Scopes Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          GHG Protocol Scopes Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Bar
              data={scopesChartData}
              options={{
                indexAxis: 'y',
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let value = context.raw;
                        return `${(value/1000).toLocaleString()} tonnes CO₂-e`;
                      }
                    }
                  }
                }
              }}
            />

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-400 rounded-sm mr-2"></div>
                  <span className="text-gray-700">Scope 1 (Direct)</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{(scopesData.scope1.total/1000).toFixed(1)} tonnes</div>
                  <div className="text-xs text-gray-600">{scopesData.percentages.scope1.toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-pink-400 rounded-sm mr-2"></div>
                  <span className="text-gray-700">Scope 2 (Energy)</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{(scopesData.scope2.total/1000).toFixed(1)} tonnes</div>
                  <div className="text-xs text-gray-600">{scopesData.percentages.scope2.toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-400 rounded-sm mr-2"></div>
                  <span className="text-gray-700">Scope 3 (Value Chain)</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{(scopesData.scope3.total/1000).toFixed(1)} tonnes</div>
                  <div className="text-xs text-gray-600">{scopesData.percentages.scope3.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Expert Insight:</strong> Scope 3 emissions dominate your carbon footprint, with materials accounting for {scopesData.summary.materialsPercentage}% of total emissions. Focus your reduction efforts on material selection and sourcing for maximum impact.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3">Scope 3 Emissions Breakdown</h3>
            <Bar
              data={scope3BreakdownData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        let value = context.raw;
                        return `${(value/1000).toLocaleString()} tonnes CO₂-e`;
                      }
                    }
                  }
                }
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="col-span-1">
                <h4 className="font-medium text-gray-800 mb-2">Scope 1 Categories</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(scopesData.scope1.categories).map(([category, value]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium">{(value/1000).toFixed(1)} t</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-1">
                <h4 className="font-medium text-gray-800 mb-2">Scope 2 Categories</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(scopesData.scope2.categories).map(([category, value]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium">{(value/1000).toFixed(1)} t</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-1">
                <h4 className="font-medium text-gray-800 mb-2">GHG Protocol Insights</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Zap className="w-4 h-4 text-blue-600 mt-0.5 mr-1" />
                    <span>Largest contributor: {scopesData.summary.largestScope}</span>
                  </div>
                  <div className="flex items-start">
                    <Building2 className="w-4 h-4 text-blue-600 mt-0.5 mr-1" />
                    <span>Materials impact: {scopesData.summary.materialsPercentage}% of total</span>
                  </div>
                  <div className="flex items-start">
                    <Recycle className="w-4 h-4 text-blue-600 mt-0.5 mr-1" />
                    <span>End of life: {(scopesData.scope3.categories['End of life treatment']/scopesData.scope3.total*100).toFixed(1)}% of Scope 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalysis;
