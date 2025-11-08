import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import NCCCompliance from './NCCCompliance';

export default function NCCComplianceExample() {
  // Project state
  const [project, setProject] = useState({
    name: 'Green Office Tower',
    location: 'sydney',
    climateZone: 5,
    buildingType: 'commercial',
    gfa: 5000,
    buildingClass: '5',
    stories: 12
  });

  // Building envelope parameters
  const [envelope, setEnvelope] = useState({
    roofRValue: 4.1,
    wallRValue: 3.3,
    floorRValue: 2.0,
    windowUValue: 3.0,
    windowSHGC: 0.25,
    airTightness: 10,
    glazingArea: 1200,
    windowToWallRatio: 0.40
  });

  // Systems parameters
  const [systems, setSystems] = useState({
    lightingPowerDensity: 4.5,
    hvacType: 'vrf',
    hvacEfficiency: 'high',
    hvacCOP: 3.5,
    fanPowerRating: 'efficient',
    hasEconomizer: true,
    hasHeatRecovery: true,
    hasDemandControl: true,
    hasBuildingAutomation: true
  });
  
  // Materials carbon parameters
  const [materials, setMaterials] = useState({
    structuralType: 'concrete',
    concreteType: 'standard',
    steelRecycledContent: 60,
    floorType: 'concrete',
    internalWalls: 'plasterboard',
    insulationType: 'glasswool',
    windowFrames: 'aluminum'
  });
  
  // NCC compliance results
  const [complianceResults, setComplianceResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('envelope');

  // Simulate NCC compliance check
  const checkCompliance = () => {
    setLoading(true);
    
    setTimeout(() => {
      const buildingData = {
        thermalPerformance: {
          roof: { rValue: envelope.roofRValue },
          walls: { rValue: envelope.wallRValue },
          floor: { rValue: envelope.floorRValue }
        },
        glazing: {
          uValue: envelope.windowUValue,
          shgc: envelope.windowSHGC
        },
        airTightness: {
          airChangesPerHour: envelope.airTightness
        },
        lighting: {
          powerDensity: systems.lightingPowerDensity
        },
        buildingType: 'office',
        area: project.gfa,
        embodiedCarbon: {
          kgCO2PerM2: calculateEmbodiedCarbon()
        }
      };
      
      // The NCCCompliance component will call onComplianceResult
      setLoading(false);
    }, 500);
  };
  
  // Simulate thermal performance calculation
  const calculateThermalPerformance = () => {
    const roofU = 1 / envelope.roofRValue;
    const wallU = 1 / envelope.wallRValue;
    const floorU = 1 / envelope.floorRValue;
    
    // Simplified overall U-value calculation
    const roofArea = project.gfa / project.stories;
    const wallArea = (project.gfa / project.stories) * 4 * 3; // Simplified
    const floorArea = roofArea;
    const glazingArea = envelope.glazingArea;
    
    const totalArea = roofArea + wallArea + floorArea + glazingArea;
    
    const overallU = (
      (roofArea * roofU) + 
      (wallArea * wallU) + 
      (floorArea * floorU) + 
      (glazingArea * envelope.windowUValue)
    ) / totalArea;
    
    return {
      overallUValue: overallU.toFixed(2),
      roofU: roofU.toFixed(2),
      wallU: wallU.toFixed(2),
      floorU: floorU.toFixed(2)
    };
  };
  
  // Simulate energy performance calculation  
  const calculateEnergyPerformance = () => {
    // Simplified energy calculation
    const baseLoad = project.gfa * 100; // kWh/year base load
    
    // Envelope performance factor
    const thermal = calculateThermalPerformance();
    const envelopeFactor = parseFloat(thermal.overallUValue) / 2.0;
    
    // Lighting factor
    const lightingLoad = project.gfa * systems.lightingPowerDensity * 2000; // hours
    
    // HVAC efficiency factor
    const hvacFactor = systems.hvacCOP >= 3.5 ? 0.8 : 1.0;
    
    const totalEnergy = (baseLoad * envelopeFactor * hvacFactor) + lightingLoad;
    const energyPerM2 = totalEnergy / project.gfa;
    
    return {
      totalAnnualEnergy: Math.round(totalEnergy),
      energyPerM2: Math.round(energyPerM2),
      lightingEnergy: Math.round(lightingLoad),
      hvacEnergy: Math.round(totalEnergy - lightingLoad),
      rating: energyPerM2 < 100 ? 'Excellent' : energyPerM2 < 150 ? 'Good' : energyPerM2 < 200 ? 'Average' : 'Poor'
    };
  };
  
  // Simulate embodied carbon calculation
  const calculateEmbodiedCarbon = () => {
    let embodiedCarbon = 0;
    
    // Structural system carbon
    if (materials.structuralType === 'concrete') {
      const concreteFactors = {
        'standard': 365,
        'high-strength': 410,
        'geopolymer': 146,
        'recycled-aggregate': 292
      };
      embodiedCarbon += concreteFactors[materials.concreteType] || 365;
    } else if (materials.structuralType === 'steel') {
      embodiedCarbon += 1850 * (1 - materials.steelRecycledContent / 100) + 550 * (materials.steelRecycledContent / 100);
    } else if (materials.structuralType === 'timber') {
      embodiedCarbon -= 350; // Carbon sequestration
    }
    
    // Add other material contributions (simplified)
    embodiedCarbon += 50; // Internal walls
    embodiedCarbon += 20; // Insulation
    embodiedCarbon += 75; // Glazing
    embodiedCarbon += 30; // Finishes
    
    return Math.max(embodiedCarbon, 0);
  };
  
  // Generate recommendations for non-compliant sections
  const generateRecommendations = (compliance) => {
    if (!compliance) return [];
    
    const recommendations = [];
    
    // Check J1.2 - Building Fabric
    if (!compliance.sections.J1_2.pass) {
      recommendations.push({
        section: 'J1.2',
        priority: 'high',
        title: 'Improve Building Fabric Insulation',
        description: 'Increase R-values for roof, walls, or floor to meet NCC requirements for Climate Zone ' + project.climateZone,
        actions: [
          'Upgrade roof insulation to R' + (envelope.roofRValue + 0.5).toFixed(1),
          'Upgrade wall insulation to R' + (envelope.wallRValue + 0.3).toFixed(1),
          'Consider thermal break in floor construction'
        ]
      });
    }
    
    // Check J1.3 - Glazing
    if (!compliance.sections.J1_3.pass) {
      recommendations.push({
        section: 'J1.3',
        priority: 'high',
        title: 'Improve Glazing Performance',
        description: 'Upgrade window U-value and/or SHGC to meet NCC requirements',
        actions: [
          'Specify double or triple glazing to reduce U-value',
          'Use low-e coatings to improve SHGC',
          'Consider thermally broken window frames'
        ]
      });
    }
    
    // Check J1.5 - Building Sealing
    if (!compliance.sections.J1_5.pass) {
      recommendations.push({
        section: 'J1.5',
        priority: 'medium',
        title: 'Improve Air Tightness',
        description: 'Reduce air leakage to meet NCC building sealing requirements',
        actions: [
          'Specify continuous air barrier system',
          'Detail window and door sealing',
          'Conduct blower door test during construction'
        ]
      });
    }
    
    // Check J1.6 - Lighting
    if (!compliance.sections.J1_6.pass) {
      recommendations.push({
        section: 'J1.6',
        priority: 'medium',
        title: 'Reduce Lighting Power Density',
        description: 'Reduce lighting power density to meet NCC maximum requirements',
        actions: [
          'Specify LED lighting throughout',
          'Implement daylight harvesting controls',
          'Use occupancy sensors in appropriate spaces'
        ]
      });
    }
    
    // Check J5 - Embodied Carbon
    if (!compliance.sections.J5.pass) {
      recommendations.push({
        section: 'J5',
        priority: 'high',
        title: 'Reduce Embodied Carbon',
        description: 'Reduce whole-of-building embodied carbon to meet NCC J5 limits',
        actions: [
          'Consider geopolymer concrete or recycled aggregate',
          'Maximize recycled steel content',
          'Consider mass timber or hybrid structure',
          'Specify low-carbon materials for finishes'
        ]
      });
    }
    
    return recommendations;
  };

  // Material type options
  const concreteTypes = [
    { value: 'standard', label: 'Standard 32 MPa Concrete' },
    { value: 'high-strength', label: '40 MPa High-Strength Concrete' },
    { value: 'geopolymer', label: 'Geopolymer Concrete (GPC)' },
    { value: 'recycled-aggregate', label: 'Concrete with 30% Recycled Aggregate' }
  ];
  
  const structuralTypes = [
    { value: 'concrete', label: 'Reinforced Concrete' },
    { value: 'steel', label: 'Structural Steel' },
    { value: 'timber', label: 'Mass Timber / CLT' },
    { value: 'hybrid', label: 'Hybrid Structure' }
  ];
  
  const floorTypes = [
    { value: 'concrete', label: 'Concrete Slab' },
    { value: 'timber', label: 'Timber Framed' },
    { value: 'composite', label: 'Composite Steel-Concrete' }
  ];

  const climateZones = [
    { value: 1, label: 'Zone 1 - High Humidity Summer, Warm Winter' },
    { value: 2, label: 'Zone 2 - Warm Humid Summer, Mild Winter' },
    { value: 3, label: 'Zone 3 - Hot Dry Summer, Warm Winter' },
    { value: 4, label: 'Zone 4 - Hot Dry Summer, Cool Winter' },
    { value: 5, label: 'Zone 5 - Warm Temperate' },
    { value: 6, label: 'Zone 6 - Mild Temperate' },
    { value: 7, label: 'Zone 7 - Cool Temperate' },
    { value: 8, label: 'Zone 8 - Alpine' }
  ];

  const buildingData = complianceResults ? {
    thermalPerformance: {
      roof: { rValue: envelope.roofRValue },
      walls: { rValue: envelope.wallRValue },
      floor: { rValue: envelope.floorRValue }
    },
    glazing: {
      uValue: envelope.windowUValue,
      shgc: envelope.windowSHGC
    },
    airTightness: {
      airChangesPerHour: envelope.airTightness
    },
    lighting: {
      powerDensity: systems.lightingPowerDensity
    },
    buildingType: 'office',
    area: project.gfa,
    embodiedCarbon: {
      kgCO2PerM2: calculateEmbodiedCarbon()
    }
  } : null;

  const recommendations = complianceResults ? generateRecommendations(complianceResults) : [];
  const energyPerformance = calculateEnergyPerformance();
  const thermalPerformance = calculateThermalPerformance();

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NCC Section J Compliance Tool</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Interactive assessment tool for Australian building energy efficiency compliance
          </p>
        </div>
        <Button 
          onClick={checkCompliance}
          disabled={loading}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Checking...' : 'Check Compliance'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Basic building details and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input 
                    value={project.name}
                    onChange={(e) => setProject({...project, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Building Class</Label>
                  <Select value={project.buildingClass} onValueChange={(value) => setProject({...project, buildingClass: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Class 2 - Apartment</SelectItem>
                      <SelectItem value="3">Class 3 - Residential</SelectItem>
                      <SelectItem value="5">Class 5 - Office</SelectItem>
                      <SelectItem value="6">Class 6 - Retail</SelectItem>
                      <SelectItem value="7">Class 7 - Warehouse</SelectItem>
                      <SelectItem value="8">Class 8 - Factory</SelectItem>
                      <SelectItem value="9">Class 9 - Healthcare/Assembly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Climate Zone</Label>
                  <Select value={project.climateZone.toString()} onValueChange={(value) => setProject({...project, climateZone: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {climateZones.map(zone => (
                        <SelectItem key={zone.value} value={zone.value.toString()}>
                          {zone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gross Floor Area (m²)</Label>
                  <Input 
                    type="number"
                    value={project.gfa}
                    onChange={(e) => setProject({...project, gfa: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Building Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="envelope">Envelope</TabsTrigger>
                  <TabsTrigger value="systems">Systems</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                </TabsList>
                
                <TabsContent value="envelope" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Roof R-Value</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={envelope.roofRValue}
                        onChange={(e) => setEnvelope({...envelope, roofRValue: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Wall R-Value</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={envelope.wallRValue}
                        onChange={(e) => setEnvelope({...envelope, wallRValue: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Floor R-Value</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={envelope.floorRValue}
                        onChange={(e) => setEnvelope({...envelope, floorRValue: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Window U-Value (W/m²K)</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={envelope.windowUValue}
                        onChange={(e) => setEnvelope({...envelope, windowUValue: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Window SHGC</Label>
                      <Input 
                        type="number"
                        step="0.01"
                        value={envelope.windowSHGC}
                        onChange={(e) => setEnvelope({...envelope, windowSHGC: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Air Tightness (ACH @ 50 Pa)</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={envelope.airTightness}
                        onChange={(e) => setEnvelope({...envelope, airTightness: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="systems" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Lighting Power Density (W/m²)</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={systems.lightingPowerDensity}
                        onChange={(e) => setSystems({...systems, lightingPowerDensity: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>HVAC COP</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={systems.hvacCOP}
                        onChange={(e) => setSystems({...systems, hvacCOP: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>HVAC Type</Label>
                      <Select value={systems.hvacType} onValueChange={(value) => setSystems({...systems, hvacType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vrf">VRF System</SelectItem>
                          <SelectItem value="chiller">Chiller Plant</SelectItem>
                          <SelectItem value="split">Split Systems</SelectItem>
                          <SelectItem value="ducted">Ducted Systems</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Efficiency Rating</Label>
                      <Select value={systems.hvacEfficiency} onValueChange={(value) => setSystems({...systems, hvacEfficiency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Efficiency</SelectItem>
                          <SelectItem value="medium">Medium Efficiency</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="materials" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Structural Type</Label>
                      <Select value={materials.structuralType} onValueChange={(value) => setMaterials({...materials, structuralType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {structuralTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Concrete Type</Label>
                      <Select value={materials.concreteType} onValueChange={(value) => setMaterials({...materials, concreteType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {concreteTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Steel Recycled Content (%)</Label>
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        value={materials.steelRecycledContent}
                        onChange={(e) => setMaterials({...materials, steelRecycledContent: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Floor Type</Label>
                      <Select value={materials.floorType} onValueChange={(value) => setMaterials({...materials, floorType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {floorTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall U-Value</span>
                  <span className="font-semibold">{thermalPerformance.overallUValue} W/m²K</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Energy Use</span>
                  <span className="font-semibold">{energyPerformance.energyPerM2} kWh/m²/yr</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Embodied Carbon</span>
                  <span className="font-semibold">{calculateEmbodiedCarbon().toFixed(0)} kg CO₂-e/m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Energy Rating</span>
                  <Badge variant={energyPerformance.rating === 'Excellent' ? 'default' : energyPerformance.rating === 'Good' ? 'secondary' : 'destructive'}>
                    {energyPerformance.rating}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {complianceResults && (
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(complianceResults.sections).map(([section, result]) => (
                    <div key={section} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{section.replace('_', '.')}</span>
                      {result.pass ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Compliance Results */}
      {buildingData && (
        <NCCCompliance
          buildingData={buildingData}
          climateZone={project.climateZone}
          buildingClass={project.buildingClass}
          detailedView={true}
          onComplianceResult={setComplianceResults}
          enableEmbodiedCarbon={true}
        />
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations for Compliance</CardTitle>
            <CardDescription>Suggested improvements to meet NCC Section J requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${rec.priority === 'high' ? 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${rec.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                        {rec.section}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.description}</p>
                    <ul className="text-sm space-y-1 list-disc pl-4">
                      {rec.actions.map((action, i) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300">{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">About This Tool</h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                This interactive tool helps assess compliance with the National Construction Code (NCC) 2022 Section J energy efficiency provisions. 
                Adjust the building parameters above and click "Check Compliance" to see if your design meets the requirements for Climate Zone {project.climateZone}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
