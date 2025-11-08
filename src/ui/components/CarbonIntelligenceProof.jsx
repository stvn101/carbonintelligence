import React, { useState, useEffect } from 'react';
import { Search, MapPin, Zap, Database, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

// Import the utilities (in a real implementation these would be proper imports)
// import { CacheSystem } from '../../utils/cache';
// import { ApiClient } from '../../utils/api';
// import { AustralianContext } from '../../utils/australian-context';

// Simulated cache storage (in real app, this would use the CacheSystem utility)
let materialCache = new Map();
let apiCallLog = [];

// Simulated Australian intelligence overlay (in real app, this would use the AustralianContext utility)
const australianIntelligence = {
  transportPenalties: {
    brisbane: { steel: 0.15, concrete: 5, timber: 0.02 },
    sydney: { steel: 0.03, concrete: 4, timber: 0.02 },
    melbourne: { steel: 0.06, concrete: 5, timber: 0.04 }
  },
  supplierMapping: {
    "ready_mix_25mpa": {
      brisbane: ["Boral Pinkenba", "Holcim Eagle Farm"],
      sydney: ["Boral Smeaton Grange", "Holcim Eastern Creek"],
      melbourne: ["Boral Deer Park", "Holcim Laverton"]
    },
    "steel_rebar_12mm": {
      brisbane: ["InfraBuild Brisbane", "Smorgon Steel"],
      sydney: ["BlueScope Port Kembla", "InfraBuild Sydney"],
      melbourne: ["BlueScope Hastings", "InfraBuild Melbourne"]
    }
  },
  climateAdjustments: {
    brisbane: { insulationMultiplier: 1.0, cycloneRating: true },
    sydney: { insulationMultiplier: 1.2, bushfireRating: true },
    melbourne: { insulationMultiplier: 1.4, thermalMass: true }
  }
};

// Simulated EC3/OpenEPD API responses (in real app, this would use the ApiClient utility)
const simulateAPICall = async (material, source = "EC3") => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockData = {
    "ready_mix_25mpa": { carbonRate: 365, unit: "kg/m3", confidence: 0.95, epd_id: "EC3_CONC_001" },
    "steel_rebar_12mm": { carbonRate: 1.65, unit: "kg/kg", confidence: 0.98, epd_id: "EC3_STEEL_001" },
    "clay_brick_standard": { carbonRate: 0.22, unit: "kg/each", confidence: 0.92, epd_id: "EC3_BRICK_001" },
    "glasswool_batts_r25": { carbonRate: 1.1, unit: "kg/m2", confidence: 0.90, epd_id: "EC3_INSUL_001" },
    "pine_framing_90x45": { carbonRate: 0.35, unit: "kg/kg", confidence: 0.88, epd_id: "EC3_TIMBER_001" }
  };

  // Log the API call
  apiCallLog.push({
    timestamp: new Date().toLocaleTimeString(),
    material,
    source,
    cached: false
  });

  return mockData[material] || { carbonRate: 2.5, unit: "kg/unit", confidence: 0.75, epd_id: "EC3_GENERIC_001" };
};

// Smart caching system (in real app, this would use the CacheSystem utility)
const getCachedOrFetch = async (material, maxAge = 24 * 60 * 60 * 1000) => {
  const cacheKey = material;
  const cached = materialCache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp) < maxAge) {
    // Return cached data
    apiCallLog.push({
      timestamp: new Date().toLocaleTimeString(),
      material,
      source: "CACHE",
      cached: true
    });
    return cached.data;
  }

  // Fetch fresh data
  const freshData = await simulateAPICall(material);
  materialCache.set(cacheKey, {
    data: freshData,
    timestamp: Date.now()
  });
  return freshData;
};

// Australian intelligence overlay (in real app, this would use the AustralianContext utility)
const applyAustralianContext = (baseData, material, location) => {
  const transport = australianIntelligence.transportPenalties[location];
  const suppliers = australianIntelligence.supplierMapping[material]?.[location] || ["Generic Supplier"];
  const climate = australianIntelligence.climateAdjustments[location];

  // Apply transport penalty based on material type
  let transportPenalty = 0;
  if (material.includes('steel')) transportPenalty = transport.steel;
  else if (material.includes('concrete') || material.includes('ready_mix')) transportPenalty = transport.concrete;
  else if (material.includes('timber') || material.includes('pine')) transportPenalty = transport.timber;

  const adjustedCarbon = baseData.carbonRate + transportPenalty;

  return {
    ...baseData,
    adjustedCarbon,
    transportPenalty,
    suppliers,
    climateFactors: climate,
    australianContext: true
  };
};

// Batch processing for multiple materials (in real app, this would be part of the materials-database.js)
const batchProcess = async (materials, location) => {
  const results = [];

  // Process in batches of 3 to simulate API efficiency
  for (let i = 0; i < materials.length; i += 3) {
    const batch = materials.slice(i, i + 3);

    // Parallel processing within batch
    const batchPromises = batch.map(async (material) => {
      const baseData = await getCachedOrFetch(material);
      return applyAustralianContext(baseData, material, location);
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
};

export default function CarbonIntelligenceProof() {
  const [selectedLocation, setSelectedLocation] = useState('brisbane');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });

  const availableMaterials = [
    { id: 'ready_mix_25mpa', name: '25MPa Ready Mix Concrete', category: 'Concrete' },
    { id: 'steel_rebar_12mm', name: '12mm Steel Rebar', category: 'Steel' },
    { id: 'clay_brick_standard', name: 'Standard Clay Brick', category: 'Masonry' },
    { id: 'glasswool_batts_r25', name: 'R2.5 Glasswool Batts', category: 'Insulation' },
    { id: 'pine_framing_90x45', name: '90x45 Pine Framing', category: 'Timber' }
  ];

  const handleMaterialToggle = (materialId) => {
    setSelectedMaterials(prev =>
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const runAnalysis = async () => {
    if (selectedMaterials.length === 0) return;

    setLoading(true);
    apiCallLog = []; // Reset log

    try {
      const analysisResults = await batchProcess(selectedMaterials, selectedLocation);
      setResults(analysisResults);

      // Update cache stats
      const hits = apiCallLog.filter(log => log.cached).length;
      const misses = apiCallLog.filter(log => !log.cached).length;
      setCacheStats({ hits, misses });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    materialCache.clear();
    setCacheStats({ hits: 0, misses: 0 });
    apiCallLog = [];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              CarbonConstruct Intelligence Engine
            </h1>
            <p className="text-gray-600">EC3 + OpenEPD + Australian Intelligence</p>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Cache Hits</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{cacheStats.hits}</div>
            <p className="text-sm text-green-600">API calls saved</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">API Calls</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{cacheStats.misses}</div>
            <p className="text-sm text-orange-600">Fresh data fetched</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Cached Items</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{materialCache.size}</div>
            <p className="text-sm text-blue-600">Materials in cache</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Efficiency</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {cacheStats.hits + cacheStats.misses > 0
                ? Math.round((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100)
                : 0}%
            </div>
            <p className="text-sm text-purple-600">Cache hit rate</p>
          </div>
        </div>

        {/* Location Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-800">Project Location</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['brisbane', 'sydney', 'melbourne'].map(city => (
              <button
                key={city}
                onClick={() => setSelectedLocation(city)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedLocation === city
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold capitalize">{city}</div>
                <div className="text-sm opacity-75">
                  {city === 'brisbane' && 'Climate Zone 2'}
                  {city === 'sydney' && 'Climate Zone 5'}
                  {city === 'melbourne' && 'Climate Zone 6'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Material Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-800">Select Materials</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableMaterials.map(material => (
              <button
                key={material.id}
                onClick={() => handleMaterialToggle(material.id)}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  selectedMaterials.includes(material.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">{material.name}</div>
                <div className="text-sm text-gray-600">{material.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={runAnalysis}
            disabled={loading || selectedMaterials.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Analysis
              </>
            )}
          </button>
          <button
            onClick={clearCache}
            className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <Database className="w-4 h-4" />
            Clear Cache
          </button>
        </div>
      </div>

      {/* Results Display */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {availableMaterials.find(m => m.id === selectedMaterials[index])?.name}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div>Base Carbon: <span className="font-semibold">{result.carbonRate} {result.unit}</span></div>
                      <div>Transport Penalty: <span className="font-semibold text-orange-600">+{result.transportPenalty}</span></div>
                      <div>Adjusted Total: <span className="font-semibold text-blue-600">{result.adjustedCarbon.toFixed(2)} {result.unit}</span></div>
                      <div>Confidence: <span className="font-semibold">{(result.confidence * 100).toFixed(0)}%</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Australian Suppliers</h4>
                    <div className="space-y-1 text-sm">
                      {result.suppliers.map((supplier, idx) => (
                        <div key={idx} className="text-gray-600">• {supplier}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Climate Factors</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {result.climateFactors.cycloneRating && <div>• Cyclone rated required</div>}
                      {result.climateFactors.bushfireRating && <div>• Bushfire considerations</div>}
                      {result.climateFactors.thermalMass && <div>• Thermal mass beneficial</div>}
                      <div>• Insulation factor: {result.climateFactors.insulationMultiplier}x</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Call Log */}
      {apiCallLog.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">API Call Log</h2>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {apiCallLog.map((log, index) => (
              <div key={index} className={`flex items-center justify-between p-2 rounded text-sm ${
                log.cached ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'
              }`}>
                <span>{log.timestamp}</span>
                <span className="font-semibold">{log.material}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  log.cached ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'
                }`}>
                  {log.source}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
