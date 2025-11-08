/**
 * LCACalculator.js
 *
 * Comprehensive Life Cycle Assessment (LCA) calculator for the CarbonIntelligence system.
 * Implements calculations for all EN 15978 stages (A1-D) with specific Australian adjustments.
 *
 * @author Climate Science Expert
 * @version 2.0.0
 */

class LCACalculator {
    constructor(options = {}) {
        this.options = {
            region: options.region || 'nsw',
            includeUncertainty: options.includeUncertainty !== undefined ? options.includeUncertainty : true,
            includeBenefits: options.includeBenefits !== undefined ? options.includeBenefits : true,
            dataSource: options.dataSource || 'EC3',
            ...options
        };

        // Stage factors for different regions - based on research data
        this.stageFactors = {
            nsw: {
                A4: 1.0,   // Transport to site
                A5: 1.15,  // Construction process
                B1B7: 1.0, // Use phase
                C1C4: 0.9, // End of life
                D: 0.85    // Benefits beyond boundary
            },
            vic: {
                A4: 0.95,
                A5: 1.1,
                B1B7: 1.05,
                C1C4: 0.85,
                D: 0.82
            },
            qld: {
                A4: 1.2,   // Higher transport emissions in QLD
                A5: 1.2,
                B1B7: 1.1, // Higher operational impacts due to climate
                C1C4: 0.95,
                D: 0.80
            },
            // Other regions...
        };

        // Default lifespan values for different building types
        this.defaultLifespan = {
            commercial: 60,
            residential: 50,
            industrial: 30,
            infrastructure: 100
        };

        // Material service life data
        this.materialServiceLife = {
            'concrete-32mpa': 100,
            'concrete-40mpa': 100,
            'concrete-gpc-32mpa': 100,
            'steel-reinforcing-bar': 100,
            'steel-structural-sections': 100,
            'timber-clt': 60,
            'timber-framing': 60,
            'insulation-glasswool': 50,
            'insulation-pir': 50,
            'masonry-brick': 100,
            'masonry-block-aac': 80,
            'glazing-single': 30,
            'glazing-double': 30,
            'glazing-triple': 30,
            'finishes-carpet': 10,
            'finishes-paint': 7,
            'finishes-plasterboard': 50
            // More materials...
        };
    }

    /**
     * Calculate the full LCA for a material across all life cycle stages
     *
     * @param {Object} material - Material object with category, type, quantity
     * @param {number} quantity - Quantity of material
     * @param {number} projectLife - Project lifespan in years
     * @param {Object} options - Additional calculation options
     * @returns {Object} Comprehensive LCA results
     */
    calculateFullLCA(material, quantity, projectLife, options = {}) {
        const region = options.region || this.options.region;
        const factors = this.stageFactors[region] || this.stageFactors.nsw;

        // Get material coefficients - in a real implementation this would
        // interface with a material database or external API
        const materialData = this._getMaterialCoefficient(material);

        // A1-A3: Product stage (embodied carbon from material production)
        const a1a3 = materialData.embodiedCarbon * quantity;

        // A4: Transport to site
        const a4 = a1a3 * 0.08 * factors.A4; // Typical transport emissions as % of embodied

        // A5: Construction process
        const a5 = a1a3 * 0.12 * factors.A5; // Construction emissions as % of embodied

        // B1-B7: Use stage (replacements based on service life)
        const materialLifespan = this.materialServiceLife[material.type] || projectLife;
        const replacements = Math.max(0, Math.ceil(projectLife / materialLifespan) - 1);
        const replacementCarbon = replacements * (a1a3 + a4 + a5 * 0.5); // Reduced construction emissions for replacements
        const b1b7 = replacementCarbon * factors.B1B7;

        // C1-C4: End of life
        const c1c4 = a1a3 * 0.15 * factors.C1C4; // End of life as % of embodied

        // D: Benefits beyond system boundary (reuse, recovery, recycling potential)
        let d = 0;
        if (this.options.includeBenefits) {
            d = -1 * (a1a3 * this._getRecyclingPotential(material) * factors.D);
        }

        // Calculate totals
        const embodiedCarbon = a1a3 + a4 + a5; // Initial embodied carbon
        const wholeLifeCarbon = embodiedCarbon + b1b7 + c1c4 + d;

        // Calculate carbon intensity
        const carbonIntensity = this._calculateCarbonIntensity(material, embodiedCarbon, quantity);

        // Calculate uncertainty if enabled
        const uncertainty = this.options.includeUncertainty ? this._calculateUncertainty(material, wholeLifeCarbon) : null;

        return {
            material: material,
            quantity: quantity,
            stages: {
                A1A3: a1a3,
                A4: a4,
                A5: a5,
                B1B7: b1b7,
                C1C4: c1c4,
                D: d
            },
            totals: {
                embodiedCarbon: embodiedCarbon,
                wholeLifeCarbon: wholeLifeCarbon
            },
            carbonIntensity: carbonIntensity,
            uncertainty: uncertainty,
            replacements: replacements,
            serviceLife: materialLifespan,
            region: region
        };
    }

    /**
     * Calculate LCA for multiple materials
     *
     * @param {Array} materials - Array of material objects
     * @param {number} projectLife - Project lifespan in years
     * @param {Object} options - Additional calculation options
     * @returns {Object} Comprehensive LCA results for all materials
     */
    calculateMaterialsLCA(materials, projectLife, options = {}) {
        const results = materials.map(material =>
            this.calculateFullLCA(material, material.quantity, projectLife, options)
        );

        // Calculate totals across all materials
        const totals = {
            embodiedCarbon: 0,
            wholeLifeCarbon: 0,
            stages: {
                A1A3: 0,
                A4: 0,
                A5: 0,
                B1B7: 0,
                C1C4: 0,
                D: 0
            }
        };

        // Aggregate results
        results.forEach(result => {
            totals.embodiedCarbon += result.totals.embodiedCarbon;
            totals.wholeLifeCarbon += result.totals.wholeLifeCarbon;

            Object.keys(totals.stages).forEach(stage => {
                totals.stages[stage] += result.stages[stage];
            });
        });

        // Calculate material breakdown by category
        const materialBreakdown = this._calculateMaterialBreakdown(results);

        return {
            materials: results,
            totals: totals,
            materialBreakdown: materialBreakdown,
            projectLife: projectLife
        };
    }

    /**
     * Perform sensitivity analysis for a material
     *
     * @param {Object} material - Material object
     * @param {number} quantity - Quantity of material
     * @param {number} projectLife - Project lifespan in years
     * @param {Array} parameters - Parameters to vary in sensitivity analysis
     * @returns {Object} Sensitivity analysis results
     */
    performSensitivityAnalysis(material, quantity, projectLife, parameters = ['embodiedCarbon', 'serviceLife', 'transportDistance']) {
        const baseline = this.calculateFullLCA(material, quantity, projectLife);
        const variations = {};

        // Analyze sensitivity to different parameters
        parameters.forEach(param => {
            const variations10 = { up: {}, down: {} };

            // Create variations of +/- 10%
            switch (param) {
                case 'embodiedCarbon':
                    // Vary embodied carbon by +/- 10%
                    const materialUp = { ...material, embodiedCarbonAdjustment: 1.1 };
                    const materialDown = { ...material, embodiedCarbonAdjustment: 0.9 };
                    variations10.up = this.calculateFullLCA(materialUp, quantity, projectLife);
                    variations10.down = this.calculateFullLCA(materialDown, quantity, projectLife);
                    break;

                case 'serviceLife':
                    // Vary service life by +/- 10%
                    const originalServiceLife = this.materialServiceLife[material.type] || projectLife;
                    const serviceLifeUp = Math.ceil(originalServiceLife * 1.1);
                    const serviceLifeDown = Math.floor(originalServiceLife * 0.9);

                    // Override service life
                    this.materialServiceLife[material.type] = serviceLifeUp;
                    variations10.up = this.calculateFullLCA(material, quantity, projectLife);

                    this.materialServiceLife[material.type] = serviceLifeDown;
                    variations10.down = this.calculateFullLCA(material, quantity, projectLife);

                    // Restore original value
                    this.materialServiceLife[material.type] = originalServiceLife;
                    break;

                case 'transportDistance':
                    // Vary transport distance (affects A4)
                    const optionsUp = { transportDistanceAdjustment: 1.1 };
                    const optionsDown = { transportDistanceAdjustment: 0.9 };
                    variations10.up = this.calculateFullLCA(material, quantity, projectLife, optionsUp);
                    variations10.down = this.calculateFullLCA(material, quantity, projectLife, optionsDown);
                    break;

                // Add more parameters as needed
            }

            variations[param] = {
                baseline: baseline.totals.wholeLifeCarbon,
                up10Percent: variations10.up.totals.wholeLifeCarbon,
                down10Percent: variations10.down.totals.wholeLifeCarbon,
                sensitivityUp: (variations10.up.totals.wholeLifeCarbon - baseline.totals.wholeLifeCarbon) / baseline.totals.wholeLifeCarbon,
                sensitivityDown: (variations10.down.totals.wholeLifeCarbon - baseline.totals.wholeLifeCarbon) / baseline.totals.wholeLifeCarbon
            };
        });

        return {
            baseline: baseline,
            variations: variations
        };
    }

    /**
     * Calculate the carbon intensity of a material
     *
     * @param {Object} material - Material object
     * @param {number} carbonValue - Carbon value
     * @param {number} quantity - Quantity of material
     * @returns {Object} Carbon intensity metrics
     * @private
     */
    _calculateCarbonIntensity(material, carbonValue, quantity) {
        // Different intensity calculations based on material category
        switch (material.category) {
            case 'concrete':
                return {
                    value: carbonValue / quantity,
                    unit: 'kg CO₂-e/m³',
                    benchmark: this._getBenchmark('concrete', 'kg CO₂-e/m³')
                };

            case 'steel':
                return {
                    value: carbonValue / quantity,
                    unit: 'kg CO₂-e/tonne',
                    benchmark: this._getBenchmark('steel', 'kg CO₂-e/tonne')
                };

            case 'timber':
                return {
                    value: carbonValue / quantity,
                    unit: 'kg CO₂-e/m³',
                    benchmark: this._getBenchmark('timber', 'kg CO₂-e/m³')
                };

            case 'insulation':
            case 'glazing':
            case 'finishes':
                return {
                    value: carbonValue / quantity,
                    unit: 'kg CO₂-e/m²',
                    benchmark: this._getBenchmark(material.category, 'kg CO₂-e/m²')
                };

            default:
                return {
                    value: carbonValue / quantity,
                    unit: 'kg CO₂-e/unit',
                    benchmark: null
                };
        }
    }

    /**
     * Calculate uncertainty for LCA results
     *
     * @param {Object} material - Material object
     * @param {number} carbonValue - Carbon value
     * @returns {Object} Uncertainty metrics
     * @private
     */
    _calculateUncertainty(material, carbonValue) {
        // Different uncertainty levels based on material and data quality
        let uncertaintyFactor;

        switch (material.category) {
            case 'concrete':
            case 'steel':
                // Common materials with good data
                uncertaintyFactor = 0.10; // ±10%
                break;

            case 'timber':
                // More variable based on source and treatment
                uncertaintyFactor = 0.15; // ±15%
                break;

            case 'insulation':
            case 'glazing':
                uncertaintyFactor = 0.12; // ±12%
                break;

            default:
                // Higher uncertainty for less common materials
                uncertaintyFactor = 0.20; // ±20%
        }

        // Adjust for data source quality
        if (this.options.dataSource === 'EC3') {
            uncertaintyFactor *= 0.9; // Better data source, reduce uncertainty
        } else if (this.options.dataSource === 'generic') {
            uncertaintyFactor *= 1.2; // Generic data, increase uncertainty
        }

        // Calculate upper and lower bounds
        const lowerBound = carbonValue * (1 - uncertaintyFactor);
        const upperBound = carbonValue * (1 + uncertaintyFactor);

        return {
            factor: uncertaintyFactor,
            lowerBound: lowerBound,
            upperBound: upperBound,
            range: upperBound - lowerBound
        };
    }

    /**
     * Calculate material breakdown by category
     *
     * @param {Array} results - Array of LCA results per material
     * @returns {Array} Material breakdown by category
     * @private
     */
    _calculateMaterialBreakdown(results) {
        // Group by category
        const categories = {};
        let totalEmbodied = 0;

        results.forEach(result => {
            const category = result.material.category;

            if (!categories[category]) {
                categories[category] = {
                    category: category,
                    totalCarbon: 0,
                    materials: []
                };
            }

            categories[category].totalCarbon += result.totals.embodiedCarbon;
            categories[category].materials.push({
                type: result.material.type,
                embodiedCarbon: result.totals.embodiedCarbon
            });

            totalEmbodied += result.totals.embodiedCarbon;
        });

        // Convert to array and add percentages
        return Object.values(categories).map(category => ({
            ...category,
            percentage: (category.totalCarbon / totalEmbodied) * 100
        })).sort((a, b) => b.totalCarbon - a.totalCarbon);
    }

    /**
     * Get material coefficient data
     *
     * @param {Object} material - Material object
     * @returns {Object} Material coefficient data
     * @private
     */
    _getMaterialCoefficient(material) {
        // In a real implementation, this would connect to the materials database
        // or an external API like EC3, OpenEPD, or Apache CarbonData

        // Sample coefficient data for demonstration
        const coefficients = {
            'concrete-32mpa': { embodiedCarbon: 358, unit: 'kg CO₂-e/m³' },
            'concrete-40mpa': { embodiedCarbon: 428, unit: 'kg CO₂-e/m³' },
            'concrete-gpc-32mpa': { embodiedCarbon: 195, unit: 'kg CO₂-e/m³' }, // Geopolymer concrete
            'concrete-recycled-aggregate': { embodiedCarbon: 295, unit: 'kg CO₂-e/m³' },

            'steel-reinforcing-bar': { embodiedCarbon: 1890, unit: 'kg CO₂-e/tonne' },
            'steel-structural-sections': { embodiedCarbon: 1750, unit: 'kg CO₂-e/tonne' },
            'steel-recycled': { embodiedCarbon: 690, unit: 'kg CO₂-e/tonne' },

            'timber-clt': { embodiedCarbon: 160, unit: 'kg CO₂-e/m³' }, // Low due to sequestration
            'timber-framing': { embodiedCarbon: 180, unit: 'kg CO₂-e/m³' },

            'masonry-brick': { embodiedCarbon: 0.55, unit: 'kg CO₂-e/brick' },
            'masonry-block-aac': { embodiedCarbon: 58, unit: 'kg CO₂-e/m²' },

            'insulation-glasswool': { embodiedCarbon: 3.8, unit: 'kg CO₂-e/m²' },
            'insulation-pir': { embodiedCarbon: 8.5, unit: 'kg CO₂-e/m²' },

            'glazing-single': { embodiedCarbon: 55, unit: 'kg CO₂-e/m²' },
            'glazing-double': { embodiedCarbon: 78, unit: 'kg CO₂-e/m²' },
            'glazing-triple': { embodiedCarbon: 99, unit: 'kg CO₂-e/m²' },

            'finishes-carpet': { embodiedCarbon: 19.2, unit: 'kg CO₂-e/m²' },
            'finishes-paint': { embodiedCarbon: 2.8, unit: 'kg CO₂-e/m²' },
            'finishes-plasterboard': { embodiedCarbon: 6.7, unit: 'kg CO₂-e/m²' }
        };

        // Apply any adjustment factor from the material (used in sensitivity analysis)
        const coefficient = coefficients[material.type] || { embodiedCarbon: 100, unit: 'kg CO₂-e/unit' };

        if (material.embodiedCarbonAdjustment) {
            coefficient.embodiedCarbon *= material.embodiedCarbonAdjustment;
        }

        return coefficient;
    }

    /**
     * Get recycling potential factor for material
     *
     * @param {Object} material - Material object
     * @returns {number} Recycling potential factor
     * @private
     */
    _getRecyclingPotential(material) {
        // Recycling potential factors for module D calculations
        const recyclingPotential = {
            'concrete': 0.15, // Concrete can be crushed and used as aggregate
            'steel': 0.85,    // Steel has high recycling rate
            'timber': 0.40,   // Timber can be reused or used for energy
            'masonry': 0.10,
            'insulation': 0.05,
            'glazing': 0.60,  // Glass recycling
            'finishes': 0.05
        };

        return recyclingPotential[material.category] || 0.10;
    }

    /**
     * Get benchmark values for different materials
     *
     * @param {string} category - Material category
     * @param {string} unit - Unit for benchmark
     * @returns {Object} Benchmark data
     * @private
     */
    _getBenchmark(category, unit) {
        // Australian benchmarks based on NCC/GBCA/NABERS data
        const benchmarks = {
            'concrete': {
                'kg CO₂-e/m³': {
                    low: 240,
                    average: 370,
                    high: 450
                }
            },
            'steel': {
                'kg CO₂-e/tonne': {
                    low: 800,
                    average: 1800,
                    high: 2400
                }
            },
            'timber': {
                'kg CO₂-e/m³': {
                    low: 150,
                    average: 250,
                    high: 350
                }
            },
            'insulation': {
                'kg CO₂-e/m²': {
                    low: 2.5,
                    average: 6.0,
                    high: 12.0
                }
            },
            'glazing': {
                'kg CO₂-e/m²': {
                    low: 55,
                    average: 85,
                    high: 120
                }
            },
            'finishes': {
                'kg CO₂-e/m²': {
                    low: 5,
                    average: 15,
                    high: 30
                }
            }
        };

        return benchmarks[category]?.[unit] || null;
    }
}

// If in Node.js environment, export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LCACalculator;
}