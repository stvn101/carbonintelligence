import React, { useState } from 'react';
import { TrendingUp, ArrowDown, Zap, AlertCircle, Info, Check, AlertTriangle } from 'lucide-react';

const ResultsDisplay = ({ results }) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (!results) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Carbon Analysis Results</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'summary'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'materials'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Materials
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'compliance'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Compliance
        </button>
        <button
          onClick={() => setActiveTab('optimization')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'optimization'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Optimization
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-lg text-blue-800">Total Carbon</h3>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {results.totalCarbon?.wholeOfLife?.toLocaleString()} <span className="text-lg">tonnes CO₂-e</span>
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  {results.totalCarbon?.perSquareMeter?.total} kg CO₂-e/m²
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowDown className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-lg text-green-800">Embodied Carbon</h3>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {results.totalCarbon?.embodied?.toLocaleString()} <span className="text-lg">tonnes CO₂-e</span>
                </div>
                <div className="mt-2 text-sm text-green-600">
                  {Math.round(results.totalCarbon?.embodied / results.totalCarbon?.wholeOfLife * 100)}% of total
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-lg text-orange-800">Operational Carbon</h3>
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {results.totalCarbon?.operational?.toLocaleString()} <span className="text-lg">tonnes CO₂-e</span>
                </div>
                <div className="mt-2 text-sm text-orange-600">
                  {Math.round(results.totalCarbon?.operational / results.totalCarbon?.wholeOfLife * 100)}% of total
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Life Cycle Stages</h3>
              {results.lcaBreakdown && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>A1-A3: Product Stage</span>
                    <div className="flex items-center">
                      <span className="font-semibold">{results.lcaBreakdown.stages.A1A3?.toLocaleString()} kg CO₂-e</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>A4: Transport to Site</span>
                    <div className="flex items-center">
                      <span className="font-semibold">{results.lcaBreakdown.stages.A4?.toLocaleString()} kg CO₂-e</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>A5: Construction Process</span>
                    <div className="flex items-center">
                      <span className="font-semibold">{results.lcaBreakdown.stages.A5?.toLocaleString()} kg CO₂-e</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>B1-B7: Use Stage</span>
                    <div className="flex items-center">
                      <span className="font-semibold">{results.lcaBreakdown.stages.B1B7?.toLocaleString()} kg CO₂-e</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>C1-C4: End of Life</span>
                    <div className="flex items-center">
                      <span className="font-semibold">{results.lcaBreakdown.stages.C1C4?.toLocaleString()} kg CO₂-e</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>D: Benefits/Loads beyond Boundary</span>
                    <div className="flex items-center">
                      <span className="font-semibold">{results.lcaBreakdown.stages.D?.toLocaleString()} kg CO₂-e</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Materials Carbon Impact</h3>

            {results.materialsBreakdown && (
              <div className="space-y-4">
                {results.materialsBreakdown.map((material, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700">{material.category}</h4>
                    <div className="mt-2 flex justify-between items-center">
                      <span>Carbon Impact:</span>
                      <span className="font-semibold">{(material.totalCarbon / 1000).toLocaleString()} tonnes CO₂-e</span>
                    </div>
                    <div className="mt-1 flex justify-between items-center">
                      <span>Percentage of Embodied Carbon:</span>
                      <span className="font-semibold">{material.percentage}%</span>
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${material.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">NCC Section J Compliance</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Overall Status:</span>
                    <span className={`px-2 py-1 rounded text-white font-semibold ${
                      results.compliance?.ncc?.pass ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {results.compliance?.ncc?.pass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  {results.compliance?.ncc?.sections && Object.entries(results.compliance.ncc.sections).map(([section, passed]) => (
                    <div key={section} className="flex items-center justify-between">
                      <span>
                        {section === 'J1_2' && 'J1.2 Building Fabric'}
                        {section === 'J1_3' && 'J1.3 Glazing'}
                        {section === 'J1_5' && 'J1.5 Building Sealing'}
                        {section === 'J1_6' && 'J1.6 Lighting'}
                        {section === 'J5' && 'J5 Embodied Carbon'}
                      </span>
                      <span className="flex items-center">
                        {passed ?
                          <Check className="w-5 h-5 text-green-500" /> :
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">NABERS Rating</h3>

                <div className="flex flex-col items-center justify-center p-4">
                  <div className="text-5xl font-bold text-blue-600">
                    {results.compliance?.nabers?.energy?.stars.toFixed(1)}
                  </div>
                  <div className="text-lg font-semibold mt-2 text-blue-800">
                    Stars ({results.compliance?.nabers?.energy?.grade})
                  </div>

                  <div className="w-full h-8 bg-gray-200 rounded-full mt-6 overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-red-500 h-full" style={{ width: '20%' }}></div>
                      <div className="bg-orange-500 h-full" style={{ width: '20%' }}></div>
                      <div className="bg-yellow-500 h-full" style={{ width: '20%' }}></div>
                      <div className="bg-green-500 h-full" style={{ width: '20%' }}></div>
                      <div className="bg-green-700 h-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between w-full mt-1 text-xs">
                    <span>1 Star</span>
                    <span>2 Stars</span>
                    <span>3 Stars</span>
                    <span>4 Stars</span>
                    <span>5 Stars</span>
                    <span>6 Stars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Carbon Optimization Opportunities</h3>
                <p className="text-sm text-gray-600">
                  AI-powered recommendations to reduce your carbon footprint
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total Potential Savings:</span>
                <span className="font-bold text-blue-700">
                  {(results.optimizations?.totalPotentialSavings / 1000).toLocaleString()} tonnes CO₂-e
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Percentage Reduction:</span>
                <span className="font-bold text-blue-700">
                  {results.optimizations?.savingsPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-lg text-gray-800 mb-3">Top Recommendations</h3>

            {results.optimizations?.recommendations && (
              <div className="space-y-4">
                {results.optimizations.recommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`rounded-full p-2 ${
                        rec.costImpact === 'Positive' ? 'bg-green-100' :
                        rec.costImpact === 'Neutral' ? 'bg-blue-100' :
                        'bg-orange-100'
                      }`}>
                        <Info className={`w-5 h-5 ${
                          rec.costImpact === 'Positive' ? 'text-green-600' :
                          rec.costImpact === 'Neutral' ? 'text-blue-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      <h4 className="font-semibold">{rec.title}</h4>
                    </div>

                    <div className="ml-10 space-y-2">
                      <div className="flex justify-between">
                        <span>Carbon Savings:</span>
                        <span className="font-semibold">{(rec.carbonSavings / 1000).toFixed(1)} tonnes CO₂-e</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost Impact:</span>
                        <span className={`font-semibold ${
                          rec.costImpact === 'Positive' ? 'text-green-600' :
                          rec.costImpact === 'Neutral' ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>
                          {rec.costImpact}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Implementation:</span>
                        <span className="font-semibold">{rec.implementation}</span>
                      </div>
                      {rec.details && (
                        <p className="text-sm text-gray-600 mt-2">{rec.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
