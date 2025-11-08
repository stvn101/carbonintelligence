/**
 * CarbonIntelligence Core
 *
 * The main integration engine for the CarbonIntelligence system.
 * Provides comprehensive carbon footprint analysis for building projects.
 *
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 2.0.0
 */

class CarbonIntelligenceCore {
    constructor(options = {}) {
        this.options = {
            // Project defaults
            state: 'nsw',
            climateZone: 5, // Default to Sydney
            projectLife: 50, // Years
            gfaThreshold: 500, // m²

            // Calculation options
            useEC3: true,
            enableAI: true,
            nccCompliance: true,
            nabersTarget: 4.5,

            // Optimization level (conservative, balanced, aggressive)
            optimizationLevel: 'balanced',

            ...options
        };

        // Initialize the sub-modules
        this.materialsDatabase = new MaterialsDatabase({
            useEC3: this.options.useEC3,
            preferAustralian: true
        });

        this.lcaCalculator = new LCACalculator({
            projectLife: this.options.projectLife,
            materialsDatabase: this.materialsDatabase
        });

        this.scopesCalculator = new ScopesCalculator({
            australianContext: true
        });

        // Initialize weather data for climate zone
        this._initializeClimateData(this.options.climateZone);

        console.log('CarbonIntelligence Core initialized with options:', this.options);
    }

    /**
     * Calculate comprehensive carbon footprint for a project
     *
     * @param {Object} projectData - Complete project information
     * @returns {Object} - Comprehensive carbon analysis results
     */
    async calculateProject(projectData) {
        console.log(`Calculating project: ${projectData.name}`);

        // 1. Calculate materials LCA
        const materialsLCA = this._calculateMaterialsLCA(projectData.materials);

        // 2. Calculate operational carbon
        const operationalCarbon = this._calculateOperationalCarbon(projectData);

        // 3. Calculate scopes (1, 2, 3)
        const scopesInput = this._prepareScopesInput(projectData, materialsLCA);
        const scopesResults = this._calculateScopes(scopesInput, projectData.location?.state || this.options.state);

        // 4. Check NCC Section J compliance
        const nccCompliance = this._checkNCCCompliance(projectData, materialsLCA, operationalCarbon);

        // 5. Calculate NABERS rating
        const nabersRating = this._calculateNABERS(projectData, operationalCarbon);

        // 6. Generate optimization recommendations
        const optimizations = this._generateOptimizations(projectData, materialsLCA, operationalCarbon);

        // 7. Compile comprehensive results
        const results = {
            projectInfo: {
                name: projectData.name,
                location: projectData.location,
                gfa: projectData.gfa,
                buildingType: projectData.buildingType
            },

            // Carbon footprint
            totalCarbon: {
                embodied: materialsLCA.totals.embodiedCarbon,
                operational: operationalCarbon.total,
                wholeOfLife: materialsLCA.totals.embodiedCarbon + operationalCarbon.total,
                perSquareMeter: {
                    embodied: projectData.gfa ? (materialsLCA.totals.embodiedCarbon / projectData.gfa) : 0,
                    operational: projectData.gfa ? (operationalCarbon.total / projectData.gfa) : 0,
                    total: projectData.gfa ? ((materialsLCA.totals.embodiedCarbon + operationalCarbon.total) / projectData.gfa) : 0
                }
            },

            // Detailed breakdowns
            materialBreakdown: materialsLCA.categorized,
            operationalBreakdown: operationalCarbon.breakdown,
            scopesBreakdown: scopesResults,

            // Compliance information
            compliance: {
                ncc: nccCompliance,
                nabers: nabersRating
            },

            // Optimization recommendations
            optimizations: optimizations,

            // Climate data used
            climateData: {
                zone: this.options.climateZone,
                hdd: this.climateData.heatingDegreeDays,
                cdd: this.climateData.coolingDegreeDays,
                location: this._getClimateLocation(this.options.climateZone)
            }
        };

        return results;
    }

    /**
     * Calculate the LCA of all materials in the project
     */
    _calculateMaterialsLCA(materials) {
        if (!materials || materials.length === 0) {
            return {
                materials: [],
                categorized: {},
                totals: {
                    embodiedCarbon: 0,
                    operationalCarbon: 0,
                    endOfLifeBenefits: 0,
                    sequestrationBenefit: 0,
                    wholeLifeCarbon: 0
                }
            };
        }

        return this.lcaCalculator.calculateMaterialsLCA(materials, this.options.projectLife);
    }

    /**
     * Calculate operational carbon for the project
     */
    _calculateOperationalCarbon(projectData) {
        const gfa = projectData.gfa || 1000; // m²
        const buildingType = projectData.buildingType || 'commercial';
        const energyRating = projectData.energyRating || 'average';

        // Base energy intensity factors by building type (kWh/m²/year)
        const baseEnergyIntensity = {
            commercial: 250,
            residential: 150,
            industrial: 200,
            retail: 300,
            healthcare: 400,
            education: 180,
            hospitality: 350
        };

        // Energy rating factors
        const energyRatingFactors = {
            poor: 1.3,
            basic: 1.1,
            average: 1.0,
            good: 0.8,
            excellent: 0.6,
            outstanding: 0.4
        };

        // Climate zone adjustment factors
        const climateZoneFactors = {
            1: 1.2,  // Hot humid summer, warm winter (Darwin)
            2: 1.15, // Warm humid summer, mild winter (Brisbane)
            3: 1.1,  // Hot dry summer, warm winter (Alice Springs)
            4: 1.05, // Hot dry summer, cool winter (Dubbo)
            5: 1.0,  // Warm temperate (Sydney, Perth)
            6: 0.95, // Mild temperate (Melbourne, Adelaide)
            7: 0.9,  // Cool temperate (Canberra, Hobart)
            8: 0.85  // Alpine (Thredbo)
        };

        // Calculate adjusted energy intensity
        const baseIntensity = baseEnergyIntensity[buildingType] || baseEnergyIntensity.commercial;
        const ratingFactor = energyRatingFactors[energyRating] || energyRatingFactors.average;
        const climateFactor = climateZoneFactors[this.options.climateZone] || 1.0;

        const annualEnergyIntensity = baseIntensity * ratingFactor * climateFactor;

        // Calculate annual energy consumption (kWh)
        const annualEnergy = annualEnergyIntensity * gfa;

        // Calculate annual carbon emissions (kg CO₂-e)
        // Use grid emission factor based on state
        const gridEmissionFactors = {
            nsw: 0.76, // kg CO₂-e/kWh
            vic: 0.98,
            qld: 0.81,
            sa: 0.44,
            wa: 0.68,
            tas: 0.15,
            nt: 0.55,
            act: 0.76
        };

        const state = projectData.location?.state || this.options.state;
        const emissionFactor = gridEmissionFactors[state] || 0.79; // Default to national average

        // Calculate annual carbon emissions (kg CO₂-e)
        const annualCarbon = annualEnergy * emissionFactor;

        // Calculate lifetime carbon (convert to tonnes)
        const lifetimeCarbon = (annualCarbon * this.options.projectLife) / 1000;

        // Generate breakdown by end use
        // Typical breakdown varies by building type
        let endUseBreakdown;

        if (buildingType === 'commercial' || buildingType === 'office') {
            endUseBreakdown = {
                hvac: 0.40,           // 40% HVAC
                lighting: 0.25,        // 25% Lighting
                equipment: 0.20,       // 20% Equipment/plug loads
                hotWater: 0.05,        // 5% Hot water
                other: 0.10            // 10% Other
            };
        } else if (buildingType === 'residential') {
            endUseBreakdown = {
                hvac: 0.35,            // 35% HVAC
                lighting: 0.10,        // 10% Lighting
                equipment: 0.15,       // 15% Equipment
                hotWater: 0.25,        // 25% Hot water
                cooking: 0.10,         // 10% Cooking
                other: 0.05            // 5% Other
            };
        } else {
            // Default breakdown
            endUseBreakdown = {
                hvac: 0.35,            // 35% HVAC
                lighting: 0.20,        // 20% Lighting
                equipment: 0.20,       // 20% Equipment
                hotWater: 0.15,        // 15% Hot water
                other: 0.10            // 10% Other
            };
        }

        // Calculate carbon by end use
        const carbonByEndUse = {};
        Object.keys(endUseBreakdown).forEach(key => {
            carbonByEndUse[key] = lifetimeCarbon * endUseBreakdown[key];
        });

        return {
            annual: {
                energy: annualEnergy,          // kWh/year
                intensity: annualEnergyIntensity, // kWh/m²/year
                carbon: annualCarbon / 1000    // tonnes CO₂-e/year
            },
            total: lifetimeCarbon,             // tonnes CO₂-e (lifetime)
            breakdown: {
                byEndUse: carbonByEndUse,
                byFuel: {
                    electricity: lifetimeCarbon * 0.95, // 95% electricity (typical)
                    gas: lifetimeCarbon * 0.05          // 5% gas (typical)
                }
            },
            assumptions: {
                gridEmissionFactor: emissionFactor,
                projectLife: this.options.projectLife
            }
        };
    }

    /**
     * Prepare input for scopes calculator
     */
    _prepareScopesInput(projectData, materialsLCA) {
        // Extract required data from project and LCA results

        // Prepare Scope 1 input (direct emissions)
        const scope1 = {
            fuels: projectData.construction?.fuels || [],
            vehicles: projectData.construction?.vehicles || []
            // Could add other direct emission sources here
        };

        // Prepare Scope 2 input (purchased electricity)
        const scope2 = {
            electricity: {
                // Estimate annual electricity consumption if not provided
                kwh: 1000000 // Default placeholder value
            }
            // Could add other energy sources like steam or heating
        };

        // Prepare Scope 3 input (value chain emissions)
        const scope3 = {
            // Materials (from LCA calculation)
            materials: projectData.materials,

            // Transport (from project data)
            transport: projectData.construction?.transport || [],

            // Waste (from project data)
            waste: projectData.waste || [],

            // Could add other Scope 3 categories here
            employeeCommuting: {
                employees: 50, // Default placeholder
                totalKm: 250000 // Default placeholder
            }
        };

        return { scope1, scope2, scope3 };
    }

    /**
     * Calculate GHG Protocol Scopes
     */
    _calculateScopes(scopesInput, state) {
        return this.scopesCalculator.calculateAllScopes(scopesInput, state);
    }

    /**
     * Check NCC Section J compliance
     */
    _checkNCCCompliance(projectData, materialsLCA, operationalCarbon) {
        // This would be a comprehensive check against NCC requirements
        // Here we'll implement a simplified version

        // If NCC compliance is disabled, return null
        if (!this.options.nccCompliance) {
            return {
                pass: null,
                applicable: false,
                message: "NCC compliance check disabled"
            };
        }

        // Check if project is large enough to require compliance
        if (projectData.gfa < this.options.gfaThreshold) {
            return {
                pass: null,
                applicable: false,
                message: `Project GFA (${projectData.gfa}m²) below threshold for NCC compliance (${this.options.gfaThreshold}m²)`
            };
        }

        // Check building type
        if (projectData.buildingType === 'residential' && projectData.buildingClass < 3) {
            return {
                pass: null,
                applicable: false,
                message: "Class 1 and 2 residential buildings have different NCC requirements"
            };
        }

        // Basic compliance checks

        // 1. Check energy efficiency (J1 requirement)
        const energyEfficiency = operationalCarbon.annual.intensity < this._getNCCEnergyThreshold();

        // 2. Check building fabric (J1.2)
        const fabricCompliance = this._checkBuildingFabric(projectData);

        // 3. Check glazing (J1.3)
        const glazingCompliance = this._checkGlazing(projectData);

        // 4. Check air-conditioning (J5)
        const acCompliance = true; // Simplified, would need detailed mechanical data

        // 5. Check lighting (J6)
        const lightingCompliance = true; // Simplified, would need detailed lighting data

        // 6. Check embodied carbon (new requirement)
        const embodiedCompliance = materialsLCA.totals.embodiedCarbon / projectData.gfa < 500; // Simple threshold

        // Compile compliance results
        const allCompliant = energyEfficiency && fabricCompliance && glazingCompliance &&
            acCompliance && lightingCompliance && embodiedCompliance;

        return {
            pass: allCompliant,
            applicable: true,
            sections: {
                energyEfficiency: {
                    pass: energyEfficiency,
                    value: operationalCarbon.annual.intensity,
                    threshold: this._getNCCEnergyThreshold(),
                    section: "J1"
                },
                buildingFabric: {
                    pass: fabricCompliance,
                    section: "J1.2"
                },
                glazing: {
                    pass: glazingCompliance,
                    section: "J1.3"
                },
                airConditioning: {
                    pass: acCompliance,
                    section: "J5"
                },
                lighting: {
                    pass: lightingCompliance,
                    section: "J6"
                },
                embodiedCarbon: {
                    pass: embodiedCompliance,
                    value: materialsLCA.totals.embodiedCarbon / projectData.gfa,
                    threshold: 500,
                    section: "J5 (Embodied Carbon)"
                }
            },
            overall: allCompliant ? "PASS" : "FAIL"
        };
    }

    /**
     * Get NCC energy intensity threshold for compliance
     */
    _getNCCEnergyThreshold() {
        // Thresholds vary by climate zone and building type
        // These are simplified values
        const thresholds = {
            commercial: {
                1: 230, 2: 220, 3: 210, 4: 200, 5: 190, 6: 180, 7: 170, 8: 160
            },
            residential: {
                1: 160, 2: 150, 3: 140, 4: 130, 5: 120, 6: 110, 7: 100, 8: 90
            },
            default: {
                1: 200, 2: 190, 3: 180, 4: 170, 5: 160, 6: 150, 7: 140, 8: 130
            }
        };

        const buildingType = this.projectData?.buildingType || 'default';
        const typeThresholds = thresholds[buildingType] || thresholds.default;
        return typeThresholds[this.options.climateZone] || 150; // Default fallback
    }

    /**
     * Check building fabric compliance with NCC J1.2
     */
    _checkBuildingFabric(projectData) {
        // Simplified check based on insulation and construction
        // In a real implementation, this would check R-values against NCC requirements

        return true; // Simplified placeholder
    }

    /**
     * Check glazing compliance with NCC J1.3
     */
    _checkGlazing(projectData) {
        // Simplified check based on glazing specifications
        // In a real implementation, this would check U-values and SHGC against NCC requirements

        return true; // Simplified placeholder
    }

    /**
     * Calculate NABERS rating
     */
    _calculateNABERS(projectData, operationalCarbon) {
        // NABERS rating is based on operational energy performance
        const energyIntensity = operationalCarbon.annual.intensity; // kWh/m²/year

        // Determine building type for NABERS
        let nabersType = 'office';
        if (projectData.buildingType === 'residential' || projectData.buildingType === 'apartment') {
            nabersType = 'apartment';
        } else if (projectData.buildingType === 'retail' || projectData.buildingType === 'shopping centre') {
            nabersType = 'shoppingCentre';
        } else if (projectData.buildingType === 'hotel' || projectData.buildingType === 'hospitality') {
            nabersType = 'hotel';
        }

        // NABERS thresholds vary by building type
        // These are simplified thresholds
        const nabersThresholds = {
            office: {
                6: 110, // 6 stars: < 110 kWh/m²/year
                5.5: 130,
                5: 150,
                4.5: 170,
                4: 190,
                3.5: 210,
                3: 230,
                2.5: 250,
                2: 270,
                1.5: 290,
                1: 310
            },
            apartment: {
                6: 90,
                5: 110,
                4: 130,
                3: 150,
                2: 170,
                1: 190
            },
            shoppingCentre: {
                6: 280,
                5: 310,
                4: 340,
                3: 370,
                2: 400,
                1: 430
            },
            hotel: {
                6: 230,
                5: 260,
                4: 290,
                3: 320,
                2: 350,
                1: 380
            }
        };

        // Get thresholds for the building type
        const thresholds = nabersThresholds[nabersType] || nabersThresholds.office;

        // Determine NABERS rating based on energy intensity
        let stars = 0;

        // Find the highest star rating where the energy intensity is below the threshold
        for (const [rating, threshold] of Object.entries(thresholds)) {
            if (energyIntensity <= threshold && parseFloat(rating) > stars) {
                stars = parseFloat(rating);
            }
        }

        // Determine grade based on stars
        let grade;
        if (stars >= 5) {
            grade = 'Excellent';
        } else if (stars >= 4) {
            grade = 'Good';
        } else if (stars >= 2.5) {
            grade = 'Average';
        } else {
            grade = 'Poor';
        }

        // Check if it meets the target
        const meetsTarget = stars >= this.options.nabersTarget;

        // Calculate potential improvement
        let improvementNeeded = 0;
        if (!meetsTarget) {
            const targetThreshold = thresholds[this.options.nabersTarget.toString()];
            if (targetThreshold) {
                improvementNeeded = ((energyIntensity - targetThreshold) / energyIntensity) * 100;
            }
        }

        return {
            energy: {
                stars: stars,
                intensity: energyIntensity,
                grade: grade,
                targetMet: meetsTarget,
                improvementNeeded: improvementNeeded,
                target: this.options.nabersTarget
            },
            water: {
                // NABERS also includes water, but we're focusing on energy/carbon
                stars: null,
                applicable: false
            }
        };
    }

    /**
     * Generate optimization recommendations
     */
    _generateOptimizations(projectData, materialsLCA, operationalCarbon) {
        const recommendations = [];
        let totalPotentialSavings = 0;

        // Define optimization levels
        const levels = {
            conservative: { max: 15, materials: true, operations: true, costSensitive: true },
            balanced: { max: 30, materials: true, operations: true, costSensitive: false },
            aggressive: { max: 50, materials: true, operations: true, costSensitive: false }
        };

        const level = levels[this.options.optimizationLevel] || levels.balanced;

        // 1. Material substitutions
        if (level.materials) {
            // Check for high-carbon concrete and suggest alternatives
            const concreteFound = projectData.materials.find(m => m.category === 'concrete' &&
                m.type === 'concrete-32mpa');
            if (concreteFound) {
                const quantity = concreteFound.quantity;
                const currentImpact = 320 * quantity; // kg CO₂-e
                const alternativeImpact = 215 * quantity; // kg CO₂-e (GPC)
                const savings = currentImpact - alternativeImpact;

                recommendations.push({
                    title: "Replace standard concrete with geopolymer concrete",
                    description: "Substituting standard 32 MPa concrete with geopolymer concrete can reduce embodied carbon by approximately 32%",
                    impact: "High",
                    carbonSavings: savings,
                    costImpact: "+5-10%",
                    implementation: "Specify geopolymer concrete in construction documents. Check local availability and lead times."
                });

                totalPotentialSavings += savings;
            }

            // Check for steel and suggest high-recycled content
            const steelFound = projectData.materials.find(m => m.category === 'steel' &&
                m.type !== 'steel-recycled');
            if (steelFound) {
                const quantity = steelFound.quantity * 1000; // Convert to kg
                const currentImpact = 1.65 * quantity; // kg CO₂-e
                const alternativeImpact = 0.95 * quantity; // kg CO₂-e (recycled)
                const savings = currentImpact - alternativeImpact;

                recommendations.push({
                    title: "Specify high-recycled content steel",
                    description: "Using steel with high recycled content can reduce embodied carbon by approximately 40%",
                    impact: "High",
                    carbonSavings: savings,
                    costImpact: "Neutral",
                    implementation: "Specify minimum 90% recycled content for steel. Verify EPDs from suppliers."
                });

                totalPotentialSavings += savings;
            }

            // Check for aluminum windows and suggest timber
            const aluminumWindows = projectData.materials.find(m => m.category === 'glazing' &&
                m.type === 'window-aluminium');
            if (aluminumWindows) {
                const quantity = aluminumWindows.quantity;
                const currentImpact = 120 * quantity; // kg CO₂-e
                const alternativeImpact = 35 * quantity; // kg CO₂-e (timber)
                const savings = currentImpact - alternativeImpact;

                recommendations.push({
                    title: "Replace aluminum window frames with timber",
                    description: "Using timber window frames instead of aluminum can reduce embodied carbon by approximately 70%",
                    impact: "Medium",
                    carbonSavings: savings,
                    costImpact: "Neutral to +5%",
                    implementation: "Specify FSC-certified timber window frames. Consider maintenance requirements."
                });

                totalPotentialSavings += savings;
            }
        }

        // 2. Operational improvements
        if (level.operations) {
            // Improve HVAC efficiency
            const hvacSavings = operationalCarbon.breakdown.byEndUse.hvac * 0.25; // 25% potential savings

            recommendations.push({
                title: "Enhance HVAC system efficiency",
                description: "Upgrading HVAC equipment and optimizing controls can reduce operational energy use by 20-30%",
                impact: "High",
                carbonSavings: hvacSavings * 1000, // Convert to kg
                costImpact: level.costSensitive ? "+10-15% capital, -20% operational" : "+5-10% capital, -20% operational",
                implementation: "Specify high-efficiency equipment, optimize zoning, implement advanced controls."
            });

            totalPotentialSavings += hvacSavings * 1000;

            // Lighting improvements
            const lightingSavings = operationalCarbon.breakdown.byEndUse.lighting * 0.30; // 30% potential savings

            recommendations.push({
                title: "Upgrade to advanced lighting systems",
                description: "Implementing LED lighting with occupancy and daylight sensors can reduce lighting energy by 30-40%",
                impact: "Medium",
                carbonSavings: lightingSavings * 1000, // Convert to kg
                costImpact: "+5% capital, -30% operational",
                implementation: "Specify high-efficiency LEDs, implement controls, optimize daylight design."
            });

            totalPotentialSavings += lightingSavings * 1000;

            // Renewable energy
            if (this.options.optimizationLevel === 'aggressive') {
                const renewableSavings = operationalCarbon.total * 0.30 * 1000; // 30% renewable energy

                recommendations.push({
                    title: "Install on-site renewable energy",
                    description: "Installing solar PV can offset 25-35% of annual energy consumption",
                    impact: "High",
                    carbonSavings: renewableSavings,
                    costImpact: "+15% capital, -25% operational",
                    implementation: "Install rooftop solar PV, consider battery storage, implement monitoring."
                });

                totalPotentialSavings += renewableSavings;
            }
        }

        // Calculate potential percentage reduction
        const totalCurrentCarbon = materialsLCA.totals.embodiedCarbon + (operationalCarbon.total * 1000);
        const savingsPercentage = (totalPotentialSavings / totalCurrentCarbon) * 100;

        // Sort recommendations by impact
        recommendations.sort((a, b) => b.carbonSavings - a.carbonSavings);

        return {
            recommendations: recommendations,
            totalPotentialSavings: totalPotentialSavings,
            savingsPercentage: savingsPercentage,
            optimizationLevel: this.options.optimizationLevel
        };
    }

    /**
     * Initialize climate data for the selected climate zone
     */
    _initializeClimateData(climateZone) {
        // Australian climate data by NCC climate zone
        const climateDataByZone = {
            1: { // Hot humid summer, warm winter (Darwin)
                heatingDegreeDays: 0,
                coolingDegreeDays: 3200,
                annualRainfall: 1700,
                humidityAvg: 70,
                solarRadiation: 22
            },
            2: { // Warm humid summer, mild winter (Brisbane)
                heatingDegreeDays: 200,
                coolingDegreeDays: 1800,
                annualRainfall: 1200,
                humidityAvg: 65,
                solarRadiation: 20
            },
            3: { // Hot dry summer, warm winter (Alice Springs)
                heatingDegreeDays: 400,
                coolingDegreeDays: 2200,
                annualRainfall: 300,
                humidityAvg: 30,
                solarRadiation: 24
            },
            4: { // Hot dry summer, cool winter (Dubbo)
                heatingDegreeDays: 900,
                coolingDegreeDays: 1600,
                annualRainfall: 600,
                humidityAvg: 45,
                solarRadiation: 19
            },
            5: { // Warm temperate (Sydney, Perth)
                heatingDegreeDays: 600,
                coolingDegreeDays: 900,
                annualRainfall: 1100,
                humidityAvg: 60,
                solarRadiation: 18
            },
            6: { // Mild temperate (Melbourne, Adelaide)
                heatingDegreeDays: 1100,
                coolingDegreeDays: 500,
                annualRainfall: 600,
                humidityAvg: 55,
                solarRadiation: 16
            },
            7: { // Cool temperate (Canberra, Hobart)
                heatingDegreeDays: 1800,
                coolingDegreeDays: 200,
                annualRainfall: 700,
                humidityAvg: 50,
                solarRadiation: 15
            },
            8: { // Alpine (Thredbo)
                heatingDegreeDays: 3000,
                coolingDegreeDays: 0,
                annualRainfall: 1500,
                humidityAvg: 60,
                solarRadiation: 14
            }
        };

        this.climateData = climateDataByZone[climateZone] || climateDataByZone[5]; // Default to Sydney
    }

    /**
     * Get representative location for climate zone
     */
    _getClimateLocation(zone) {
        const locations = {
            1: "Darwin, NT",
            2: "Brisbane, QLD",
            3: "Alice Springs, NT",
            4: "Dubbo, NSW",
            5: "Sydney, NSW",
            6: "Melbourne, VIC",
            7: "Canberra, ACT",
            8: "Thredbo, NSW"
        };

        return locations[zone] || "Unknown";
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarbonIntelligenceCore;
}
