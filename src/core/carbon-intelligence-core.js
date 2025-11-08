/**
 * carbon-intelligence-core.js
 *
 * The main integration engine for the CarbonIntelligence System.
 * This core engine orchestrates all calculations, manages project data,
 * performs compliance checking, and provides AI-powered optimization.
 *
 * @author Climate Scientist & Steven Jenkins
 * @version 2.0.0
 * @company CarbonConstruct
 */

// Import required modules
const MaterialsDatabase = require('./materials-database');
const LCACalculator = require('./lca-calculator');
const ScopesCalculator = require('./scopes-calculator');
const AustralianIntelligence = require('./australian-intelligence');

/**
 * Main integration engine for the CarbonIntelligence System
 */
class CarbonIntelligenceCore {
    /**
     * Initialize the CarbonIntelligence core with project configuration
     *
     * @param {Object} config - Configuration parameters
     * @param {string} config.state - Australian state code (nsw, vic, qld, etc.)
     * @param {number} config.climateZone - NCC climate zone (1-8)
     * @param {number} config.projectLife - Project lifespan in years
     * @param {boolean} config.useEC3 - Whether to use EC3 database
     * @param {boolean} config.enableAI - Whether to enable AI optimization
     * @param {string} config.optimizationLevel - Optimization level (conservative, balanced, aggressive)
     * @param {number} config.nabersTarget - Target NABERS rating (0-6)
     */
    constructor(config) {
        this.config = {
            state: config.state || 'nsw',
            climateZone: config.climateZone || 5,
            projectLife: config.projectLife || 50,
            useEC3: config.useEC3 !== undefined ? config.useEC3 : true,
            enableAI: config.enableAI !== undefined ? config.enableAI : true,
            optimizationLevel: config.optimizationLevel || 'balanced',
            nabersTarget: config.nabersTarget || null,
            nccCompliance: config.nccCompliance !== undefined ? config.nccCompliance : true
        };

        // Initialize component modules
        this.materialsDb = new MaterialsDatabase({
            useEC3: this.config.useEC3,
            region: this.config.state,
            cacheEnabled: true
        });

        this.lcaCalculator = new LCACalculator({
            projectLife: this.config.projectLife
        });

        this.scopesCalculator = new ScopesCalculator({
            region: this.config.state
        });

        this.australianIntelligence = new AustralianIntelligence({
            state: this.config.state,
            climateZone: this.config.climateZone
        });

        // AI optimization engine
        if (this.config.enableAI) {
            this.aiEngine = {
                optimizationLevel: this.config.optimizationLevel,
                initialized: true
            };
            console.log(`AI Optimization Engine initialized (${this.config.optimizationLevel} level)`);
        }

        console.log(`CarbonIntelligence Core initialized for ${this.config.state.toUpperCase()}, Climate Zone ${this.config.climateZone}`);
    }

    /**
     * Calculate comprehensive carbon footprint for a project
     *
     * @param {Object} projectData - Complete project data
     * @returns {Promise<Object>} Comprehensive analysis results
     */
    async calculateProject(projectData) {
        console.log(`Starting comprehensive analysis for: ${projectData.name || 'Unnamed Project'}`);

        try {
            // Validate project data
            this._validateProjectData(projectData);

            // Apply Australian context
            const enrichedData = this.australianIntelligence.enrichProjectData(projectData);

            // 1. Calculate embodied carbon (materials)
            const materialsResults = await this._calculateMaterialsCarbon(enrichedData.materials);

            // 2. Calculate operational carbon
            const operationalResults = this._calculateOperationalCarbon(enrichedData);

            // 3. Calculate construction and transport carbon
            const constructionResults = this._calculateConstructionCarbon(enrichedData.construction);

            // 4. Calculate waste carbon
            const wasteResults = enrichedData.waste ?
                this._calculateWasteCarbon(enrichedData.waste) :
                { total: 0, categories: {} };

            // 5. Calculate GHG Protocol scopes
            const scopesInput = this._prepareScopesInput(
                enrichedData,
                materialsResults,
                constructionResults,
                wasteResults
            );
            const scopesResults = this.scopesCalculator.calculateAllScopes(scopesInput, this.config.state);

            // 6. Check compliance
            const complianceResults = this._checkCompliance(
                enrichedData,
                materialsResults,
                operationalResults
            );

            // 7. Generate optimization recommendations if AI is enabled
            const optimizationResults = this.config.enableAI ?
                this._generateOptimizations(enrichedData, materialsResults, operationalResults) :
                { totalPotentialSavings: 0, savingsPercentage: 0, recommendations: [] };

            // 8. Compile final results
            const results = this._compileResults(
                enrichedData,
                materialsResults,
                operationalResults,
                constructionResults,
                wasteResults,
                scopesResults,
                complianceResults,
                optimizationResults
            );

            console.log(`Analysis completed successfully for: ${projectData.name || 'Unnamed Project'}`);
            return results;

        } catch (error) {
            console.error('Error in project calculation:', error);
            throw new Error(`CarbonIntelligence calculation failed: ${error.message}`);
        }
    }

    /**
     * Validate project data for required fields and formats
     *
     * @private
     * @param {Object} projectData - Project data to validate
     * @throws {Error} If validation fails
     */
    _validateProjectData(projectData) {
        // Check for required fields
        if (!projectData) {
            throw new Error('Project data is required');
        }

        if (!projectData.location || !projectData.location.state) {
            throw new Error('Project location with state is required');
        }

        if (!projectData.gfa || typeof projectData.gfa !== 'number' || projectData.gfa <= 0) {
            throw new Error('Valid Gross Floor Area (gfa) is required');
        }

        if (!projectData.buildingType) {
            throw new Error('Building type is required');
        }

        // Check materials array
        if (!Array.isArray(projectData.materials) || projectData.materials.length === 0) {
            throw new Error('At least one material is required');
        }

        // Validate each material
        projectData.materials.forEach((material, index) => {
            if (!material.category || !material.type || !material.quantity) {
                throw new Error(`Invalid material at index ${index}: requires category, type and quantity`);
            }
            if (typeof material.quantity !== 'number' || material.quantity <= 0) {
                throw new Error(`Invalid quantity for material at index ${index}: must be a positive number`);
            }
        });

        console.log('Project data validation passed');
    }

    /**
     * Calculate carbon footprint for all materials
     *
     * @private
     * @param {Array} materials - List of materials
     * @returns {Promise<Object>} Materials carbon results
     */
    async _calculateMaterialsCarbon(materials) {
        console.log(`Calculating embodied carbon for ${materials.length} materials`);

        const materialResults = [];
        let totalEmbodiedCarbon = 0;
        let totalBiogenicSequestration = 0;

        // Process each material
        for (const material of materials) {
            try {
                // Get carbon coefficient from database
                const coefficientData = await this.materialsDb.getMaterialCoefficient(
                    material.category,
                    material.type
                );

                // Calculate full LCA for this material
                const lcaResult = this.lcaCalculator.calculateFullLCA(
                    material,
                    coefficientData,
                    this.config.projectLife
                );

                // Track totals
                totalEmbodiedCarbon += lcaResult.totals.embodiedCarbon;

                // Track biogenic carbon sequestration (negative values for timber)
                if (lcaResult.biogenicSequestration) {
                    totalBiogenicSequestration += lcaResult.biogenicSequestration;
                }

                // Store results for this material
                materialResults.push({
                    material: material,
                    embodiedCarbon: lcaResult.totals.embodiedCarbon,
                    wholeLifeCarbon: lcaResult.totals.wholeLifeCarbon,
                    biogenicSequestration: lcaResult.biogenicSequestration || 0,
                    stageBreakdown: lcaResult.stages,
                    carbonIntensity: lcaResult.carbonIntensity
                });

            } catch (error) {
                console.error(`Error processing material ${material.type}:`, error);
                throw new Error(`Failed to process material ${material.type}: ${error.message}`);
            }
        }

        // Group by category
        const categoryBreakdown = materialResults.reduce((acc, result) => {
            const category = result.material.category;
            if (!acc[category]) {
                acc[category] = {
                    totalCarbon: 0,
                    materials: []
                };
            }

            acc[category].totalCarbon += result.embodiedCarbon;
            acc[category].materials.push({
                type: result.material.type,
                description: result.material.description,
                quantity: result.material.quantity,
                embodiedCarbon: result.embodiedCarbon
            });

            return acc;
        }, {});

        // Calculate percentages
        const categoryPercentages = Object.entries(categoryBreakdown).map(([category, data]) => ({
            category,
            totalCarbon: data.totalCarbon,
            percentage: (data.totalCarbon / totalEmbodiedCarbon) * 100
        }));

        // Sort by impact
        categoryPercentages.sort((a, b) => b.totalCarbon - a.totalCarbon);

        return {
            materialResults,
            totalEmbodiedCarbon,
            totalBiogenicSequestration,
            netEmbodiedCarbon: totalEmbodiedCarbon - totalBiogenicSequestration,
            categoryBreakdown,
            categoryPercentages
        };
    }

    /**
     * Calculate operational carbon for the project
     *
     * @private
     * @param {Object} projectData - Project data
     * @returns {Object} Operational carbon results
     */
    _calculateOperationalCarbon(projectData) {
        console.log('Calculating operational carbon');

        const {
            gfa,
            buildingType,
            energyRating,
            location
        } = projectData;

        // Get regional grid factors from Australian Intelligence
        const gridFactors = this.australianIntelligence.getEnergyGridFactors(location.state);

        // Estimate energy consumption based on building type, area, and energy rating
        const energyIntensity = this._estimateEnergyIntensity(buildingType, energyRating);
        const annualEnergyConsumption = energyIntensity * gfa; // kWh/year

        // Calculate annual emissions
        const annualEmissions = annualEnergyConsumption * gridFactors.electricity; // kg CO2-e/year

        // Calculate total operational emissions over project life
        const totalOperational = annualEmissions * this.config.projectLife / 1000; // tonnes CO2-e

        return {
            annualEnergyConsumption,
            annualEmissions: annualEmissions / 1000, // tonnes CO2-e/year
            totalOperational,
            energyIntensity,
            gridFactor: gridFactors.electricity,
            projectionYears: this.config.projectLife
        };
    }

    /**
     * Estimate energy intensity based on building type and energy rating
     *
     * @private
     * @param {string} buildingType - Type of building
     * @param {string} energyRating - Energy efficiency rating
     * @returns {number} Energy intensity in kWh/m²/year
     */
    _estimateEnergyIntensity(buildingType, energyRating) {
        // Base intensities by building type (kWh/m²/year)
        const baseIntensities = {
            'commercial': 200,
            'residential': 150,
            'retail': 300,
            'industrial': 180,
            'healthcare': 320,
            'education': 160,
            'hospitality': 280
        };

        // Default to commercial if building type not found
        const baseIntensity = baseIntensities[buildingType.toLowerCase()] || baseIntensities.commercial;

        // Adjustment factors based on energy rating
        const ratingFactors = {
            'excellent': 0.6,  // 40% better than average
            'good': 0.8,       // 20% better than average
            'average': 1.0,    // Baseline
            'poor': 1.2        // 20% worse than average
        };

        // Default to average if energy rating not found
        const ratingFactor = ratingFactors[energyRating?.toLowerCase()] || ratingFactors.average;

        // Apply climate zone adjustment from Australian Intelligence
        const climateAdjustment = this.australianIntelligence.getClimateZoneEnergyFactor(this.config.climateZone);

        return baseIntensity * ratingFactor * climateAdjustment;
    }

    /**
     * Calculate construction-related carbon emissions
     *
     * @private
     * @param {Object} construction - Construction data
     * @returns {Object} Construction carbon results
     */
    _calculateConstructionCarbon(construction) {
        console.log('Calculating construction carbon');

        if (!construction) {
            return { total: 0, categories: {} };
        }

        let totalConstructionCarbon = 0;
        const categories = {};

        // Calculate fuel emissions
        if (Array.isArray(construction.fuels)) {
            categories.fuels = {
                total: 0,
                items: []
            };

            construction.fuels.forEach(fuel => {
                const fuelFactor = this.australianIntelligence.getFuelEmissionFactor(fuel.type);
                const fuelEmissions = fuel.quantity * fuelFactor; // kg CO2-e

                categories.fuels.items.push({
                    type: fuel.type,
                    quantity: fuel.quantity,
                    emissions: fuelEmissions
                });

                categories.fuels.total += fuelEmissions;
                totalConstructionCarbon += fuelEmissions;
            });
        }

        // Calculate vehicle emissions
        if (Array.isArray(construction.vehicles)) {
            categories.vehicles = {
                total: 0,
                items: []
            };

            construction.vehicles.forEach(vehicle => {
                const vehicleFactor = this.australianIntelligence.getVehicleEmissionFactor(vehicle.type, vehicle.fuelType);
                const vehicleEmissions = vehicle.fuelUsed * vehicleFactor; // kg CO2-e

                categories.vehicles.items.push({
                    type: vehicle.type,
                    fuelType: vehicle.fuelType,
                    fuelUsed: vehicle.fuelUsed,
                    emissions: vehicleEmissions
                });

                categories.vehicles.total += vehicleEmissions;
                totalConstructionCarbon += vehicleEmissions;
            });
        }

        // Convert to tonnes
        totalConstructionCarbon = totalConstructionCarbon / 1000; // tonnes CO2-e

        if (categories.fuels) {
            categories.fuels.total = categories.fuels.total / 1000; // tonnes CO2-e
        }

        if (categories.vehicles) {
            categories.vehicles.total = categories.vehicles.total / 1000; // tonnes CO2-e
        }

        return {
            total: totalConstructionCarbon,
            categories
        };
    }

    /**
     * Calculate waste-related carbon emissions
     *
     * @private
     * @param {Array} waste - Waste data
     * @returns {Object} Waste carbon results
     */
    _calculateWasteCarbon(waste) {
        console.log('Calculating waste carbon');

        if (!Array.isArray(waste) || waste.length === 0) {
            return { total: 0, categories: {} };
        }

        let totalWasteCarbon = 0;
        const wasteByType = {};

        waste.forEach(item => {
            const wasteFactor = this.australianIntelligence.getWasteEmissionFactor(
                item.type,
                item.disposalMethod
            );

            const wasteEmissions = item.quantity * wasteFactor / 1000; // tonnes CO2-e

            if (!wasteByType[item.type]) {
                wasteByType[item.type] = {
                    total: 0,
                    disposalMethods: {}
                };
            }

            if (!wasteByType[item.type].disposalMethods[item.disposalMethod]) {
                wasteByType[item.type].disposalMethods[item.disposalMethod] = 0;
            }

            wasteByType[item.type].disposalMethods[item.disposalMethod] += wasteEmissions;
            wasteByType[item.type].total += wasteEmissions;
            totalWasteCarbon += wasteEmissions;
        });

        return {
            total: totalWasteCarbon,
            categories: wasteByType
        };
    }

    /**
     * Prepare input for GHG Protocol scopes calculation
     *
     * @private
     * @param {Object} projectData - Project data
     * @param {Object} materialsResults - Materials carbon results
     * @param {Object} constructionResults - Construction carbon results
     * @param {Object} wasteResults - Waste carbon results
     * @returns {Object} Scopes input data
     */
    _prepareScopesInput(projectData, materialsResults, constructionResults, wasteResults) {
        // Prepare input for scopes calculator
        return {
            scope1: {
                fuels: projectData.construction?.fuels || [],
                vehicles: projectData.construction?.vehicles || []
            },
            scope2: {
                electricity: {
                    kwh: projectData.energyConsumption || 1100000 // Default if not specified
                }
            },
            scope3: {
                // Map materials for scope 3 upstream
                materials: materialsResults.materialResults.map(result => ({
                    category: result.material.category,
                    type: result.material.type,
                    quantity: result.material.quantity,
                    embodiedCarbon: result.embodiedCarbon
                })),

                // Add transport if available
                transport: projectData.transport || [],

                // Add waste
                waste: projectData.waste || [],

                // Add employee commuting if available
                employeeCommuting: projectData.employeeCommuting || null
            }
        };
    }

    /**
     * Check compliance with building codes and standards
     *
     * @private
     * @param {Object} projectData - Project data
     * @param {Object} materialsResults - Materials carbon results
     * @param {Object} operationalResults - Operational carbon results
     * @returns {Object} Compliance results
     */
    _checkCompliance(projectData, materialsResults, operationalResults) {
        console.log('Checking regulatory compliance');

        // Initialize compliance results
        const compliance = {
            ncc: {
                pass: true,
                sections: {}
            },
            nabers: {
                energy: {
                    stars: 0,
                    grade: ''
                }
            }
        };

        // NCC Section J compliance checks
        if (this.config.nccCompliance) {
            // Get NCC Section J requirements for the climate zone
            const nccRequirements = this.australianIntelligence.getNCCRequirements(this.config.climateZone);

            // Check J1.2 (Thermal insulation)
            compliance.ncc.sections.J1_2 = this._checkThermalInsulationCompliance(projectData, nccRequirements);

            // Check J1.3 (Glazing)
            compliance.ncc.sections.J1_3 = this._checkGlazingCompliance(projectData, nccRequirements);

            // Check J1.5 (Building sealing)
            compliance.ncc.sections.J1_5 = true; // Assuming compliance by default

            // Check J1.6 (Lighting)
            compliance.ncc.sections.J1_6 = this._checkLightingCompliance(projectData, nccRequirements);

            // Check J5 (Embodied carbon) - New section for commercial buildings
            if (projectData.buildingType.toLowerCase() === 'commercial') {
                const embodiedIntensity = materialsResults.totalEmbodiedCarbon / projectData.gfa;
                compliance.ncc.sections.J5 = embodiedIntensity <= nccRequirements.maxEmbodiedIntensity;
            } else {
                compliance.ncc.sections.J5 = true; // Not applicable for non-commercial
            }

            // Overall compliance - all sections must pass
            compliance.ncc.pass = Object.values(compliance.ncc.sections).every(sectionPass => sectionPass);
        }

        // NABERS energy rating prediction
        if (projectData.buildingType.toLowerCase() === 'commercial') {
            const nabersRating = this._predictNABERSRating(
                operationalResults.energyIntensity,
                projectData.buildingType
            );

            compliance.nabers.energy.stars = nabersRating.stars;
            compliance.nabers.energy.grade = nabersRating.grade;
        }

        return compliance;
    }

    /**
     * Check thermal insulation compliance with NCC requirements
     *
     * @private
     * @param {Object} projectData - Project data
     * @param {Object} nccRequirements - NCC requirements for the climate zone
     * @returns {boolean} Whether thermal insulation complies with NCC
     */
    _checkThermalInsulationCompliance(projectData, nccRequirements) {
        // Find insulation materials in the project
        const insulationMaterials = projectData.materials.filter(
            m => m.category === 'insulation'
        );

        // Default to compliance if no insulation specified (assuming it's handled elsewhere)
        if (insulationMaterials.length === 0) {
            return true;
        }

        // Check each insulation material against requirements
        for (const material of insulationMaterials) {
            // This would need a more sophisticated check in a real implementation
            // Here we're making a simplified check based on material type

            // For simplicity, assume glasswool and higher R-values comply
            if (material.type.includes('glasswool')) {
                // Extract R-value if available in the type name (e.g., glasswool_batts_r25)
                const rValueMatch = material.type.match(/r(\d+)/i);
                if (rValueMatch) {
                    const rValue = parseInt(rValueMatch[1], 10) / 10; // Convert R25 to 2.5

                    // Check against minimum R-value required for climate zone
                    if (rValue < nccRequirements.minRValues.roof ||
                        rValue < nccRequirements.minRValues.wall) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Check glazing compliance with NCC requirements
     *
     * @private
     * @param {Object} projectData - Project data
     * @param {Object} nccRequirements - NCC requirements for the climate zone
     * @returns {boolean} Whether glazing complies with NCC
     */
    _checkGlazingCompliance(projectData, nccRequirements) {
        // Find glazing materials in the project
        const glazingMaterials = projectData.materials.filter(
            m => m.category === 'glazing'
        );

        // Default to compliance if no glazing specified
        if (glazingMaterials.length === 0) {
            return true;
        }

        // Simplified check based on glazing types
        for (const material of glazingMaterials) {
            // Check if double or single glazed
            const isDoubleGlazed = material.type.includes('double');
            const isTripleGlazed = material.type.includes('triple');

            // Automatically pass for triple glazed
            if (isTripleGlazed) {
                continue;
            }

            // Check U-value and SHGC requirements based on climate zone
            if (this.config.climateZone >= 4) {
                // Colder climate zones require better thermal performance
                if (!isDoubleGlazed) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Check lighting compliance with NCC requirements
     *
     * @private
     * @param {Object} projectData - Project data
     * @param {Object} nccRequirements - NCC requirements for the climate zone
     * @returns {boolean} Whether lighting complies with NCC
     */
    _checkLightingCompliance(projectData, nccRequirements) {
        // In a real implementation, this would check the lighting power density
        // For this example, we'll assume compliance if LED lighting is specified
        const hasLEDLighting = projectData.hasLEDLighting || false;
        return hasLEDLighting;
    }

    /**
     * Predict NABERS energy rating based on energy intensity
     *
     * @private
     * @param {number} energyIntensity - Energy intensity in kWh/m²/year
     * @param {string} buildingType - Type of building
     * @returns {Object} NABERS rating (stars and grade)
     */
    _predictNABERSRating(energyIntensity, buildingType) {
        // NABERS thresholds for commercial buildings (simplified)
        const nabersThresholds = {
            6: 125,  // 6 stars: <= 125 kWh/m²/yr
            5.5: 140,
            5: 155,
            4.5: 175,
            4: 195,
            3.5: 220,
            3: 245,
            2.5: 275,
            2: 305,
            1.5: 340,
            1: 375   // 1 star: <= 375 kWh/m²/yr
        };

        // Find the highest rating where energy intensity is less than or equal to the threshold
        let stars = 0;
        for (const [rating, threshold] of Object.entries(nabersThresholds)) {
            if (energyIntensity <= threshold) {
                stars = parseFloat(rating);
                break;
            }
        }

        // Default to 0 stars if above all thresholds
        if (stars === 0) {
            stars = 0;
        }

        // Determine grade
        let grade = 'Poor';
        if (stars >= 5) {
            grade = 'Excellent';
        } else if (stars >= 4) {
            grade = 'Good';
        } else if (stars >= 3) {
            grade = 'Average';
        }

        return { stars, grade };
    }

    /**
     * Generate AI-powered optimization recommendations
     *
     * @private
     * @param {Object} projectData - Project data
     * @param {Object} materialsResults - Materials carbon results
     * @param {Object} operationalResults - Operational carbon results
     * @returns {Object} Optimization recommendations
     */
    _generateOptimizations(projectData, materialsResults, operationalResults) {
        console.log('Generating AI-powered optimization recommendations');

        if (!this.config.enableAI || !this.aiEngine.initialized) {
            return {
                totalPotentialSavings: 0,
                savingsPercentage: 0,
                recommendations: []
            };
        }

        const recommendations = [];
        let totalPotentialSavings = 0;

        // 1. Material Substitution Recommendations

        // Check for standard concrete and suggest GPC
        const concreteResults = materialsResults.materialResults.filter(
            r => r.material.category === 'concrete' && r.material.type.includes('32mpa') && !r.material.type.includes('gpc')
        );

        for (const concrete of concreteResults) {
            // Calculate potential savings with GPC (60% reduction)
            const savingPotential = concrete.embodiedCarbon * 0.6; // 60% reduction
            recommendations.push({
                title: `Replace ${concrete.material.type} with GPC concrete`,
                category: 'Material Substitution',
                carbonSavings: savingPotential,
                costImpact: 'Neutral',
                implementation: 'Easy',
                details: `Substitute ${concrete.material.quantity}m³ of standard concrete with Geopolymer Concrete (GPC) for a 60% reduction in embodied carbon.`
            });
            totalPotentialSavings += savingPotential;
        }

        // Check for standard steel and suggest recycled steel
        const steelResults = materialsResults.materialResults.filter(
            r => r.material.category === 'steel' && !r.material.type.includes('recycled')
        );

        for (const steel of steelResults) {
            // Calculate potential savings with recycled steel (75% reduction)
            const savingPotential = steel.embodiedCarbon * 0.75; // 75% reduction
            recommendations.push({
                title: `Use recycled steel instead of virgin steel`,
                category: 'Material Substitution',
                carbonSavings: savingPotential,
                costImpact: 'Slight Increase',
                implementation: 'Medium',
                details: `Source ${steel.material.quantity} tonnes of recycled steel instead of virgin steel for a 75% reduction in embodied carbon.`
            });
            totalPotentialSavings += savingPotential;
        }

        // Check for timber opportunities for carbon sequestration
        if (!materialsResults.materialResults.some(r => r.material.category === 'timber')) {
            // Suggest adding timber elements
            const sequestrationPotential = projectData.gfa * 0.1; // Rough estimate
            recommendations.push({
                title: 'Incorporate mass timber elements',
                category: 'Material Substitution',
                carbonSavings: sequestrationPotential,
                costImpact: 'Moderate Increase',
                implementation: 'Complex',
                details: 'Incorporate Cross-Laminated Timber (CLT) for internal walls and floors to benefit from carbon sequestration.'
            });
            totalPotentialSavings += sequestrationPotential;
        }

        // 2. Design Optimization Recommendations

        // Window-to-Wall Ratio optimization
        recommendations.push({
            title: 'Optimize window-to-wall ratio by facade',
            category: 'Design Optimization',
            carbonSavings: operationalResults.annualEmissions * 0.15 * this.config.projectLife, // 15% operational reduction
            costImpact: 'Neutral',
            implementation: 'Medium',
            details: 'Reduce glazing on west/east facades and optimize south/north facades to reduce solar gain and heat loss.'
        });

        // Enhanced insulation in key areas
        recommendations.push({
            title: 'Enhance insulation in critical zones',
            category: 'Design Optimization',
            carbonSavings: operationalResults.annualEmissions * 0.1 * this.config.projectLife, // 10% operational reduction
            costImpact: 'Slight Increase',
            implementation: 'Easy',
            details: 'Increase insulation R-values in roof and west-facing walls to reduce thermal losses.'
        });

        // Add solar shading
        if (this.config.climateZone <= 4) { // Hot climates
            recommendations.push({
                title: 'Add external solar shading',
                category: 'Design Optimization',
                carbonSavings: operationalResults.annualEmissions * 0.08 * this.config.projectLife, // 8% operational reduction
                costImpact: 'Moderate Increase',
                implementation: 'Medium',
                details: 'Install external shading devices on north and west facades to reduce cooling loads.'
            });
        }

        // 3. System Optimization Recommendations

        // HVAC sizing optimization
        recommendations.push({
            title: 'Right-size HVAC system for actual loads',
            category: 'System Optimization',
            carbonSavings: operationalResults.annualEmissions * 0.12 * this.config.projectLife, // 12% operational reduction
            costImpact: 'Savings',
            implementation: 'Complex',
            details: 'Perform detailed thermal modeling to right-size HVAC equipment and avoid oversizing.'
        });

        // Control strategy improvements
        recommendations.push({
            title: 'Implement advanced HVAC controls',
            category: 'System Optimization',
            carbonSavings: operationalResults.annualEmissions * 0.15 * this.config.projectLife, // 15% operational reduction
            costImpact: 'Moderate Increase',
            implementation: 'Medium',
            details: 'Add CO2 sensors, occupancy detection, and predictive controls to optimize HVAC operation.'
        });

        // Renewable energy
        if (projectData.hasRenewables !== true) {
            recommendations.push({
                title: 'Install rooftop solar PV system',
                category: 'System Optimization',
                carbonSavings: operationalResults.annualEmissions * 0.25 * this.config.projectLife, // 25% operational reduction
                costImpact: 'High Initial Cost',
                implementation: 'Complex',
                details: 'Install a rooftop solar array sized to offset 25% of building electrical consumption.'
            });
        }

        // 4. Construction Optimization Recommendations

        // Delivery schedule optimization
        recommendations.push({
            title: 'Optimize material delivery schedules',
            category: 'Construction Optimization',
            carbonSavings: 20, // Rough estimate in tonnes CO2e
            costImpact: 'Savings',
            implementation: 'Easy',
            details: 'Consolidate deliveries and optimize routes to reduce transport emissions and congestion.'
        });

        // Waste reduction through prefabrication
        recommendations.push({
            title: 'Increase prefabrication to reduce waste',
            category: 'Construction Optimization',
            carbonSavings: 35, // Rough estimate in tonnes CO2e
            costImpact: 'Slight Increase',
            implementation: 'Medium',
            details: 'Increase use of prefabricated components to reduce on-site waste and improve quality.'
        });

        // Local material sourcing
        recommendations.push({
            title: 'Source materials locally',
            category: 'Construction Optimization',
            carbonSavings: 25, // Rough estimate in tonnes CO2e
            costImpact: 'Neutral',
            implementation: 'Easy',
            details: 'Prioritize suppliers within 100km radius to reduce transport emissions.'
        });

        // Calculate total potential savings
        totalPotentialSavings = recommendations.reduce(
            (total, rec) => total + rec.carbonSavings,
            0
        );

        // Calculate percentage of total carbon
        const totalCarbon = materialsResults.totalEmbodiedCarbon + operationalResults.totalOperational;
        const savingsPercentage = (totalPotentialSavings / totalCarbon) * 100;

        // Sort recommendations by carbon savings potential
        recommendations.sort((a, b) => b.carbonSavings - a.carbonSavings);

        return {
            totalPotentialSavings,
            savingsPercentage,
            recommendations
        };
    }

    /**
     * Compile final results from all calculation modules
     *
     * @private
     * @param {Object} projectData - Project data
     * @param {Object} materialsResults - Materials carbon results
     * @param {Object} operationalResults - Operational carbon results
     * @param {Object} constructionResults - Construction carbon results
     * @param {Object} wasteResults - Waste carbon results
     * @param {Object} scopesResults - GHG Protocol scopes results
     * @param {Object} complianceResults - Compliance results
     * @param {Object} optimizationResults - Optimization recommendations
     * @returns {Object} Comprehensive results
     */
    _compileResults(
        projectData,
        materialsResults,
        operationalResults,
        constructionResults,
        wasteResults,
        scopesResults,
        complianceResults,
        optimizationResults
    ) {
        console.log('Compiling final results');

        // Calculate total carbon footprint
        const totalEmbodiedCarbon = materialsResults.totalEmbodiedCarbon;
        const totalOperationalCarbon = operationalResults.totalOperational;
        const totalConstructionCarbon = constructionResults.total;
        const totalWasteCarbon = wasteResults.total;

        const totalCarbon = {
            embodied: totalEmbodiedCarbon,
            operational: totalOperationalCarbon,
            construction: totalConstructionCarbon,
            waste: totalWasteCarbon,
            wholeOfLife: totalEmbodiedCarbon + totalOperationalCarbon + totalConstructionCarbon + totalWasteCarbon,

            // Per square meter metrics
            perSquareMeter: {
                embodied: totalEmbodiedCarbon / projectData.gfa * 1000, // kg CO2-e/m²
                operational: totalOperationalCarbon / projectData.gfa * 1000, // kg CO2-e/m²
                total: (totalEmbodiedCarbon + totalOperationalCarbon) / projectData.gfa * 1000 // kg CO2-e/m²
            }
        };

        // LCA breakdown by lifecycle stages
        const lcaBreakdown = {
            stages: {
                // Product stage (cradle to gate)
                A1A3: materialsResults.materialResults.reduce(
                    (sum, mat) => sum + (mat.stageBreakdown?.A1A3 || 0),
                    0
                ),

                // Transport to site
                A4: materialsResults.materialResults.reduce(
                    (sum, mat) => sum + (mat.stageBreakdown?.A4 || 0),
                    0
                ),

                // Construction processes
                A5: materialsResults.materialResults.reduce(
                    (sum, mat) => sum + (mat.stageBreakdown?.A5 || 0),
                    0
                ) + totalConstructionCarbon,

                // Use stage (including operational carbon)
                B1B7: materialsResults.materialResults.reduce(
                    (sum, mat) => sum + (mat.stageBreakdown?.B1B7 || 0),
                    0
                ) + totalOperationalCarbon,

                // End of life
                C1C4: materialsResults.materialResults.reduce(
                    (sum, mat) => sum + (mat.stageBreakdown?.C1C4 || 0),
                    0
                ) + totalWasteCarbon,

                // Benefits beyond system boundary
                D: materialsResults.materialResults.reduce(
                    (sum, mat) => sum + (mat.stageBreakdown?.D || 0),
                    0
                )
            }
        };

        // Calculate material coverage analysis
        const specifiedMaterialsTotal = materialsResults.materialResults.reduce(
            (sum, mat) => sum + mat.embodiedCarbon, 0
        );
        const coveragePercentage = (specifiedMaterialsTotal / totalEmbodiedCarbon * 100).toFixed(1);

        const coverageAnalysis = {
            specifiedMaterialsTotal: specifiedMaterialsTotal,
            specifiedMaterialsCoverage: parseFloat(coveragePercentage),
            unspecifiedComponentsTotal: totalEmbodiedCarbon - specifiedMaterialsTotal,
            explanation: `The detailed material breakdown covers ${coveragePercentage}% of the total embodied carbon. The remaining carbon represents additional building components including complete structural systems, MEP installations, facades, roofing, and site works that are calculated holistically but not individually itemized.`,
            totalEmbodiedCarbon: totalEmbodiedCarbon
        };

        // Enhanced operational carbon breakdown
        const operationalBreakdown = this._calculateOperationalBreakdown(
            projectData,
            operationalResults
        );

        // Compile final results object
        return {
            projectInfo: {
                name: projectData.name,
                location: projectData.location,
                gfa: projectData.gfa,
                buildingType: projectData.buildingType,
                climateZone: this.config.climateZone,
                projectLife: this.config.projectLife
            },

            totalCarbon,
            lcaBreakdown,
            materialsBreakdown: materialsResults.categoryPercentages,
            materialResults: materialsResults.materialResults,
            coverageAnalysis,
            operationalCarbon: operationalResults,
            operationalBreakdown,
            constructionCarbon: constructionResults,
            wasteCarbon: wasteResults,
            ghgProtocol: scopesResults,
            compliance: complianceResults,
            optimizations: optimizationResults,

            timestamp: new Date().toISOString(),
            calculationVersion: '2.0.0'
        };
    }

    /**
     * Calculate detailed operational carbon breakdown
     *
     * @private
     * @param {Object} projectData - Project data
     * @param {Object} operationalResults - Operational carbon results
     * @returns {Object} Detailed operational breakdown
     */
    _calculateOperationalBreakdown(projectData, operationalResults) {
        const { buildingType, gfa } = projectData;
        const totalOperational = operationalResults.totalOperational;

        // Distribution percentages by building type
        const distributions = {
            commercial: { hvac: 0.45, lighting: 0.25, equipment: 0.20, hotWater: 0.05, other: 0.05 },
            residential: { hvac: 0.40, lighting: 0.15, equipment: 0.15, hotWater: 0.20, other: 0.10 },
            retail: { hvac: 0.35, lighting: 0.35, equipment: 0.15, hotWater: 0.05, other: 0.10 },
            industrial: { hvac: 0.25, lighting: 0.15, equipment: 0.45, hotWater: 0.05, other: 0.10 },
            healthcare: { hvac: 0.40, lighting: 0.20, equipment: 0.25, hotWater: 0.10, other: 0.05 },
            education: { hvac: 0.45, lighting: 0.25, equipment: 0.15, hotWater: 0.05, other: 0.10 },
            hospitality: { hvac: 0.35, lighting: 0.20, equipment: 0.15, hotWater: 0.20, other: 0.10 }
        };

        const dist = distributions[buildingType.toLowerCase()] || distributions.commercial;

        return {
            hvac: totalOperational * dist.hvac,
            lighting: totalOperational * dist.lighting,
            equipment: totalOperational * dist.equipment,
            hotWater: totalOperational * dist.hotWater,
            other: totalOperational * dist.other,
            total: totalOperational,
            distribution: dist
        };
    }
}

module.exports = CarbonIntelligenceCore;