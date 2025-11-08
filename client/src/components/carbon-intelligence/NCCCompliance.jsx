import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Info, Zap } from 'lucide-react';

/**
 * NCCCompliance Component
 * 
 * A comprehensive NCC Section J compliance checker for Australian buildings
 * Includes detailed assessment for:
 * - J1.2 Building Fabric (Thermal Insulation)
 * - J1.3 Glazing (U-Value and SHGC limits)
 * - J1.5 Building Sealing (Air tightness standards)
 * - J1.6 Lighting (Maximum lighting power density)
 * - J5 Embodied Carbon (Whole-of-building limits for commercial)
 * 
 * @author Climate Scientist & NCC Expert
 * @version 2.0.0
 */
export default function NCCCompliance({ 
  buildingData, 
  climateZone, 
  buildingClass, 
  detailedView = false,
  onComplianceResult = () => {},
  enableEmbodiedCarbon = true
}) {
  // State for compliance results
  const [complianceResults, setComplianceResults] = useState({
    overall: false,
    sections: {
      J1_2: { pass: false, details: [], score: 0 },
      J1_3: { pass: false, details: [], score: 0 },
      J1_5: { pass: false, details: [], score: 0 },
      J1_6: { pass: false, details: [], score: 0 },
      J5: { pass: false, details: [], score: 0 },
    }
  });

  // NCC 2022 requirements by climate zone
  const nccRequirements = {
    // Thermal resistance (R-Value) requirements by climate zone
    thermalResistance: {
      roof: {
        1: 3.7, 2: 4.2, 3: 4.2, 4: 4.2, 5: 4.2, 6: 4.2, 7: 4.6, 8: 6.3
      },
      wall: {
        1: 3.3, 2: 3.3, 3: 3.3, 4: 3.3, 5: 3.3, 6: 3.3, 7: 3.3, 8: 3.8
      },
      floor: {
        1: 2.0, 2: 2.0, 3: 2.0, 4: 2.0, 5: 2.0, 6: 2.0, 7: 2.0, 8: 2.5
      }
    },
    // Glazing requirements (U-Value and SHGC)
    glazing: {
      1: { uValue: 5.4, shgc: 0.29 },
      2: { uValue: 5.4, shgc: 0.29 },
      3: { uValue: 4.3, shgc: 0.41 },
      4: { uValue: 4.3, shgc: 0.35 },
      5: { uValue: 4.3, shgc: 0.45 },
      6: { uValue: 3.3, shgc: 0.55 },
      7: { uValue: 3.3, shgc: 0.60 },
      8: { uValue: 2.9, shgc: 0.65 }
    },
    // Building sealing requirements (air changes per hour)
    airTightness: {
      1: 7.0, 2: 7.0, 3: 7.0, 4: 7.0, 5: 7.0, 6: 6.0, 7: 5.0, 8: 5.0
    },
    // Lighting power density maximum (W/m²)
    lighting: {
      office: 4.5,
      retail: 9.0,
      school: 4.0,
      healthcare: 4.0,
      residential: 5.0,
      warehouse: 4.0,
      assembly: 8.0
    },
    // Embodied carbon limits by building type (kg CO₂-e/m²)
    embodiedCarbon: {
      office: 400,
      retail: 450,
      school: 350,
      healthcare: 500,
      residential: 450,
      warehouse: 300,
      assembly: 400
    }
  };

  // Check J1.2 Building Fabric (Thermal Insulation)
  const checkJ1_2 = () => {
    const { roof, walls, floor } = buildingData.thermalPerformance || {};
    let details = [];
    let score = 0;
    const maxScore = 3;
    
    // Roof check
    const roofReq = nccRequirements.thermalResistance.roof[climateZone];
    if (roof?.rValue) {
      const roofPass = roof.rValue >= roofReq;
      score += roofPass ? 1 : 0;
      details.push({
        component: 'Roof',
        required: `R-Value ≥ ${roofReq}`,
        actual: `R-Value = ${roof.rValue.toFixed(1)}`,
        pass: roofPass
      });
    }
    
    // Wall check
    const wallReq = nccRequirements.thermalResistance.wall[climateZone];
    if (walls?.rValue) {
      const wallPass = walls.rValue >= wallReq;
      score += wallPass ? 1 : 0;
      details.push({
        component: 'External Walls',
        required: `R-Value ≥ ${wallReq}`,
        actual: `R-Value = ${walls.rValue.toFixed(1)}`,
        pass: wallPass
      });
    }
    
    // Floor check
    const floorReq = nccRequirements.thermalResistance.floor[climateZone];
    if (floor?.rValue) {
      const floorPass = floor.rValue >= floorReq;
      score += floorPass ? 1 : 0;
      details.push({
        component: 'Floor',
        required: `R-Value ≥ ${floorReq}`,
        actual: `R-Value = ${floor.rValue.toFixed(1)}`,
        pass: floorPass
      });
    }
    
    // Overall pass requires all components to pass
    const pass = (score === maxScore) && (details.length === 3);
    
    return { 
      pass, 
      details, 
      score: Math.round((score / maxScore) * 100) 
    };
  };
  
  // Check J1.3 Glazing
  const checkJ1_3 = () => {
    const { glazing } = buildingData || {};
    let details = [];
    let score = 0;
    const maxScore = 2;
    
    const uValueReq = nccRequirements.glazing[climateZone].uValue;
    const shgcReq = nccRequirements.glazing[climateZone].shgc;
    
    if (glazing?.uValue) {
      const uValuePass = glazing.uValue <= uValueReq;
      score += uValuePass ? 1 : 0;
      details.push({
        component: 'Glazing U-Value',
        required: `U-Value ≤ ${uValueReq}`,
        actual: `U-Value = ${glazing.uValue.toFixed(1)}`,
        pass: uValuePass
      });
    }
    
    if (glazing?.shgc) {
      const shgcPass = glazing.shgc <= shgcReq;
      score += shgcPass ? 1 : 0;
      details.push({
        component: 'Solar Heat Gain Coefficient',
        required: `SHGC ≤ ${shgcReq}`,
        actual: `SHGC = ${glazing.shgc.toFixed(2)}`,
        pass: shgcPass
      });
    }
    
    // Both U-Value and SHGC must pass
    const pass = (score === maxScore) && (details.length === 2);
    
    return { 
      pass, 
      details, 
      score: Math.round((score / maxScore) * 100)
    };
  };
  
  // Check J1.5 Building Sealing
  const checkJ1_5 = () => {
    const { airTightness } = buildingData || {};
    let details = [];
    let score = 0;
    const maxScore = 1;
    
    const airTightnessReq = nccRequirements.airTightness[climateZone];
    
    if (airTightness?.airChangesPerHour) {
      const airTightnessPass = airTightness.airChangesPerHour <= airTightnessReq;
      score += airTightnessPass ? 1 : 0;
      details.push({
        component: 'Air Tightness',
        required: `≤ ${airTightnessReq} ACH @ 50 Pa`,
        actual: `${airTightness.airChangesPerHour.toFixed(1)} ACH @ 50 Pa`,
        pass: airTightnessPass
      });
    }
    
    const pass = (score === maxScore) && (details.length === 1);
    
    return { 
      pass, 
      details, 
      score: Math.round((score / maxScore) * 100)
    };
  };
  
  // Check J1.6 Lighting
  const checkJ1_6 = () => {
    const { lighting, buildingType, area } = buildingData || {};
    let details = [];
    let score = 0;
    const maxScore = 1;
    
    // Default to office if building type not provided
    const type = buildingType || 'office';
    const lightingReq = nccRequirements.lighting[type.toLowerCase()];
    
    if (lighting?.powerDensity && area) {
      const lightingPass = lighting.powerDensity <= lightingReq;
      score += lightingPass ? 1 : 0;
      details.push({
        component: 'Lighting Power Density',
        required: `≤ ${lightingReq} W/m²`,
        actual: `${lighting.powerDensity.toFixed(1)} W/m²`,
        pass: lightingPass
      });
    }
    
    const pass = (score === maxScore) && (details.length === 1);
    
    return { 
      pass, 
      details, 
      score: Math.round((score / maxScore) * 100)
    };
  };
  
  // Check J5 Embodied Carbon
  const checkJ5 = () => {
    // Skip if embodied carbon compliance is not enabled
    if (!enableEmbodiedCarbon) {
      return {
        pass: true,
        details: [{
          component: 'Embodied Carbon',
          required: 'Not Required',
          actual: 'Assessment Disabled',
          pass: true
        }],
        score: 100
      };
    }
    
    const { embodiedCarbon, buildingType } = buildingData || {};
    let details = [];
    let score = 0;
    const maxScore = 1;
    
    // Default to office if building type not provided
    const type = buildingType || 'office';
    const carbonReq = nccRequirements.embodiedCarbon[type.toLowerCase()];
    
    if (embodiedCarbon?.kgCO2PerM2) {
      const carbonPass = embodiedCarbon.kgCO2PerM2 <= carbonReq;
      score += carbonPass ? 1 : 0;
      details.push({
        component: 'Embodied Carbon',
        required: `≤ ${carbonReq} kg CO₂-e/m²`,
        actual: `${embodiedCarbon.kgCO2PerM2.toFixed(1)} kg CO₂-e/m²`,
        pass: carbonPass
      });
    }
    
    const pass = (score === maxScore) && (details.length === 1);
    
    return { 
      pass, 
      details, 
      score: Math.round((score / maxScore) * 100)
    };
  };
  
  // Run all checks and consolidate results
  const runComplianceChecks = () => {
    // Run all compliance checks
    const j1_2Results = checkJ1_2();
    const j1_3Results = checkJ1_3();
    const j1_5Results = checkJ1_5();
    const j1_6Results = checkJ1_6();
    const j5Results = checkJ5();
    
    // Determine overall compliance
    const sectionResults = {
      J1_2: j1_2Results,
      J1_3: j1_3Results,
      J1_5: j1_5Results,
      J1_6: j1_6Results,
      J5: j5Results
    };
    
    // Overall pass requires all sections to pass
    const overallPass = Object.values(sectionResults).every(section => section.pass);
    
    // Set state with results
    const newResults = {
      overall: overallPass,
      sections: sectionResults
    };
    
    setComplianceResults(newResults);
    
    // Call the callback with the results if provided
    onComplianceResult(newResults);
    
    return newResults;
  };
  
  // Run compliance check when component mounts or inputs change
  useEffect(() => {
    if (buildingData && climateZone && buildingClass) {
      runComplianceChecks();
    }
  }, [buildingData, climateZone, buildingClass, enableEmbodiedCarbon]);
  
  // Get the section title
  const getSectionTitle = (section) => {
    switch(section) {
      case 'J1_2': return 'J1.2 Building Fabric';
      case 'J1_3': return 'J1.3 Glazing';
      case 'J1_5': return 'J1.5 Building Sealing';
      case 'J1_6': return 'J1.6 Lighting';
      case 'J5': return 'J5 Embodied Carbon';
      default: return section;
    }
  };
  
  // Get section description
  const getSectionDescription = (section) => {
    switch(section) {
      case 'J1_2': return 'Thermal insulation requirements for roof, walls, and floor';
      case 'J1_3': return 'Glazing U-value and solar heat gain coefficient limits';
      case 'J1_5': return 'Air tightness and building sealing standards';
      case 'J1_6': return 'Maximum lighting power density requirements';
      case 'J5': return 'Whole-of-building embodied carbon limits';
      default: return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Zap className={`w-8 h-8 ${complianceResults.overall ? 'text-green-600' : 'text-red-600'}`} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NCC 2022 Section J Compliance</h1>
          <p className="text-gray-600 dark:text-gray-400">Climate Zone {climateZone} | Building Class {buildingClass}</p>
        </div>
      </div>
      
      {/* Overall Compliance Status */}
      <div className={`mb-6 p-4 rounded-lg border ${complianceResults.overall ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'}`}>
        <div className="flex items-center gap-3">
          {complianceResults.overall ? (
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          )}
          <div>
            <h2 className={`text-lg font-bold ${complianceResults.overall ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {complianceResults.overall ? 'Section J Compliant' : 'Non-Compliant with Section J'}
            </h2>
            <p className={complianceResults.overall ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              {complianceResults.overall 
                ? 'Building design meets all NCC Section J requirements' 
                : 'Building design does not meet one or more NCC Section J requirements'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Section Results */}
      <div className="space-y-4">
        {Object.entries(complianceResults.sections).map(([section, result]) => (
          <div key={section} className={`border rounded-lg ${result.pass ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700'}`}>
            <div className={`flex items-center justify-between p-4 ${result.pass ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-t-lg`}>
              <div className="flex items-center gap-3">
                {result.pass ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{getSectionTitle(section)}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{getSectionDescription(section)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`text-sm font-semibold ${result.pass ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {result.pass ? 'PASS' : 'FAIL'}
                </div>
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-semibold text-sm ${result.pass ? 'border-green-500 text-green-700 dark:text-green-300' : 'border-red-500 text-red-700 dark:text-red-300'}`}>
                  {result.score}%
                </div>
              </div>
            </div>
            
            {/* Detailed Results (shown when detailedView is true) */}
            {detailedView && result.details.length > 0 && (
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 dark:text-gray-400">
                      <th className="py-2 pr-4">Component</th>
                      <th className="py-2 pr-4">Requirement</th>
                      <th className="py-2 pr-4">Actual</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.details.map((detail, idx) => (
                      <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                        <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{detail.component}</td>
                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{detail.required}</td>
                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{detail.actual}</td>
                        <td className="py-3">
                          {detail.pass ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                              Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                              Fail
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* NCC Reference Information */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">NCC Section J Information</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400 mb-2">
              The National Construction Code (NCC) Section J contains the energy efficiency provisions for buildings.
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc pl-4">
              <li>Section J1.2 sets requirements for building fabric thermal insulation (R-values)</li>
              <li>Section J1.3 establishes glazing performance requirements (U-value and SHGC)</li>
              <li>Section J1.5 provides air leakage and building sealing standards</li>
              <li>Section J1.6 specifies maximum lighting power density by building type</li>
              <li>Section J5 establishes whole-of-building embodied carbon limits for commercial buildings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
