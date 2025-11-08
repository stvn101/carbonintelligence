import React, { useState } from 'react';
import {
  Calculator, Building2, TrendingDown, AlertCircle, Download,
  FileText, CheckCircle, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, LineElement, PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, LineElement, PointElement
);

const LCACalculator = () => {
  const [projectConfig, setProjectConfig] = useState({
    projectName: '',
    buildingType: 'office',
    gfa: 5000,
    location: 'Sydney',
    designLife: 50,
    climateZone: 'Zone 5'
  });

  const [lcaStages, setLcaStages] = useState({
    a1a3: { value: 0, label: 'A1-A3: Product Stage', enabled: true },
    a4: { value: 0, label: 'A4: Transport', enabled: true },
    a5: { value: 0, label: 'A5: Construction', enabled: true },
    b1: { value: 0, label: 'B1: Use', enabled: false },
    b2: { value: 0, label: 'B2: Maintenance', enabled: true },
    b3: { value: 0, label: 'B3: Repair', enabled: true },
    b4: { value: 0, label: 'B4: Replacement', enabled: true },
    b5: { value: 0, label: 'B5: Refurbishment', enabled: false },
    b6: { value: 0, label: 'B6: Operational Energy', enabled: true },
    b7: { value: 0, label: 'B7: Operational Water', enabled: true },
    c1: { value: 0, label: 'C1: Deconstruction', enabled: true },
    c2: { value: 0, label: 'C2: Transport', enabled: true },
    c3: { value: 0, label: 'C3: Waste Processing', enabled: true },
    c4: { value: 0, label: 'C4: Disposal', enabled: true },
    d: { value: 0, label: 'D: Benefits & Loads', enabled: true }
  });

  const [materials, setMaterials] = useState([
    {
      id: 1,
      category: 'Structure',
      material: 'Concrete (32MPa)',
      quantity: 1200,
      unit: 'm³',
      ecf: 385, // kg CO₂-e per unit
      a1a3: 462000,
      a4: 18000,
      a5: 12000,
      transport: 15
    },
    {
      id: 2,
      category: 'Structure',
      material: 'Structural Steel',
      quantity: 180,
      unit: 'tonnes',
      ecf: 2100,
      a1a3: 378000,
      a4: 7200,
      a5: 5400,
      transport: 40
    },
    {
      id: 3,
      category: 'Envelope',
      material: 'Aluminium Glazing',
      quantity: 2500,
      unit: 'm²',
      ecf: 195,
      a1a3: 487500,
      a4: 12500,
      a5: 7500,
      transport: 5
    }
  ]);

  const [expandedStages, setExpandedStages] = useState({
    product: true,
    construction: false,
    use: false,
    endOfLife: false,
    beyond: false
  });

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Building type options
  const buildingTypes = [
    { value: 'office', label: 'Office Building', benchmark: 800 },
    { value: 'residential', label: 'Residential', benchmark: 600 },
    { value: 'retail', label: 'Retail', benchmark: 900 },
    { value: 'education', label: 'Education', benchmark: 700 },
    { value: 'healthcare', label: 'Healthcare', benchmark: 1100 },
    { value: 'industrial', label: 'Industrial', benchmark: 500 },
    { value: 'mixed', label: 'Mixed Use', benchmark: 750 }
  ];

  // Australian locations with grid factors (kg CO₂-e/kWh)
  const locations = [
    { value: 'Sydney', label: 'Sydney, NSW', gridFactor: 0.81, zone: 'Zone 5' },
    { value: 'Melbourne', label: 'Melbourne, VIC', gridFactor: 1.02, zone: 'Zone 6' },
    { value: 'Brisbane', label: 'Brisbane, QLD', gridFactor: 0.79, zone: 'Zone 2' },
    { value: 'Perth', label: 'Perth, WA', gridFactor: 0.70, zone: 'Zone 5' },
    { value: 'Adelaide', label: 'Adelaide, SA', gridFactor: 0.58, zone: 'Zone 5' },
    { value: 'Canberra', label: 'Canberra, ACT', gridFactor: 0.81, zone: 'Zone 7' },
    { value: 'Hobart', label: 'Hobart, TAS', gridFactor: 0.18, zone: 'Zone 7' },
    { value: 'Darwin', label: 'Darwin, NT', gridFactor: 0.58, zone: 'Zone 1' }
  ];

  // Calculate LCA
  const calculateLCA = () => {
    const location = locations.find(l => l.value === projectConfig.location);
    const buildingType = buildingTypes.find(b => b.value === projectConfig.buildingType);

    // Sum materials by stage
    const stageA1A3 = materials.reduce((sum, m) => sum + m.a1a3, 0);
    const stageA4 = materials.reduce((sum, m) => sum + m.a4, 0);
    const stageA5 = materials.reduce((sum, m) => sum + m.a5, 0);

    // Use stage calculations (B6 - Operational Energy)
    const annualEnergyConsumption = projectConfig.gfa * 120; // kWh per year (120 kWh/m²)
    const stageB6 = annualEnergyConsumption * location.gridFactor * projectConfig.designLife;

    // Maintenance and replacement (simplified)
    const stageB2B4 = stageA1A3 * 0.15; // 15% of product stage over life

    // End of life stages
    const stageC1C4 = stageA1A3 * 0.05; // 5% of product stage

    // Module D (Benefits from recycling)
    const stageD = -(stageA1A3 * 0.08); // 8% credit

    // Total calculations
    const totalEmbodied = stageA1A3 + stageA4 + stageA5 + stageB2B4 + stageC1C4;
    const totalOperational = stageB6;
    const totalWithBenefits = totalEmbodied + totalOperational + stageD;
    const totalWithoutBenefits = totalEmbodied + totalOperational;

    const kgPerM2 = totalWithoutBenefits / projectConfig.gfa;
    const benchmark = buildingType.benchmark;
    const benchmarkComparison = ((kgPerM2 - benchmark) / benchmark) * 100;

    setResults({
      stages: {
        a1a3: stageA1A3,
        a4: stageA4,
        a5: stageA5,
        b2b4: stageB2B4,
        b6: stageB6,
        c1c4: stageC1C4,
        d: stageD
      },
      totals: {
        embodied: totalEmbodied,
        operational: totalOperational,
        withBenefits: totalWithBenefits,
        withoutBenefits: totalWithoutBenefits
      },
      metrics: {
        kgPerM2: kgPerM2,
        benchmark: benchmark,
        benchmarkComparison: benchmarkComparison,
        rating: benchmarkComparison < -20 ? 'Excellent' :
               benchmarkComparison < 0 ? 'Good' :
               benchmarkComparison < 20 ? 'Fair' : 'Poor'
      }
    });

    setShowResults(true);
  };

  // Chart data
  const getStagesChartData = () => {
    if (!results) return null;

    return {
      labels: ['A1-A3\nProduct', 'A4\nTransport', 'A5\nConstruction', 'B2-B4\nMaintenance', 'B6\nOperational', 'C1-C4\nEnd of Life', 'D\nBenefits'],
      datasets: [{
        label: 'Carbon Emissions (kg CO₂-e)',
        data: [
          results.stages.a1a3,
          results.stages.a4,
          results.stages.a5,
          results.stages.b2b4,
          results.stages.b6,
          results.stages.c1c4,
          results.stages.d
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 1
      }]
    };
  };

  const getMaterialsChartData = () => {
    return {
      labels: materials.map(m => m.material),
      datasets: [{
        label: 'A1-A3 Product Stage',
        data: materials.map(m => m.a1a3),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }]
    };
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
            return value.toLocaleString() + ' kg';
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

  const addMaterial = () => {
    const newMaterial = {
      id: materials.length + 1,
      category: 'Structure',
      material: '',
      quantity: 0,
      unit: 'm³',
      ecf: 0,
      a1a3: 0,
      a4: 0,
      a5: 0,
      transport: 0
    };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (id, field, value) => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        // Recalculate emissions if quantity or ECF changes
        if (field === 'quantity' || field === 'ecf') {
          updated.a1a3 = updated.quantity * updated.ecf;
          updated.a4 = updated.a1a3 * 0.04; // 4% for transport
          updated.a5 = updated.a1a3 * 0.03; // 3% for construction
        }
        return updated;
      }
      return m;
    }));
  };

  const removeMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const toggleStageExpansion = (stage) => {
    setExpandedStages({ ...expandedStages, [stage]: !expandedStages[stage] });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Life Cycle Assessment Calculator
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Calculate full LCA according to EN 15978:2011 standard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                EN 15978
              </div>
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                EN 15804
              </div>
            </div>
          </div>
        </div>

        {/* Project Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Project Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={projectConfig.projectName}
                onChange={(e) => setProjectConfig({ ...projectConfig, projectName: e.target.value })}
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Building Type
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={projectConfig.buildingType}
                onChange={(e) => setProjectConfig({ ...projectConfig, buildingType: e.target.value })}
              >
                {buildingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Gross Floor Area (m²)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={projectConfig.gfa}
                onChange={(e) => setProjectConfig({ ...projectConfig, gfa: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Location
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={projectConfig.location}
                onChange={(e) => {
                  const selected = locations.find(l => l.value === e.target.value);
                  setProjectConfig({
                    ...projectConfig,
                    location: e.target.value,
                    climateZone: selected.zone
                  });
                }}
              >
                {locations.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                NCC Climate Zone
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-neutral-100 dark:bg-gray-900 text-neutral-900 dark:text-white"
                value={projectConfig.climateZone}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Design Life (years)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={projectConfig.designLife}
                onChange={(e) => setProjectConfig({ ...projectConfig, designLife: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Materials Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Material Quantities
            </h2>
            <button
              onClick={addMaterial}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Add Material
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Category</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Material</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Quantity</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Unit</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">ECF (kg CO₂-e)</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">A1-A3 Total</th>
                  <th className="text-center py-3 px-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.id} className="border-b border-neutral-100 dark:border-gray-700">
                    <td className="py-3 px-2">
                      <select
                        className="w-full px-2 py-1 border border-neutral-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-neutral-900 dark:text-white text-sm"
                        value={material.category}
                        onChange={(e) => updateMaterial(material.id, 'category', e.target.value)}
                      >
                        <option>Structure</option>
                        <option>Envelope</option>
                        <option>Finishes</option>
                        <option>Services</option>
                        <option>Other</option>
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-neutral-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-neutral-900 dark:text-white text-sm"
                        value={material.material}
                        onChange={(e) => updateMaterial(material.id, 'material', e.target.value)}
                        placeholder="Material name"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        className="w-full px-2 py-1 border border-neutral-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-neutral-900 dark:text-white text-sm"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(material.id, 'quantity', Number(e.target.value))}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <select
                        className="w-full px-2 py-1 border border-neutral-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-neutral-900 dark:text-white text-sm"
                        value={material.unit}
                        onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                      >
                        <option>m³</option>
                        <option>tonnes</option>
                        <option>m²</option>
                        <option>m</option>
                        <option>units</option>
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        className="w-full px-2 py-1 border border-neutral-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-neutral-900 dark:text-white text-sm"
                        value={material.ecf}
                        onChange={(e) => updateMaterial(material.id, 'ecf', Number(e.target.value))}
                      />
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-neutral-900 dark:text-white">
                      {material.a1a3.toLocaleString()} kg
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => removeMaterial(material.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={calculateLCA}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
          >
            <Calculator className="w-5 h-5 inline-block mr-2" />
            Calculate Life Cycle Assessment
          </button>
        </div>

        {/* Results Section */}
        {showResults && results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Total Embodied Carbon</div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {(results.totals.embodied / 1000).toFixed(1)} t
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {(results.totals.embodied / projectConfig.gfa).toFixed(1)} kg/m²
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Operational Carbon</div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {(results.totals.operational / 1000).toFixed(1)} t
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  Over {projectConfig.designLife} years
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Total Carbon</div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {(results.totals.withoutBenefits / 1000).toFixed(1)} t
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {results.metrics.kgPerM2.toFixed(1)} kg/m²
                </div>
              </div>

              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 p-6 ${
                results.metrics.rating === 'Excellent' ? 'border-green-500' :
                results.metrics.rating === 'Good' ? 'border-blue-500' :
                results.metrics.rating === 'Fair' ? 'border-yellow-500' : 'border-red-500'
              }`}>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Performance Rating</div>
                <div className={`text-2xl font-bold ${
                  results.metrics.rating === 'Excellent' ? 'text-green-600' :
                  results.metrics.rating === 'Good' ? 'text-blue-600' :
                  results.metrics.rating === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {results.metrics.rating}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {results.metrics.benchmarkComparison > 0 ? '+' : ''}{results.metrics.benchmarkComparison.toFixed(1)}% vs benchmark
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  LCA Stages Breakdown
                </h3>
                <div className="h-80">
                  {getStagesChartData() && (
                    <Bar data={getStagesChartData()} options={chartOptions} />
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Materials Carbon Impact
                </h3>
                <div className="h-80">
                  <Bar data={getMaterialsChartData()} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Detailed Stage Results */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Detailed Stage Results
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-900 rounded-lg">
                  <span className="font-medium text-neutral-900 dark:text-white">A1-A3: Product Stage</span>
                  <span className="font-bold text-blue-600">{(results.stages.a1a3 / 1000).toFixed(2)} tonnes CO₂-e</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-900 rounded-lg">
                  <span className="font-medium text-neutral-900 dark:text-white">A4: Transport to Site</span>
                  <span className="font-bold text-indigo-600">{(results.stages.a4 / 1000).toFixed(2)} tonnes CO₂-e</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-900 rounded-lg">
                  <span className="font-medium text-neutral-900 dark:text-white">A5: Construction Process</span>
                  <span className="font-bold text-purple-600">{(results.stages.a5 / 1000).toFixed(2)} tonnes CO₂-e</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-900 rounded-lg">
                  <span className="font-medium text-neutral-900 dark:text-white">B2-B4: Maintenance & Replacement</span>
                  <span className="font-bold text-pink-600">{(results.stages.b2b4 / 1000).toFixed(2)} tonnes CO₂-e</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-900 rounded-lg">
                  <span className="font-medium text-neutral-900 dark:text-white">B6: Operational Energy Use</span>
                  <span className="font-bold text-rose-600">{(results.stages.b6 / 1000).toFixed(2)} tonnes CO₂-e</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-gray-900 rounded-lg">
                  <span className="font-medium text-neutral-900 dark:text-white">C1-C4: End of Life</span>
                  <span className="font-bold text-orange-600">{(results.stages.c1c4 / 1000).toFixed(2)} tonnes CO₂-e</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="font-medium text-neutral-900 dark:text-white">D: Benefits & Loads Beyond</span>
                  <span className="font-bold text-green-600">{(results.stages.d / 1000).toFixed(2)} tonnes CO₂-e</span>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Export Results</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF Report
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Export to Excel
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Generate Compliance Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LCACalculator;
