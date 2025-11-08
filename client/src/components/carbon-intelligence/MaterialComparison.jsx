import React, { useState, useEffect } from 'react';
import { Search, Plus, Zap, DollarSign, Truck, BarChart3, TrendingDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
);

const MaterialComparison = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [materialCategories, setMaterialCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('embodied');

  // Simulate loading material data
  useEffect(() => {
    const fetchMaterialData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock material categories
      const categories = [
        { id: 'concrete', name: 'Concrete', iconColor: 'bg-blue-500' },
        { id: 'steel', name: 'Steel', iconColor: 'bg-red-500' },
        { id: 'timber', name: 'Timber', iconColor: 'bg-green-500' },
        { id: 'masonry', name: 'Masonry', iconColor: 'bg-amber-500' },
        { id: 'insulation', name: 'Insulation', iconColor: 'bg-purple-500' },
        { id: 'glazing', name: 'Glazing', iconColor: 'bg-cyan-500' },
        { id: 'finishes', name: 'Finishes', iconColor: 'bg-pink-500' },
        { id: 'services', name: 'Services', iconColor: 'bg-gray-500' }
      ];

      setMaterialCategories(categories);
      setSelectedCategory(categories[0]);
      setIsLoading(false);

      // Load concrete options by default
      loadMaterialOptions('concrete');
    };

    fetchMaterialData();
  }, []);

  const loadMaterialOptions = async (categoryId) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock material options based on category
    let options = [];

    if (categoryId === 'concrete') {
      options = [
        {
          id: 'concrete-32mpa',
          name: '32 MPa Standard Concrete',
          kgCO2ePerM3: 365,
          cost: 240, // $ per m³
          transportDistance: 25, // km
          locallyAvailable: true,
          recyclable: false,
          recycledContent: 0,
          durability: 'Excellent',
          strengthMPa: 32,
          maintenanceFrequency: 'None',
          description: 'Standard 32 MPa concrete commonly used for structural elements.',
          alternatives: [
            { id: 'concrete-gpc-32mpa', name: '32 MPa Geopolymer Concrete (GPC)' },
            { id: 'concrete-recycled-aggregate', name: 'Concrete with 30% Recycled Aggregate' }
          ],
          wholeLifeCarbonImpacts: {
            productStage: 330,
            constructionStage: 25,
            useStage: 10,
            endOfLifeStage: 15,
            beyondLifeStage: -15
          }
        },
        {
          id: 'concrete-40mpa',
          name: '40 MPa High Strength Concrete',
          kgCO2ePerM3: 410,
          cost: 280, // $ per m³
          transportDistance: 25, // km
          locallyAvailable: true,
          recyclable: false,
          recycledContent: 0,
          durability: 'Excellent',
          strengthMPa: 40,
          maintenanceFrequency: 'None',
          description: 'High strength 40 MPa concrete used for heavy load-bearing elements.',
          alternatives: [
            { id: 'concrete-gpc-40mpa', name: '40 MPa Geopolymer Concrete (GPC)' }
          ],
          wholeLifeCarbonImpacts: {
            productStage: 380,
            constructionStage: 25,
            useStage: 5,
            endOfLifeStage: 15,
            beyondLifeStage: -15
          }
        },
        {
          id: 'concrete-gpc-32mpa',
          name: '32 MPa Geopolymer Concrete (GPC)',
          kgCO2ePerM3: 146,
          cost: 280, // $ per m³
          transportDistance: 40, // km
          locallyAvailable: true,
          recyclable: false,
          recycledContent: 0,
          durability: 'Excellent',
          strengthMPa: 32,
          maintenanceFrequency: 'None',
          description: 'Geopolymer concrete with 60% lower carbon emissions than standard concrete.',
          alternatives: [
            { id: 'concrete-32mpa', name: '32 MPa Standard Concrete' }
          ],
          wholeLifeCarbonImpacts: {
            productStage: 120,
            constructionStage: 20,
            useStage: 6,
            endOfLifeStage: 15,
            beyondLifeStage: -15
          }
        },
        {
          id: 'concrete-recycled-aggregate',
          name: 'Concrete with 30% Recycled Aggregate',
          kgCO2ePerM3: 292,
          cost: 250, // $ per m³
          transportDistance: 25, // km
          locallyAvailable: true,
          recyclable: true,
          recycledContent: 30,
          durability: 'Excellent',
          strengthMPa: 32,
          maintenanceFrequency: 'None',
          description: 'Standard concrete with 30% recycled aggregate, reducing virgin material usage.',
          alternatives: [
            { id: 'concrete-32mpa', name: '32 MPa Standard Concrete' },
            { id: 'concrete-gpc-32mpa', name: '32 MPa Geopolymer Concrete (GPC)' }
          ],
          wholeLifeCarbonImpacts: {
            productStage: 260,
            constructionStage: 25,
            useStage: 7,
            endOfLifeStage: 15,
            beyondLifeStage: -15
          }
        }
      ];
    } else if (categoryId === 'steel') {
      options = [
        {
          id: 'steel-rebar-virgin',
          name: 'Virgin Steel Rebar',
          kgCO2ePerKg: 1.85,
          cost: 1.20,
          transportDistance: 30,
          locallyAvailable: true,
          recyclable: true,
          recycledContent: 0,
          durability: 'Excellent',
          maintenanceFrequency: 'None',
          description: 'Standard virgin steel reinforcement bars.',
          alternatives: [
            { id: 'steel-rebar-recycled', name: 'Recycled Steel Rebar' }
          ],
          wholeLifeCarbonImpacts: {
            productStage: 1.70,
            constructionStage: 0.10,
            useStage: 0.05,
            endOfLifeStage: 0.05,
            beyondLifeStage: -0.05
          }
        },
        {
          id: 'steel-rebar-recycled',
          name: 'Recycled Steel Rebar',
          kgCO2ePerKg: 0.55,
          cost: 1.25,
          transportDistance: 30,
          locallyAvailable: true,
          recyclable: true,
          recycledContent: 90,
          durability: 'Excellent',
          maintenanceFrequency: 'None',
          description: 'Steel rebar made from 90% recycled content.',
          alternatives: [
            { id: 'steel-rebar-virgin', name: 'Virgin Steel Rebar' }
          ],
          wholeLifeCarbonImpacts: {
            productStage: 0.45,
            constructionStage: 0.07,
            useStage: 0.03,
            endOfLifeStage: 0.05,
            beyondLifeStage: -0.05
          }
        }
      ];
    } else if (categoryId === 'timber') {
      options = [
        {
          id: 'timber-pine-framing',
          name: 'Pine Framing Timber',
          kgCO2ePerKg: -0.35,
          cost: 0.85,
          transportDistance: 50,
          locallyAvailable: true,
          recyclable: true,
          recycledContent: 0,
          durability: 'Good',
          maintenanceFrequency: 'Low',
          description: 'Standard pine framing timber with carbon sequestration benefits.',
          alternatives: [],
          wholeLifeCarbonImpacts: {
            productStage: -0.50,
            constructionStage: 0.10,
            useStage: 0.05,
            endOfLifeStage: 0.05,
            beyondLifeStage: -0.05
          }
        },
        {
          id: 'timber-clt',
          name: 'Cross-Laminated Timber (CLT)',
          kgCO2ePerKg: -0.42,
          cost: 1.50,
          transportDistance: 100,
          locallyAvailable: true,
          recyclable: true,
          recycledContent: 0,
          durability: 'Excellent',
          maintenanceFrequency: 'None',
          description: 'Engineered CLT panels with excellent carbon sequestration.',
          alternatives: [],
          wholeLifeCarbonImpacts: {
            productStage: -0.60,
            constructionStage: 0.12,
            useStage: 0.06,
            endOfLifeStage: 0.05,
            beyondLifeStage: -0.05
          }
        }
      ];
    } else {
      options = [
        {
          id: 'generic-1',
          name: `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} Option 1`,
          kgCO2ePerM3: 150,
          cost: 100,
          transportDistance: 20,
          locallyAvailable: true,
          recyclable: false,
          recycledContent: 0,
          durability: 'Good',
          maintenanceFrequency: 'Low',
          description: `Standard ${categoryId} option.`,
          alternatives: [],
          wholeLifeCarbonImpacts: {
            productStage: 130,
            constructionStage: 15,
            useStage: 5,
            endOfLifeStage: 5,
            beyondLifeStage: -5
          }
        }
      ];
    }

    setMaterialOptions(options);
    setIsLoading(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadMaterialOptions(category.id);
  };

  const addToComparison = (material) => {
    if (comparisons.some(item => item.id === material.id)) {
      return; // Already in comparison
    }

    if (comparisons.length >= 3) {
      setComparisons(prev => [...prev.slice(1), material]);
    } else {
      setComparisons(prev => [...prev, material]);
    }
  };

  const removeFromComparison = (materialId) => {
    setComparisons(prev => prev.filter(item => item.id !== materialId));
  };

  const filteredMaterials = materialOptions.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Comparison chart data
  const getComparisonChartData = () => {
    if (activeTab === 'embodied') {
      return {
        labels: comparisons.map(material => material.name),
        datasets: [{
          label: 'Embodied Carbon',
          data: comparisons.map(material => material.kgCO2ePerM3 || material.kgCO2ePerKg || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
    } else if (activeTab === 'cost') {
      return {
        labels: comparisons.map(material => material.name),
        datasets: [{
          label: 'Cost',
          data: comparisons.map(material => material.cost),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    } else if (activeTab === 'lifecycle') {
      return {
        labels: ['Product', 'Construction', 'Use', 'End of Life', 'Beyond Life'],
        datasets: comparisons.map((material, index) => ({
          label: material.name,
          data: [
            material.wholeLifeCarbonImpacts.productStage,
            material.wholeLifeCarbonImpacts.constructionStage,
            material.wholeLifeCarbonImpacts.useStage,
            material.wholeLifeCarbonImpacts.endOfLifeStage,
            material.wholeLifeCarbonImpacts.beyondLifeStage
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ][index],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)'
          ][index],
          borderWidth: 1
        }))
      };
    }
  };

  // Chart options based on active tab
  const getChartOptions = () => {
    if (activeTab === 'lifecycle') {
      return {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'kg CO₂-e per unit'
            }
          }
        }
      };
    } else {
      return {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: activeTab === 'embodied' ? 'kg CO₂-e per unit' : '$ per unit'
            }
          }
        }
      };
    }
  };

  if (isLoading && !selectedCategory) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-700">Loading material data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Material Comparison</h1>

      {/* Material Category Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Material Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {materialCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category)}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                selectedCategory?.id === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-center mb-2">
                <div className={`w-8 h-8 rounded-full ${category.iconColor}`}></div>
              </div>
              <div className="font-semibold">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Options */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{selectedCategory?.name} Options</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{material.name}</h3>
                      <p className="text-sm text-gray-600">{material.description}</p>
                    </div>
                    <button
                      onClick={() => addToComparison(material)}
                      className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Add to comparison"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mt-3">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-blue-600 mr-2" />
                      <div>
                        <div className="font-medium">
                          {material.kgCO2ePerM3 ? `${material.kgCO2ePerM3} kg CO₂e/m³` : `${material.kgCO2ePerKg} kg CO₂e/kg`}
                        </div>
                        <div className="text-xs text-gray-500">Embodied Carbon</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                      <div>
                        <div className="font-medium">
                          ${material.cost}/unit
                        </div>
                        <div className="text-xs text-gray-500">Cost</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-orange-600 mr-2" />
                      <div>
                        <div className="font-medium">
                          {material.transportDistance} km
                        </div>
                        <div className="text-xs text-gray-500">Transport</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Material Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Material Comparison</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('embodied')}
                className={`px-3 py-1 rounded ${activeTab === 'embodied' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Embodied
              </button>
              <button
                onClick={() => setActiveTab('cost')}
                className={`px-3 py-1 rounded ${activeTab === 'cost' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cost
              </button>
              <button
                onClick={() => setActiveTab('lifecycle')}
                className={`px-3 py-1 rounded ${activeTab === 'lifecycle' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Lifecycle
              </button>
            </div>
          </div>

          {comparisons.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="bg-gray-100 p-3 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-700 font-medium mb-1">No materials selected for comparison</p>
              <p className="text-gray-500 text-sm">Add materials from the left panel</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Bar data={getComparisonChartData()} options={getChartOptions()} />
              </div>

              <div className="space-y-3">
                {comparisons.map((material, index) => (
                  <div key={material.id} className="flex justify-between items-start p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{material.name}</div>
                      <div className="text-sm flex flex-wrap gap-3 mt-1">
                        <span className="text-blue-700">{material.kgCO2ePerM3 ? `${material.kgCO2ePerM3} kg CO₂e/m³` : `${material.kgCO2ePerKg} kg CO₂e/kg`}</span>
                        <span className="text-green-700">${material.cost}/unit</span>
                      </div>
                      {index > 0 && comparisons[0].kgCO2ePerM3 && material.kgCO2ePerM3 && (
                        <div className="text-sm text-green-700 flex items-center mt-1">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          {(100 - (material.kgCO2ePerM3 / comparisons[0].kgCO2ePerM3 * 100)).toFixed(1)}% embodied carbon reduction
                        </div>
                      )}
                      {index > 0 && comparisons[0].kgCO2ePerKg && material.kgCO2ePerKg && (
                        <div className="text-sm text-green-700 flex items-center mt-1">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          {(100 - (material.kgCO2ePerKg / comparisons[0].kgCO2ePerKg * 100)).toFixed(1)}% embodied carbon reduction
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromComparison(material.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {comparisons.length > 1 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Expert Analysis</h3>
                  <p className="text-blue-800 text-sm">
                    {activeTab === 'embodied' && (
                      <>
                        {comparisons.length > 1 && comparisons[0].kgCO2ePerM3 && comparisons[1].kgCO2ePerM3 && (
                          <>
                            Switching from {comparisons[0].name} to {comparisons[1].name} would reduce embodied carbon by {(100 - (comparisons[1].kgCO2ePerM3 / comparisons[0].kgCO2ePerM3 * 100)).toFixed(1)}%. This significant reduction highlights the importance of material selection in sustainable design.
                          </>
                        )}
                        {comparisons.length > 1 && comparisons[0].kgCO2ePerKg && comparisons[1].kgCO2ePerKg && (
                          <>
                            Switching from {comparisons[0].name} to {comparisons[1].name} would reduce embodied carbon by {(100 - (comparisons[1].kgCO2ePerKg / comparisons[0].kgCO2ePerKg * 100)).toFixed(1)}%. This significant reduction highlights the importance of material selection in sustainable design.
                          </>
                        )}
                      </>
                    )}
                    {activeTab === 'cost' && 'Material cost analysis shows a potential trade-off between upfront costs and environmental impact. The lower-carbon options may have a slightly higher initial cost but provide significant long-term carbon benefits.'}
                    {activeTab === 'lifecycle' && 'The lifecycle analysis shows that certain materials offer carbon sequestration benefits in the beyond-life stage. Materials like timber have negative carbon values in Stage D, offsetting their embodied carbon over the full lifecycle.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialComparison;
