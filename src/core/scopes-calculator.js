/**
 * GHG Protocol Scopes Calculator
 *
 * Calculates emissions according to the Greenhouse Gas Protocol
 * covering Scope 1, 2, and 3 emissions with Australian-specific factors.
 *
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 2.0.0
 */

class ScopesCalculator {
    constructor(options = {}) {
        this.options = {
            // Default options
            detailedBreakdown: true,
            includeAllCategories: true,
            useMarketBased: false, // Use market-based accounting for Scope 2
            australianContext: true, // Use Australian emission factors
            ...options
        };

        // Load emission factors
        this.emissionFactors = this._loadEmissionFactors();

        console.log('Scopes Calculator initialized with options:', this.options);
    }

    /**
     * Calculate all GHG Protocol scopes
     *
     * @param {Object} input - Comprehensive input data for all scopes
     * @param {String} state - Australian state code (nsw, vic, qld, etc.)
     * @returns {Object} - Complete GHG emissions results
     */
    calculateAllScopes(input, state = 'nsw') {
        // Calculate each scope
        const scope1Results = this._calculateScope1(input.scope1);
        const scope2Results = this._calculateScope2(input.scope2, state);
        const scope3Results = this._calculateScope3(input.scope3, state);

        // Totals
        const totalScope1 = scope1Results.total;
        const totalScope2 = scope2Results.total;
        const totalScope3 = scope3Results.total;
        const totalEmissions = totalScope1 + totalScope2 + totalScope3;

        // Calculate percentages
        const percentages = {
            scope1: (totalScope1 / totalEmissions) * 100,
            scope2: (totalScope2 / totalEmissions) * 100,
            scope3: (totalScope3 / totalEmissions) * 100
        };

        // Determine largest contributor
        let largestScope = 'Scope 3';
        if (totalScope1 > totalScope2 && totalScope1 > totalScope3) {
            largestScope = 'Scope 1';
        } else if (totalScope2 > totalScope1 && totalScope2 > totalScope3) {
            largestScope = 'Scope 2';
        }

        // Calculate materials percentage if available
        let materialsPercentage = 0;
        if (scope3Results.categories.materials && totalEmissions > 0) {
            materialsPercentage = (scope3Results.categories.materials / totalEmissions) * 100;
        }

        return {
            scope1: scope1Results,
            scope2: scope2Results,
            scope3: scope3Results,
            total: totalEmissions,
            percentages: percentages,
            summary: {
                largestScope: largestScope,
                materialsPercentage: materialsPercentage
            }
        };
    }

    /**
     * Calculate Scope 1 emissions (Direct emissions)
     */
    _calculateScope1(scope1Input) {
        if (!scope1Input) {
            return { total: 0, categories: {} };
        }

        const categories = {};

        // Process fuels
        if (scope1Input.fuels && scope1Input.fuels.length > 0) {
            categories.fuels = this._calculateFuelEmissions(scope1Input.fuels);
        } else {
            categories.fuels = 0;
        }

        // Process vehicles
        if (scope1Input.vehicles && scope1Input.vehicles.length > 0) {
            categories.vehicles = this._calculateVehicleEmissions(scope1Input.vehicles);
        } else {
            categories.vehicles = 0;
        }

        // Process fugitive emissions if included
        if (scope1Input.fugitiveEmissions) {
            categories.fugitive = this._calculateFugitiveEmissions(scope1Input.fugitiveEmissions);
        } else {
            categories.fugitive = 0;
        }

        // Process process emissions if included
        if (scope1Input.processEmissions) {
            categories.process = this._calculateProcessEmissions(scope1Input.processEmissions);
        } else {
            categories.process = 0;
        }

        // Calculate total
        const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

        return {
            total: total,
            categories: categories
        };
    }

    /**
     * Calculate Scope 2 emissions (Purchased electricity)
     */
    _calculateScope2(scope2Input, state) {
        if (!scope2Input) {
            return { total: 0, categories: {} };
        }

        const categories = {};

        // Process electricity
        if (scope2Input.electricity) {
            // Get emission factor for state
            let electricityFactor = this.emissionFactors.electricity[state] ||
                this.emissionFactors.electricity.national;

            // Use location-based or market-based factor
            if (this.options.useMarketBased && scope2Input.electricity.marketBased) {
                categories.electricity = scope2Input.electricity.kwh *
                    scope2Input.electricity.marketBased;
            } else {
                categories.electricity = scope2Input.electricity.kwh * electricityFactor;
            }
        } else {
            categories.electricity = 0;
        }

        // Process steam/heating if included
        if (scope2Input.steam) {
            categories.steam = scope2Input.steam.quantity *
                this.emissionFactors.steam;
        } else {
            categories.steam = 0;
        }

        // Process cooling if included
        if (scope2Input.cooling) {
            categories.cooling = scope2Input.cooling.quantity *
                this.emissionFactors.cooling;
        } else {
            categories.cooling = 0;
        }

        // Calculate total
        const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

        return {
            total: total,
            categories: categories
        };
    }

    /**
     * Calculate Scope 3 emissions (Value chain emissions)
     */
    _calculateScope3(scope3Input, state) {
        if (!scope3Input) {
            return { total: 0, categories: {} };
        }

        const categories = {};

        // Process purchased goods & services (materials)
        if (scope3Input.materials && scope3Input.materials.length > 0) {
            categories.materials = this._calculateMaterialsEmissions(scope3Input.materials);
        } else {
            categories.materials = 0;
        }

        // Process capital goods if included
        if (scope3Input.capitalGoods) {
            categories.capitalGoods = this._calculateCapitalGoodsEmissions(scope3Input.capitalGoods);
        } else {
            categories.capitalGoods = 0;
        }

        // Process fuel & energy related activities
        if (scope3Input.energyRelated) {
            categories.energyRelated = this._calculateEnergyRelatedEmissions(scope3Input.energyRelated, state);
        } else {
            categories.energyRelated = 0;
        }

        // Process upstream transport
        if (scope3Input.transport && scope3Input.transport.length > 0) {
            categories.transport = this._calculateTransportEmissions(scope3Input.transport);
        } else {
            categories.transport = 0;
        }

        // Process waste
        if (scope3Input.waste && scope3Input.waste.length > 0) {
            categories.waste = this._calculateWasteEmissions(scope3Input.waste);
        } else {
            categories.waste = 0;
        }

        // Process business travel
        if (scope3Input.businessTravel) {
            categories.businessTravel = this._calculateBusinessTravelEmissions(scope3Input.businessTravel);
        } else {
            categories.businessTravel = 0;
        }

        // Process employee commuting
        if (scope3Input.employeeCommuting) {
            categories.employeeCommuting = this._calculateCommutingEmissions(scope3Input.employeeCommuting);
        } else {
            categories.employeeCommuting = 0;
        }

        // Calculate total
        const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

        return {
            total: total,
            categories: categories
        };
    }

    /**
     * Calculate emissions from fuel combustion
     */
    _calculateFuelEmissions(fuels) {
        let totalEmissions = 0;

        for (const fuel of fuels) {
            // Get emission factor for fuel type
            const emissionFactor = this.emissionFactors.fuels[fuel.type] || 0;

            // Calculate emissions
            const emissions = fuel.quantity * emissionFactor;
            totalEmissions += emissions;
        }

        return totalEmissions;
    }

    /**
     * Calculate emissions from vehicle use
     */
    _calculateVehicleEmissions(vehicles) {
        let totalEmissions = 0;

        for (const vehicle of vehicles) {
            // Get emission factor for fuel type
            const emissionFactor = this.emissionFactors.fuels[vehicle.fuelType] || 0;

            // Calculate emissions
            const emissions = vehicle.fuelUsed * emissionFactor;
            totalEmissions += emissions;
        }

        return totalEmissions;
    }

    /**
     * Calculate fugitive emissions
     */
    _calculateFugitiveEmissions(fugitiveInput) {
        // Implementation would depend on the types of fugitive emissions
        // This is a placeholder
        return 0;
    }

    /**
     * Calculate process emissions
     */
    _calculateProcessEmissions(processInput) {
        // Implementation would depend on the types of process emissions
        // This is a placeholder
        return 0;
    }

    /**
     * Calculate emissions from materials (Scope 3 Category 1)
     */
    _calculateMaterialsEmissions(materials) {
        // This would typically use an LCA calculator
        // Here we'll use a simplified approach
        let totalEmissions = 0;

        for (const material of materials) {
            // Get emission factor for material type
            let emissionFactor = 0;

            // For concrete, use volume-based factor
            if (material.category === 'concrete') {
                emissionFactor = this.emissionFactors.materials.concrete[material.type] ||
                    this.emissionFactors.materials.concrete.default;

                // Calculate emissions
                const emissions = material.quantity * emissionFactor;
                totalEmissions += emissions;
            }
            // For steel, use weight-based factor
            else if (material.category === 'steel') {
                emissionFactor = this.emissionFactors.materials.steel[material.type] ||
                    this.emissionFactors.materials.steel.default;

                // Calculate emissions (convert to kg)
                const emissions = material.quantity * 1000 * emissionFactor;
                totalEmissions += emissions;
            }
            // Default case for other materials
            else {
                emissionFactor = 500; // Default generic factor

                // Calculate emissions
                const emissions = material.quantity * emissionFactor;
                totalEmissions += emissions;
            }
        }

        return totalEmissions;
    }

    /**
     * Calculate emissions from capital goods (Scope 3 Category 2)
     */
    _calculateCapitalGoodsEmissions(capitalGoods) {
        // Implementation would depend on the types of capital goods
        // This is a placeholder
        return 0;
    }

    /**
     * Calculate emissions from fuel & energy related activities (Scope 3 Category 3)
     */
    _calculateEnergyRelatedEmissions(energyRelated, state) {
        // Implementation would depend on the types of energy-related activities
        // This is a placeholder
        return 0;
    }

    /**
     * Calculate emissions from transport (Scope 3 Category 4)
     */
    _calculateTransportEmissions(transport) {
        let totalEmissions = 0;

        for (const item of transport) {
            // Get emission factor based on vehicle type
            const emissionFactor = this.emissionFactors.transport[item.type] ||
                this.emissionFactors.transport.default;

            // Calculate emissions based on distance and weight
            const emissions = item.distance * item.weight * emissionFactor / 1000;
            totalEmissions += emissions;
        }

        return totalEmissions;
    }

    /**
     * Calculate emissions from waste (Scope 3 Category 5)
     */
    _calculateWasteEmissions(waste) {
        let totalEmissions = 0;

        for (const item of waste) {
            // Get emission factor based on waste type and disposal method
            let emissionFactor = this.emissionFactors.waste.default;

            if (this.emissionFactors.waste[item.disposalMethod]) {
                emissionFactor = this.emissionFactors.waste[item.disposalMethod];
            }

            // Calculate emissions
            const emissions = item.quantity * emissionFactor;
            totalEmissions += emissions;
        }

        return totalEmissions;
    }

    /**
     * Calculate emissions from business travel (Scope 3 Category 6)
     */
    _calculateBusinessTravelEmissions(businessTravel) {
        // Implementation would depend on the types of business travel
        // This is a placeholder
        return 0;
    }

    /**
     * Calculate emissions from employee commuting (Scope 3 Category 7)
     */
    _calculateCommutingEmissions(commuting) {
        // Implementation based on total kilometers and number of employees
        const averageEmissionFactor = 0.17; // kg CO2e per km (average of various transport modes)

        // Calculate emissions
        const emissions = commuting.totalKm * averageEmissionFactor;

        return emissions;
    }

    /**
     * Load emission factors for calculations
     */
    _loadEmissionFactors() {
        return {
            // Fuel emission factors (kg CO2e per unit)
            fuels: {
                diesel: 2.68,     // kg CO2e per liter
                petrol: 2.31,     // kg CO2e per liter
                naturalGas: 0.18, // kg CO2e per kWh
                lpg: 1.51,        // kg CO2e per liter
                coal: 2.42        // kg CO2e per kg
            },

            // Electricity emission factors by state (kg CO2e per kWh)
            electricity: {
                nsw: 0.76,  // NSW/ACT
                vic: 0.98,  // Victoria
                qld: 0.81,  // Queensland
                sa: 0.44,   // South Australia
                wa: 0.68,   // Western Australia
                tas: 0.15,  // Tasmania
                nt: 0.55,   // Northern Territory
                national: 0.79 // National average
            },

            // Steam/heat emission factors (kg CO2e per unit)
            steam: 0.22, // kg CO2e per kWh

            // Cooling emission factors (kg CO2e per unit)
            cooling: 0.19, // kg CO2e per kWh

            // Transport emission factors (kg CO2e per tonne-km)
            transport: {
                lightVehicle: 0.25,   // kg CO2e per t-km
                heavyVehicle: 0.12,   // kg CO2e per t-km
                rail: 0.02,           // kg CO2e per t-km
                ship: 0.01,           // kg CO2e per t-km
                air: 1.5,             // kg CO2e per t-km
                default: 0.2          // Default value
            },

            // Waste emission factors (kg CO2e per kg)
            waste: {
                landfill: 0.45,    // kg CO2e per kg
                recycling: 0.02,   // kg CO2e per kg
                composting: 0.01,  // kg CO2e per kg
                incineration: 0.35,// kg CO2e per kg
                default: 0.3       // Default value
            },

            // Material emission factors
            materials: {
                // Concrete (kg CO2e per m³)
                concrete: {
                    'concrete-32mpa': 320,
                    'concrete-40mpa': 355,
                    'concrete-gpc-32mpa': 215,
                    'concrete-recycled-aggregate': 280,
                    'default': 300
                },
                // Steel (kg CO2e per kg)
                steel: {
                    'steel-reinforcing-bar': 1.55,
                    'steel-structural-sections': 1.65,
                    'steel-recycled': 0.95,
                    'default': 1.5
                }
                // Other material categories would be added here
            }
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScopesCalculator;
}
