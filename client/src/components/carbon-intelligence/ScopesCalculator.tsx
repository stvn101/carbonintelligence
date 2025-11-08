// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  Factory,
  Zap,
  TruckIcon,
  Trash2,
  AlertTriangle,
  Users,
  BarChart4,
  PieChart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// Import chart components
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { StackedBarChart } from '@/components/charts/StackedBarChart';

// Import emission factors data
import { emissionFactors } from '@/data/emissionFactors';
import { australianGridFactors } from '@/data/australianGridFactors';

// Import API utilities
import { calculateScope1, calculateScope2, calculateScope3 } from '@/utils/scopesCalculatorAPI';

const ScopesCalculator = () => {
  // State for emission input data
  const [scopesInput, setScopesInput] = useState({
    scope1: {
      fuels: [
        { type: 'diesel', quantity: 5000, description: 'Site equipment' }
      ],
      vehicles: [
        { type: 'Ute', fuelType: 'diesel', fuelUsed: 2000 }
      ]
    },
    scope2: {
      electricity: { kwh: 1100000 } // Annual consumption
    },
    scope3: {
      materials: [
        { category: 'concrete', type: 'concrete-32mpa', quantity: 500 }
      ],
      transport: [
        { type: 'heavyVehicle', distance: 50000, weight: 1000, description: 'Material delivery' }
      ],
      waste: [
        { type: 'Construction waste', quantity: 50000, disposalMethod: 'recycling' }
      ],
      employeeCommuting: {
        employees: 50,
        totalKm: 250000 // Annual total
      }
    }
  });

  // State for calculation results
  const [results, setResults] = useState(null);

  // State for selected region/state
  const [selectedState, setSelectedState] = useState('nsw');

  // State for calculation loading status
  const [loading, setLoading] = useState(false);

  // State for active tab
  const [activeTab, setActiveTab] = useState('scope1');

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    scope1Fuels: true,
    scope1Vehicles: true,
    scope2Electricity: true,
    scope3Materials: true,
    scope3Transport: true,
    scope3Waste: true,
    scope3Commuting: true
  });

  // Toggle expansion of sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handler for input changes
  const handleInputChange = (scope, category, index, field, value) => {
    setScopesInput(prev => {
      const newInput = { ...prev };

      if (category === 'electricity') {
        // Handle electricity input which is a single object
        newInput[scope][category][field] = value;
      } else if (category === 'employeeCommuting') {
        // Handle employee commuting which is a nested object
        newInput[scope][category][field] = value;
      } else {
        // Handle arrays of objects (fuels, vehicles, materials, transport, waste)
        newInput[scope][category][index][field] = value;
      }

      return newInput;
    });
  };

  // Add new item to a category
  const addItem = (scope, category) => {
    setScopesInput(prev => {
      const newInput = { ...prev };

      // Templates for new items based on category
      const newItemTemplates = {
        fuels: { type: 'diesel', quantity: 0, description: '' },
        vehicles: { type: 'Ute', fuelType: 'diesel', fuelUsed: 0 },
        materials: { category: 'concrete', type: 'concrete-32mpa', quantity: 0 },
        transport: { type: 'heavyVehicle', distance: 0, weight: 0, description: '' },
        waste: { type: 'Construction waste', quantity: 0, disposalMethod: 'recycling' }
      };

      newInput[scope][category].push(newItemTemplates[category]);
      return newInput;
    });
  };

  // Remove item from a category
  const removeItem = (scope, category, index) => {
    setScopesInput(prev => {
      const newInput = { ...prev };
      newInput[scope][category].splice(index, 1);
      return newInput;
    });
  };

  // Calculate emissions
  const calculateEmissions = async () => {
    setLoading(true);

    try {
      // Calculate each scope
      const scope1Results = await calculateScope1(scopesInput.scope1, selectedState);
      const scope2Results = await calculateScope2(scopesInput.scope2, selectedState);
      const scope3Results = await calculateScope3(scopesInput.scope3, selectedState);

      // Combine results
      const totalScope1 = Object.values(scope1Results.categories).reduce((sum, val) => sum + val, 0);
      const totalScope2 = Object.values(scope2Results.categories).reduce((sum, val) => sum + val, 0);
      const totalScope3 = Object.values(scope3Results.categories).reduce((sum, val) => sum + val, 0);

      const totalEmissions = totalScope1 + totalScope2 + totalScope3;

      // Calculate percentages
      const percentages = {
        scope1: (totalScope1 / totalEmissions) * 100,
        scope2: (totalScope2 / totalEmissions) * 100,
        scope3: (totalScope3 / totalEmissions) * 100
      };

      // Determine largest contributor
      const scopesArray = [
        { name: 'Scope 1', value: totalScope1 },
        { name: 'Scope 2', value: totalScope2 },
        { name: 'Scope 3', value: totalScope3 }
      ];

      const largestScope = scopesArray.reduce((prev, current) =>
        (prev.value > current.value) ? prev : current
      ).name;

      // Calculate materials impact
      const materialsEmissions = scope3Results.categories.materials || 0;
      const materialsPercentage = (materialsEmissions / totalEmissions) * 100;

      // Combine results
      setResults({
        scope1: {
          total: totalScope1,
          categories: scope1Results.categories
        },
        scope2: {
          total: totalScope2,
          categories: scope2Results.categories
        },
        scope3: {
          total: totalScope3,
          categories: scope3Results.categories
        },
        total: totalEmissions,
        percentages,
        summary: {
          largestScope,
          materialsPercentage
        }
      });

    } catch (error) {
      console.error("Error calculating emissions:", error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  // Generate report data for download
  const generateReport = () => {
    if (!results) return;

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += "Category,Emissions (kg CO₂-e),Percentage\n";

    // Add Scope 1 details
    csvContent += "SCOPE 1 (DIRECT),";
    csvContent += `${results.scope1.total.toLocaleString()},`;
    csvContent += `${results.percentages.scope1.toFixed(1)}%\n`;

    Object.entries(results.scope1.categories).forEach(([category, value]) => {
      csvContent += `  ${category},${value.toLocaleString()},${(value/results.scope1.total*100).toFixed(1)}%\n`;
    });

    // Add Scope 2 details
    csvContent += "SCOPE 2 (ENERGY),";
    csvContent += `${results.scope2.total.toLocaleString()},`;
    csvContent += `${results.percentages.scope2.toFixed(1)}%\n`;

    Object.entries(results.scope2.categories).forEach(([category, value]) => {
      csvContent += `  ${category},${value.toLocaleString()},${(value/results.scope2.total*100).toFixed(1)}%\n`;
    });

    // Add Scope 3 details
    csvContent += "SCOPE 3 (VALUE CHAIN),";
    csvContent += `${results.scope3.total.toLocaleString()},`;
    csvContent += `${results.percentages.scope3.toFixed(1)}%\n`;

    Object.entries(results.scope3.categories).forEach(([category, value]) => {
      csvContent += `  ${category},${value.toLocaleString()},${(value/results.scope3.total*100).toFixed(1)}%\n`;
    });

    // Add summary
    csvContent += `\nTOTAL EMISSIONS,${results.total.toLocaleString()},100%\n`;
    csvContent += `Largest Contributor,${results.summary.largestScope},\n`;
    csvContent += `Materials Impact,${results.summary.materialsPercentage.toFixed(1)}%,\n`;

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "GHG_Protocol_Scopes_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare chart data for visualization
  const prepareChartData = () => {
    if (!results) return { pieData: [], barData: [] };

    // Prepare pie chart data
    const pieData = [
      { name: 'Scope 1', value: results.scope1.total, fill: '#2563eb' },
      { name: 'Scope 2', value: results.scope2.total, fill: '#16a34a' },
      { name: 'Scope 3', value: results.scope3.total, fill: '#dc2626' }
    ];

    // Prepare stacked bar chart data
    const scope1Categories = Object.entries(results.scope1.categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      scope: 'Scope 1'
    }));

    const scope2Categories = Object.entries(results.scope2.categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      scope: 'Scope 2'
    }));

    const scope3Categories = Object.entries(results.scope3.categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      scope: 'Scope 3'
    }));

    const barData = [...scope1Categories, ...scope2Categories, ...scope3Categories];

    return { pieData, barData };
  };

  // Get chart data
  const { pieData, barData } = results ? prepareChartData() : { pieData: [], barData: [] };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">GHG Protocol Scopes Calculator</h1>
            <p className="text-gray-500 mt-1">
              Comprehensive emissions calculation for Scope 1, 2, and 3
            </p>
          </div>

          {/* State/Region Selection */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="state-select">State/Region:</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nsw">NSW</SelectItem>
                <SelectItem value="vic">Victoria</SelectItem>
                <SelectItem value="qld">Queensland</SelectItem>
                <SelectItem value="sa">South Australia</SelectItem>
                <SelectItem value="wa">Western Australia</SelectItem>
                <SelectItem value="tas">Tasmania</SelectItem>
                <SelectItem value="nt">Northern Territory</SelectItem>
                <SelectItem value="act">ACT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Input Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="scope1" className="flex items-center">
              <Factory className="w-4 h-4 mr-2" />
              Scope 1 (Direct)
            </TabsTrigger>
            <TabsTrigger value="scope2" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Scope 2 (Energy)
            </TabsTrigger>
            <TabsTrigger value="scope3" className="flex items-center">
              <TruckIcon className="w-4 h-4 mr-2" />
              Scope 3 (Value Chain)
            </TabsTrigger>
          </TabsList>

          {/* Scope 1 Content */}
          <TabsContent value="scope1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Factory className="w-5 h-5 mr-2 text-blue-600" />
                  Scope 1: Direct Emissions
                </CardTitle>
                <CardDescription>
                  Direct GHG emissions from owned or controlled sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fuels Section */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('scope1Fuels')}
                  >
                    <h3 className="text-lg font-semibold">Fuels</h3>
                    {expandedSections.scope1Fuels ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {expandedSections.scope1Fuels && (
                    <div className="mt-2 space-y-4">
                      {scopesInput.scope1.fuels.map((fuel, index) => (
                        <div key={`fuel-${index}`} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
                          <div className="col-span-3">
                            <Label htmlFor={`fuel-type-${index}`}>Fuel Type</Label>
                            <Select
                              value={fuel.type}
                              onValueChange={(value) => handleInputChange('scope1', 'fuels', index, 'type', value)}
                            >
                              <SelectTrigger id={`fuel-type-${index}`}>
                                <SelectValue placeholder="Select fuel type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="petrol">Petrol</SelectItem>
                                <SelectItem value="naturalGas">Natural Gas</SelectItem>
                                <SelectItem value="lpg">LPG</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-3">
                            <Label htmlFor={`fuel-quantity-${index}`}>Quantity (L)</Label>
                            <Input
                              id={`fuel-quantity-${index}`}
                              type="number"
                              value={fuel.quantity}
                              onChange={(e) => handleInputChange('scope1', 'fuels', index, 'quantity', parseInt(e.target.value))}
                            />
                          </div>

                          <div className="col-span-5">
                            <Label htmlFor={`fuel-description-${index}`}>Description</Label>
                            <Input
                              id={`fuel-description-${index}`}
                              value={fuel.description}
                              onChange={(e) => handleInputChange('scope1', 'fuels', index, 'description', e.target.value)}
                            />
                          </div>

                          <div className="col-span-1 flex justify-end">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeItem('scope1', 'fuels', index)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => addItem('scope1', 'fuels')}
                      >
                        Add Fuel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Vehicles Section */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('scope1Vehicles')}
                  >
                    <h3 className="text-lg font-semibold">Vehicles</h3>
                    {expandedSections.scope1Vehicles ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {expandedSections.scope1Vehicles && (
                    <div className="mt-2 space-y-4">
                      {scopesInput.scope1.vehicles.map((vehicle, index) => (
                        <div key={`vehicle-${index}`} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
                          <div className="col-span-4">
                            <Label htmlFor={`vehicle-type-${index}`}>Vehicle Type</Label>
                            <Select
                              value={vehicle.type}
                              onValueChange={(value) => handleInputChange('scope1', 'vehicles', index, 'type', value)}
                            >
                              <SelectTrigger id={`vehicle-type-${index}`}>
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Ute">Ute</SelectItem>
                                <SelectItem value="Van">Van</SelectItem>
                                <SelectItem value="Light truck">Light truck</SelectItem>
                                <SelectItem value="Heavy truck">Heavy truck</SelectItem>
                                <SelectItem value="Excavator">Excavator</SelectItem>
                                <SelectItem value="Crane">Crane</SelectItem>
                                <SelectItem value="Forklift">Forklift</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-3">
                            <Label htmlFor={`vehicle-fuel-type-${index}`}>Fuel Type</Label>
                            <Select
                              value={vehicle.fuelType}
                              onValueChange={(value) => handleInputChange('scope1', 'vehicles', index, 'fuelType', value)}
                            >
                              <SelectTrigger id={`vehicle-fuel-type-${index}`}>
                                <SelectValue placeholder="Select fuel type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="petrol">Petrol</SelectItem>
                                <SelectItem value="lpg">LPG</SelectItem>
                                <SelectItem value="electric">Electric</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-4">
                            <Label htmlFor={`vehicle-fuel-used-${index}`}>Fuel Used (L)</Label>
                            <Input
                              id={`vehicle-fuel-used-${index}`}
                              type="number"
                              value={vehicle.fuelUsed}
                              onChange={(e) => handleInputChange('scope1', 'vehicles', index, 'fuelUsed', parseInt(e.target.value))}
                            />
                          </div>

                          <div className="col-span-1 flex justify-end">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeItem('scope1', 'vehicles', index)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => addItem('scope1', 'vehicles')}
                      >
                        Add Vehicle
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scope 2 Content */}
          <TabsContent value="scope2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-green-600" />
                  Scope 2: Energy Indirect Emissions
                </CardTitle>
                <CardDescription>
                  Indirect GHG emissions from purchased electricity, steam, heating, and cooling
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Electricity Section */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('scope2Electricity')}
                  >
                    <h3 className="text-lg font-semibold">Electricity Consumption</h3>
                    {expandedSections.scope2Electricity ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {expandedSections.scope2Electricity && (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="electricity-kwh">Annual Electricity (kWh)</Label>
                        <Input
                          id="electricity-kwh"
                          type="number"
                          value={scopesInput.scope2.electricity.kwh}
                          onChange={(e) => handleInputChange('scope2', 'electricity', null, 'kwh', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="bg-gray-50 p-3 rounded-md w-full">
                          <p className="text-sm text-gray-500">Grid Emission Factor ({selectedState.toUpperCase()})</p>
                          <p className="font-semibold">
                            {australianGridFactors[selectedState]} kg CO₂-e/kWh
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scope 3 Content */}
          <TabsContent value="scope3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TruckIcon className="w-5 h-5 mr-2 text-red-600" />
                  Scope 3: Value Chain Emissions
                </CardTitle>
                <CardDescription>
                  All indirect emissions (not included in Scope 2) that occur in the value chain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Materials Section */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('scope3Materials')}
                  >
                    <h3 className="text-lg font-semibold">Materials</h3>
                    {expandedSections.scope3Materials ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {expandedSections.scope3Materials && (
                    <div className="mt-2 space-y-4">
                      {scopesInput.scope3.materials.map((material, index) => (
                        <div key={`material-${index}`} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
                          <div className="col-span-3">
                            <Label htmlFor={`material-category-${index}`}>Category</Label>
                            <Select
                              value={material.category}
                              onValueChange={(value) => handleInputChange('scope3', 'materials', index, 'category', value)}
                            >
                              <SelectTrigger id={`material-category-${index}`}>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="concrete">Concrete</SelectItem>
                                <SelectItem value="steel">Steel</SelectItem>
                                <SelectItem value="timber">Timber</SelectItem>
                                <SelectItem value="masonry">Masonry</SelectItem>
                                <SelectItem value="insulation">Insulation</SelectItem>
                                <SelectItem value="glazing">Glazing</SelectItem>
                                <SelectItem value="finishes">Finishes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-4">
                            <Label htmlFor={`material-type-${index}`}>Material Type</Label>
                            <Select
                              value={material.type}
                              onValueChange={(value) => handleInputChange('scope3', 'materials', index, 'type', value)}
                            >
                              <SelectTrigger id={`material-type-${index}`}>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {material.category === 'concrete' && (
                                  <>
                                    <SelectItem value="concrete-32mpa">32MPa Concrete</SelectItem>
                                    <SelectItem value="concrete-40mpa">40MPa Concrete</SelectItem>
                                    <SelectItem value="concrete-gpc-32mpa">32MPa Geopolymer Concrete</SelectItem>
                                    <SelectItem value="concrete-recycled-aggregate">Recycled Aggregate Concrete</SelectItem>
                                  </>
                                )}
                                {material.category === 'steel' && (
                                  <>
                                    <SelectItem value="steel-reinforcing-bar">Reinforcing Bar</SelectItem>
                                    <SelectItem value="steel-structural-sections">Structural Sections</SelectItem>
                                    <SelectItem value="steel-recycled">Recycled Steel</SelectItem>
                                  </>
                                )}
                                {material.category === 'timber' && (
                                  <>
                                    <SelectItem value="timber-clt">Cross Laminated Timber</SelectItem>
                                    <SelectItem value="timber-softwood">Softwood Framing</SelectItem>
                                    <SelectItem value="timber-hardwood">Hardwood</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-4">
                            <Label htmlFor={`material-quantity-${index}`}>Quantity</Label>
                            <Input
                              id={`material-quantity-${index}`}
                              type="number"
                              value={material.quantity}
                              onChange={(e) => handleInputChange('scope3', 'materials', index, 'quantity', parseInt(e.target.value))}
                            />
                          </div>

                          <div className="col-span-1 flex justify-end">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeItem('scope3', 'materials', index)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => addItem('scope3', 'materials')}
                      >
                        Add Material
                      </Button>
                    </div>
                  )}
                </div>

                {/* Transport Section */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('scope3Transport')}
                  >
                    <h3 className="text-lg font-semibold">Transport</h3>
                    {expandedSections.scope3Transport ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {expandedSections.scope3Transport && (
                    <div className="mt-2 space-y-4">
                      {scopesInput.scope3.transport.map((transport, index) => (
                        <div key={`transport-${index}`} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
                          <div className="col-span-3">
                            <Label htmlFor={`transport-type-${index}`}>Vehicle Type</Label>
                            <Select
                              value={transport.type}
                              onValueChange={(value) => handleInputChange('scope3', 'transport', index, 'type', value)}
                            >
                              <SelectTrigger id={`transport-type-${index}`}>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lightVehicle">Light Vehicle</SelectItem>
                                <SelectItem value="mediumVehicle">Medium Vehicle</SelectItem>
                                <SelectItem value="heavyVehicle">Heavy Vehicle</SelectItem>
                                <SelectItem value="freight">Freight</SelectItem>
                                <SelectItem value="sea">Sea</SelectItem>
                                <SelectItem value="air">Air</SelectItem>
                                <SelectItem value="rail">Rail</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-2">
                            <Label htmlFor={`transport-distance-${index}`}>Distance (km)</Label>
                            <Input
                              id={`transport-distance-${index}`}
                              type="number"
                              value={transport.distance}
                              onChange={(e) => handleInputChange('scope3', 'transport', index, 'distance', parseInt(e.target.value))}
                            />
                          </div>

                          <div className="col-span-2">
                            <Label htmlFor={`transport-weight-${index}`}>Weight (kg)</Label>
                            <Input
                              id={`transport-weight-${index}`}
                              type="number"
                              value={transport.weight}
                              onChange={(e) => handleInputChange('scope3', 'transport', index, 'weight', parseInt(e.target.value))}
                            />
                          </div>

                          <div className="col-span-4">
                            <Label htmlFor={`transport-description-${index}`}>Description</Label>
                            <Input
                              id={`transport-description-${index}`}
                              value={transport.description}
                              onChange={(e) => handleInputChange('scope3', 'transport', index, 'description', e.target.value)}
                            />
                          </div>

                          <div className="col-span-1 flex justify-end">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeItem('scope3', 'transport', index)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => addItem('scope3', 'transport')}
                      >
                        Add Transport
                      </Button>
                    </div>
                  )}
                </div>

                {/* Waste Section */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('scope3Waste')}
                  >
                    <h3 className="text-lg font-semibold">Waste</h3>
                    {expandedSections.scope3Waste ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {expandedSections.scope3Waste && (
                    <div className="mt-2 space-y-4">
                      {scopesInput.scope3.waste.map((waste, index) => (
                        <div key={`waste-${index}`} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
                          <div className="col-span-5">
                            <Label htmlFor={`waste-type-${index}`}>Waste Type</Label>
                            <Input
                              id={`waste-type-${index}`}
                              value={waste.type}
                              onChange={(e) => handleInputChange('scope3', 'waste', index, 'type', e.target.value)}
                            />
                          </div>

                          <div className="col-span-3">
                            <Label htmlFor={`waste-quantity-${index}`}>Quantity (kg)</Label>
                            <Input
                              id={`waste-quantity-${index}`}
                              type="number"
                              value={waste.quantity}
                              onChange={(e) => handleInputChange('scope3', 'waste', index, 'quantity', parseInt(e.target.value))}
                            />
                          </div>

                          <div className="col-span-3">
                            <Label htmlFor={`waste-disposal-${index}`}>Disposal Method</Label>
                            <Select
                              value={waste.disposalMethod}
                              onValueChange={(value) => handleInputChange('scope3', 'waste', index, 'disposalMethod', value)}
                            >
                              <SelectTrigger id={`waste-disposal-${index}`}>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="recycling">Recycling</SelectItem>
                                <SelectItem value="landfill">Landfill</SelectItem>
                                <SelectItem value="incineration">Incineration</SelectItem>
                                <SelectItem value="composting">Composting</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-1 flex justify-end">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeItem('scope3', 'waste', index)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => addItem('scope3', 'waste')}
                      >
                        Add Waste
                      </Button>
                    </div>
                  )}
                </div>

                {/* Employee Commuting Section */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('scope3Commuting')}
                  >
                    <h3 className="text-lg font-semibold">Employee Commuting</h3>
                    {expandedSections.scope3Commuting ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {expandedSections.scope3Commuting && (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-2 bg-gray-50 rounded-md">
                      <div>
                        <Label htmlFor="employees-count">Number of Employees</Label>
                        <Input
                          id="employees-count"
                          type="number"
                          value={scopesInput.scope3.employeeCommuting.employees}
                          onChange={(e) => handleInputChange('scope3', 'employeeCommuting', null, 'employees', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="total-km">Total Annual Distance (km)</Label>
                        <Input
                          id="total-km"
                          type="number"
                          value={scopesInput.scope3.employeeCommuting.totalKm}
                          onChange={(e) => handleInputChange('scope3', 'employeeCommuting', null, 'totalKm', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button
            onClick={calculateEmissions}
            disabled={loading}
            className="w-full max-w-md py-6 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Calculating Emissions...
              </>
            ) : (
              <>
                Calculate GHG Protocol Emissions
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Results</h2>
              <Button
                variant="outline"
                onClick={generateReport}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>GHG Protocol Scopes Summary</CardTitle>
                <CardDescription>
                  Breakdown of emissions across Scope 1, 2, and 3
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Charts */}
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold">Emissions Distribution</h3>
                    <div className="h-72">
                      {pieData.length > 0 && <PieChartComponent data={pieData} />}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Emissions Summary</h3>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Total Emissions</p>
                        <p className="text-3xl font-bold">{results.total.toLocaleString()} <span className="text-lg">kg CO₂-e</span></p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">Scope 1</p>
                          <p className="text-xl font-bold text-blue-700">{results.scope1.total.toLocaleString()}</p>
                          <p className="text-sm text-blue-700">{results.percentages.scope1.toFixed(1)}%</p>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">Scope 2</p>
                          <p className="text-xl font-bold text-green-700">{results.scope2.total.toLocaleString()}</p>
                          <p className="text-sm text-green-700">{results.percentages.scope2.toFixed(1)}%</p>
                        </div>

                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">Scope 3</p>
                          <p className="text-xl font-bold text-red-700">{results.scope3.total.toLocaleString()}</p>
                          <p className="text-sm text-red-700">{results.percentages.scope3.toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                        <p className="font-semibold">Key Insights:</p>
                        <div className="text-sm">
                          <p>• Largest Contributor: <span className="font-semibold">{results.summary.largestScope}</span></p>
                          <p>• Materials Impact: <span className="font-semibold">{results.summary.materialsPercentage.toFixed(1)}% of total</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
                <CardDescription>
                  Category-level emissions breakdown for all scopes
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <div className="space-y-6">
                  {/* Category Charts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Emissions by Category</h3>
                    <div className="h-96">
                      {barData.length > 0 && <StackedBarChart data={barData} />}
                    </div>
                  </div>

                  {/* Tables */}
                  <div className="space-y-6">
                    {/* Scope 1 Table */}
                    <div>
                      <h3 className="flex items-center text-lg font-semibold mb-2">
                        <Factory className="w-5 h-5 mr-2 text-blue-600" />
                        Scope 1 Breakdown
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Emissions (kg CO₂-e)</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(results.scope1.categories).map(([category, value]) => (
                            <TableRow key={`scope1-${category}`}>
                              <TableCell className="capitalize">{category}</TableCell>
                              <TableCell className="text-right">{value.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{(value/results.scope1.total*100).toFixed(1)}%</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-semibold">
                            <TableCell>Total Scope 1</TableCell>
                            <TableCell className="text-right">{results.scope1.total.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{results.percentages.scope1.toFixed(1)}%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Scope 2 Table */}
                    <div>
                      <h3 className="flex items-center text-lg font-semibold mb-2">
                        <Zap className="w-5 h-5 mr-2 text-green-600" />
                        Scope 2 Breakdown
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Emissions (kg CO₂-e)</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(results.scope2.categories).map(([category, value]) => (
                            <TableRow key={`scope2-${category}`}>
                              <TableCell className="capitalize">{category}</TableCell>
                              <TableCell className="text-right">{value.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{(value/results.scope2.total*100).toFixed(1)}%</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-semibold">
                            <TableCell>Total Scope 2</TableCell>
                            <TableCell className="text-right">{results.scope2.total.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{results.percentages.scope2.toFixed(1)}%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Scope 3 Table */}
                    <div>
                      <h3 className="flex items-center text-lg font-semibold mb-2">
                        <TruckIcon className="w-5 h-5 mr-2 text-red-600" />
                        Scope 3 Breakdown
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Emissions (kg CO₂-e)</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(results.scope3.categories).map(([category, value]) => (
                            <TableRow key={`scope3-${category}`}>
                              <TableCell className="capitalize">{category}</TableCell>
                              <TableCell className="text-right">{value.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{(value/results.scope3.total*100).toFixed(1)}%</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-semibold">
                            <TableCell>Total Scope 3</TableCell>
                            <TableCell className="text-right">{results.scope3.total.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{results.percentages.scope3.toFixed(1)}%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="w-full flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Based on GHG Protocol standards and Australian emission factors
                  </div>
                  <div className="text-sm font-semibold">
                    Total: {results.total.toLocaleString()} kg CO₂-e
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScopesCalculator;
