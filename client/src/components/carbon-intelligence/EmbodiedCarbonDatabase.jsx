import React, { useState } from 'react';
import {
  Database, Search, TrendingDown, Package, Info, Zap,
  ArrowRight, Filter, Download, BookOpen, ExternalLink
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend
);

const EmbodiedCarbonDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [comparisonMaterials, setComparisonMaterials] = useState([]);

  // Material categories
  const categories = [
    { value: 'all', label: 'All Materials' },
    { value: 'concrete', label: 'Concrete & Masonry' },
    { value: 'steel', label: 'Steel & Metals' },
    { value: 'timber', label: 'Timber & Wood Products' },
    { value: 'glazing', label: 'Glazing & Glass' },
    { value: 'insulation', label: 'Insulation' },
    { value: 'finishes', label: 'Finishes & Surfaces' },
    { value: 'services', label: 'Building Services' }
  ];

  // Comprehensive materials database with EPD data
  const materialsDatabase = [
    // Concrete & Masonry
    {
      id: 1,
      name: 'Concrete 20MPa',
      category: 'concrete',
      unit: 'm³',
      ecfA1A3: 290,
      ecfA1D: 310,
      density: 2400,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [2, 3],
      description: 'Standard concrete mix, suitable for general construction',
      specifications: 'AS 1379, 20MPa compressive strength',
      embodiedEnergy: 1.9,
      recyclability: 'High',
      co2Uptake: 15
    },
    {
      id: 2,
      name: 'Concrete 32MPa',
      category: 'concrete',
      unit: 'm³',
      ecfA1A3: 385,
      ecfA1D: 410,
      density: 2400,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [1, 3, 4],
      description: 'Higher strength concrete for structural applications',
      specifications: 'AS 1379, 32MPa compressive strength',
      embodiedEnergy: 2.3,
      recyclability: 'High',
      co2Uptake: 18
    },
    {
      id: 3,
      name: 'Concrete 40MPa',
      category: 'concrete',
      unit: 'm³',
      ecfA1A3: 450,
      ecfA1D: 480,
      density: 2400,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [2, 4],
      description: 'High strength concrete for heavy structural loads',
      specifications: 'AS 1379, 40MPa compressive strength',
      embodiedEnergy: 2.6,
      recyclability: 'Medium',
      co2Uptake: 20
    },
    {
      id: 4,
      name: 'Geopolymer Concrete (GPC)',
      category: 'concrete',
      unit: 'm³',
      ecfA1A3: 220,
      ecfA1D: 195,
      density: 2400,
      source: 'Australian EPD',
      australian: true,
      alternatives: [1, 2, 3],
      description: 'Low carbon alternative using fly ash/slag, 40-80% less carbon',
      specifications: 'Emerging technology, AS 1379 equivalent',
      embodiedEnergy: 1.2,
      recyclability: 'High',
      co2Uptake: 12,
      highlight: true,
      savings: 43
    },
    {
      id: 5,
      name: 'AAC Blocks (Autoclaved Aerated Concrete)',
      category: 'concrete',
      unit: 'm³',
      ecfA1A3: 240,
      ecfA1D: 260,
      density: 550,
      source: 'EPD International',
      australian: false,
      alternatives: [6, 7],
      description: 'Lightweight concrete blocks with excellent insulation',
      specifications: 'AS 4773.2',
      embodiedEnergy: 1.5,
      recyclability: 'Medium',
      co2Uptake: 8
    },

    // Steel & Metals
    {
      id: 10,
      name: 'Structural Steel (Virgin)',
      category: 'steel',
      unit: 'tonne',
      ecfA1A3: 2100,
      ecfA1D: 1950,
      density: 7850,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [11, 12],
      description: 'Virgin steel production via BF-BOF process',
      specifications: 'AS/NZS 3679.1',
      embodiedEnergy: 32,
      recyclability: 'Very High',
      co2Uptake: 0
    },
    {
      id: 11,
      name: 'Structural Steel (50% Recycled)',
      category: 'steel',
      unit: 'tonne',
      ecfA1A3: 1450,
      ecfA1D: 1350,
      density: 7850,
      source: 'Australian EPD',
      australian: true,
      alternatives: [10, 12],
      description: 'Steel with 50% recycled content via EAF process',
      specifications: 'AS/NZS 3679.1',
      embodiedEnergy: 22,
      recyclability: 'Very High',
      co2Uptake: 0,
      highlight: true,
      savings: 31
    },
    {
      id: 12,
      name: 'Structural Steel (100% Recycled)',
      category: 'steel',
      unit: 'tonne',
      ecfA1A3: 800,
      ecfA1D: 750,
      density: 7850,
      source: 'EPD International',
      australian: false,
      alternatives: [10, 11],
      description: 'Fully recycled steel via electric arc furnace',
      specifications: 'AS/NZS 3679.1 equivalent',
      embodiedEnergy: 12,
      recyclability: 'Very High',
      co2Uptake: 0,
      highlight: true,
      savings: 62
    },
    {
      id: 13,
      name: 'Reinforcing Steel Rebar',
      category: 'steel',
      unit: 'tonne',
      ecfA1A3: 1850,
      ecfA1D: 1700,
      density: 7850,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [14],
      description: 'Standard reinforcing steel bars',
      specifications: 'AS/NZS 4671',
      embodiedEnergy: 28,
      recyclability: 'Very High',
      co2Uptake: 0
    },
    {
      id: 14,
      name: 'Reinforcing Steel (Recycled)',
      category: 'steel',
      unit: 'tonne',
      ecfA1A3: 950,
      ecfA1D: 850,
      density: 7850,
      source: 'Australian EPD',
      australian: true,
      alternatives: [13],
      description: 'Recycled steel reinforcement bars',
      specifications: 'AS/NZS 4671',
      embodiedEnergy: 15,
      recyclability: 'Very High',
      co2Uptake: 0,
      highlight: true,
      savings: 49
    },
    {
      id: 15,
      name: 'Aluminium (Primary)',
      category: 'steel',
      unit: 'tonne',
      ecfA1A3: 8500,
      ecfA1D: 8200,
      density: 2700,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [16],
      description: 'Primary aluminium production',
      specifications: 'AS 1734',
      embodiedEnergy: 155,
      recyclability: 'Very High',
      co2Uptake: 0
    },
    {
      id: 16,
      name: 'Aluminium (Recycled)',
      category: 'steel',
      unit: 'tonne',
      ecfA1A3: 1200,
      ecfA1D: 1100,
      density: 2700,
      source: 'Australian EPD',
      australian: true,
      alternatives: [15],
      description: 'Recycled aluminium, 85% less carbon than primary',
      specifications: 'AS 1734',
      embodiedEnergy: 22,
      recyclability: 'Very High',
      co2Uptake: 0,
      highlight: true,
      savings: 86
    },

    // Timber & Wood Products
    {
      id: 20,
      name: 'Hardwood Timber (Native)',
      category: 'timber',
      unit: 'm³',
      ecfA1A3: 150,
      ecfA1D: -850,
      density: 900,
      source: 'Australian EPD',
      australian: true,
      alternatives: [21, 22],
      description: 'Native Australian hardwood, carbon stored',
      specifications: 'AS 2082',
      embodiedEnergy: 2.0,
      recyclability: 'High',
      co2Uptake: 1000,
      carbonStorage: true
    },
    {
      id: 21,
      name: 'Softwood Timber (Plantation)',
      category: 'timber',
      unit: 'm³',
      ecfA1A3: 120,
      ecfA1D: -650,
      density: 550,
      source: 'Australian EPD',
      australian: true,
      alternatives: [20, 22],
      description: 'Plantation softwood with carbon sequestration',
      specifications: 'AS 2082',
      embodiedEnergy: 1.5,
      recyclability: 'High',
      co2Uptake: 770,
      carbonStorage: true,
      highlight: true
    },
    {
      id: 22,
      name: 'Cross-Laminated Timber (CLT)',
      category: 'timber',
      unit: 'm³',
      ecfA1A3: 195,
      ecfA1D: -600,
      density: 485,
      source: 'EPD International',
      australian: true,
      alternatives: [20, 21, 23],
      description: 'Engineered mass timber for structural applications',
      specifications: 'AS 1720.1',
      embodiedEnergy: 2.2,
      recyclability: 'Medium',
      co2Uptake: 795,
      carbonStorage: true,
      highlight: true
    },
    {
      id: 23,
      name: 'Glulam Beams',
      category: 'timber',
      unit: 'm³',
      ecfA1A3: 175,
      ecfA1D: -580,
      density: 450,
      source: 'Australian EPD',
      australian: true,
      alternatives: [20, 22],
      description: 'Glue-laminated timber for structural beams',
      specifications: 'AS/NZS 1328.1',
      embodiedEnergy: 2.0,
      recyclability: 'Medium',
      co2Uptake: 755,
      carbonStorage: true
    },

    // Glazing & Glass
    {
      id: 30,
      name: 'Float Glass (Single)',
      category: 'glazing',
      unit: 'm²',
      ecfA1A3: 55,
      ecfA1D: 58,
      density: 25,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [31, 32],
      description: 'Standard float glass, 6mm thickness',
      specifications: 'AS 1288',
      embodiedEnergy: 0.85,
      recyclability: 'High',
      co2Uptake: 0
    },
    {
      id: 31,
      name: 'Low-E Double Glazing',
      category: 'glazing',
      unit: 'm²',
      ecfA1A3: 195,
      ecfA1D: 205,
      density: 50,
      source: 'Australian EPD',
      australian: true,
      alternatives: [30, 32],
      description: 'Low-emissivity double glazed unit with argon fill',
      specifications: 'AS 1288, AS 2208',
      embodiedEnergy: 3.0,
      recyclability: 'Medium',
      co2Uptake: 0
    },
    {
      id: 32,
      name: 'Triple Glazing (High Performance)',
      category: 'glazing',
      unit: 'm²',
      ecfA1A3: 285,
      ecfA1D: 300,
      density: 75,
      source: 'EPD International',
      australian: false,
      alternatives: [30, 31],
      description: 'Triple glazed unit with two low-E coatings',
      specifications: 'AS 1288 equivalent',
      embodiedEnergy: 4.4,
      recyclability: 'Low',
      co2Uptake: 0
    },

    // Insulation
    {
      id: 40,
      name: 'Glasswool Insulation',
      category: 'insulation',
      unit: 'm³',
      ecfA1A3: 110,
      ecfA1D: 125,
      density: 15,
      source: 'Australian EPD',
      australian: true,
      alternatives: [41, 42, 43],
      description: 'Glass fiber batt insulation',
      specifications: 'AS/NZS 4859.1',
      embodiedEnergy: 1.7,
      recyclability: 'Low',
      co2Uptake: 0
    },
    {
      id: 41,
      name: 'Rockwool Insulation',
      category: 'insulation',
      unit: 'm³',
      ecfA1A3: 125,
      ecfA1D: 140,
      density: 35,
      source: 'EPD International',
      australian: true,
      alternatives: [40, 42, 43],
      description: 'Stone wool insulation, fire resistant',
      specifications: 'AS/NZS 4859.1',
      embodiedEnergy: 1.9,
      recyclability: 'Low',
      co2Uptake: 0
    },
    {
      id: 42,
      name: 'Polyester Insulation (Recycled)',
      category: 'insulation',
      unit: 'm³',
      ecfA1A3: 95,
      ecfA1D: 105,
      density: 10,
      source: 'Australian EPD',
      australian: true,
      alternatives: [40, 41, 43],
      description: 'Recycled PET bottle insulation, non-toxic',
      specifications: 'AS/NZS 4859.1',
      embodiedEnergy: 1.4,
      recyclability: 'Medium',
      co2Uptake: 0,
      highlight: true,
      savings: 14
    },
    {
      id: 43,
      name: 'Cellulose Insulation',
      category: 'insulation',
      unit: 'm³',
      ecfA1A3: 35,
      ecfA1D: 40,
      density: 40,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [40, 41, 42],
      description: 'Recycled newspaper insulation, lowest carbon',
      specifications: 'AS/NZS 4859.1',
      embodiedEnergy: 0.5,
      recyclability: 'High',
      co2Uptake: 50,
      highlight: true,
      savings: 68
    },

    // Finishes
    {
      id: 50,
      name: 'Gypsum Plasterboard',
      category: 'finishes',
      unit: 'm²',
      ecfA1A3: 6.5,
      ecfA1D: 7.2,
      density: 9.5,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [51],
      description: 'Standard plasterboard, 13mm thickness',
      specifications: 'AS/NZS 2588',
      embodiedEnergy: 0.38,
      recyclability: 'Low',
      co2Uptake: 0
    },
    {
      id: 51,
      name: 'Gypsum Plasterboard (Recycled)',
      category: 'finishes',
      unit: 'm²',
      ecfA1A3: 4.8,
      ecfA1D: 5.3,
      density: 9.5,
      source: 'Australian EPD',
      australian: true,
      alternatives: [50],
      description: 'Plasterboard with recycled gypsum content',
      specifications: 'AS/NZS 2588',
      embodiedEnergy: 0.28,
      recyclability: 'Medium',
      co2Uptake: 0,
      highlight: true,
      savings: 26
    },
    {
      id: 52,
      name: 'Ceramic Tiles',
      category: 'finishes',
      unit: 'm²',
      ecfA1A3: 18,
      ecfA1D: 20,
      density: 25,
      source: 'ICE Database v3.0',
      australian: true,
      alternatives: [53],
      description: 'Standard ceramic floor/wall tiles',
      specifications: 'AS 4459',
      embodiedEnergy: 0.95,
      recyclability: 'Low',
      co2Uptake: 0
    },
    {
      id: 53,
      name: 'Porcelain Tiles',
      category: 'finishes',
      unit: 'm²',
      ecfA1A3: 22,
      ecfA1D: 24,
      density: 28,
      source: 'EPD International',
      australian: false,
      alternatives: [52],
      description: 'Higher density porcelain tiles',
      specifications: 'AS 4459',
      embodiedEnergy: 1.15,
      recyclability: 'Low',
      co2Uptake: 0
    }
  ];

  // Filter materials
  const filteredMaterials = materialsDatabase.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to comparison
  const toggleComparison = (material) => {
    if (comparisonMaterials.find(m => m.id === material.id)) {
      setComparisonMaterials(comparisonMaterials.filter(m => m.id !== material.id));
    } else if (comparisonMaterials.length < 4) {
      setComparisonMaterials([...comparisonMaterials, material]);
    }
  };

  // Get comparison chart data
  const getComparisonChartData = () => {
    if (comparisonMaterials.length === 0) return null;

    return {
      labels: comparisonMaterials.map(m => m.name),
      datasets: [
        {
          label: 'A1-A3 (Product Stage)',
          data: comparisonMaterials.map(m => m.ecfA1A3),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        },
        {
          label: 'A1-D (with End-of-Life)',
          data: comparisonMaterials.map(m => m.ecfA1D),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const comparisonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6B7280',
          font: { size: 12 }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          callback: function(value) {
            return value + ' kg';
          }
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)'
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: { size: 10 }
        },
        grid: {
          display: false
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
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Embodied Carbon Database
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {materialsDatabase.length} materials with EPD & ICE database values
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                ICE v3.0
              </div>
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                EPD Data
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Search Materials
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Search by material name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Category Filter
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing {filteredMaterials.length} of {materialsDatabase.length} materials
            </p>
            {comparisonMaterials.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {comparisonMaterials.length} selected for comparison
                </span>
                <button
                  onClick={() => setComparisonMaterials([])}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                comparisonMaterials.find(m => m.id === material.id)
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                  : material.highlight
                  ? 'border-green-300 dark:border-green-700'
                  : 'border-neutral-200 dark:border-gray-700'
              }`}
              onClick={() => toggleComparison(material)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {material.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {material.australian && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                        🇦🇺 AU
                      </span>
                    )}
                    {material.highlight && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                        ⭐ Low Carbon
                      </span>
                    )}
                    {material.carbonStorage && (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
                        🌳 Carbon Storage
                      </span>
                    )}
                  </div>
                </div>
                <Package className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                {material.description}
              </p>

              {/* Emissions Data */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">A1-A3 (Product):</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {material.ecfA1A3} kg CO₂-e/{material.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">A1-D (Full LCA):</span>
                  <span className={`text-sm font-bold ${
                    material.ecfA1D < 0 ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
                  }`}>
                    {material.ecfA1D} kg CO₂-e/{material.unit}
                  </span>
                </div>
                {material.savings && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Potential Savings:</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      -{material.savings}%
                    </span>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="pt-3 border-t border-neutral-200 dark:border-gray-700 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 dark:text-neutral-400">Source:</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{material.source}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 dark:text-neutral-400">Recyclability:</span>
                  <span className={`font-medium ${
                    material.recyclability === 'Very High' ? 'text-green-600' :
                    material.recyclability === 'High' ? 'text-blue-600' :
                    material.recyclability === 'Medium' ? 'text-yellow-600' : 'text-orange-600'
                  }`}>
                    {material.recyclability}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 dark:text-neutral-400">Specification:</span>
                  <span className="text-neutral-900 dark:text-white font-medium text-right">{material.specifications}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        {comparisonMaterials.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Material Comparison
            </h2>

            {/* Comparison Chart */}
            <div className="h-80 mb-6">
              {getComparisonChartData() && (
                <Bar data={getComparisonChartData()} options={comparisonChartOptions} />
              )}
            </div>

            {/* Detailed Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Material</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">A1-A3</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">A1-D</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Embodied Energy</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Recyclability</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonMaterials.map((material) => (
                    <tr key={material.id} className="border-b border-neutral-100 dark:border-gray-700">
                      <td className="py-3 px-2 text-sm font-medium text-neutral-900 dark:text-white">
                        {material.name}
                      </td>
                      <td className="py-3 px-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {material.ecfA1A3} kg
                      </td>
                      <td className="py-3 px-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                        {material.ecfA1D} kg
                      </td>
                      <td className="py-3 px-2 text-sm text-neutral-900 dark:text-white">
                        {material.embodiedEnergy} MJ/{material.unit}
                      </td>
                      <td className="py-3 px-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          material.recyclability === 'Very High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          material.recyclability === 'High' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          material.recyclability === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        }`}>
                          {material.recyclability}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-neutral-600 dark:text-neutral-400">
                        {material.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Resources & References
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://circularecology.com/ice-database.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">ICE Database v3.0</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Circular Ecology</div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            </a>

            <a
              href="https://www.environdec.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">EPD International</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Environmental Product Declarations</div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            </a>

            <a
              href="https://www.gbca.org.au"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">Green Building Council</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Australian Resources</div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbodiedCarbonDatabase;
