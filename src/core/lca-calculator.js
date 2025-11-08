/**
 * Life Cycle Assessment (LCA) Calculator
 *
 * Calculates the full life cycle environmental impacts of building materials
 * and projects, covering all stages (A1-D) with special focus on Australian context.
 *
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 2.0.0
 */

class LCACalculator {
    constructor(options = {}) {
        this.options = {
            projectLife: 50, // Default project lifespan in years
            includeSequestration: true, // Include carbon sequestration benefits
            includeModule_D: true, // Include end-of-life benefits/impacts
            databaseSource: 'embedded', // 'embedded', 'ec3', or 'custom'
            detailedBreakdown: true, // Provide detailed stage breakdown
            australianContext: true, // Apply Australian-specific factors
            ...options
        };

        // LCA stage factors (adjustments for each life cycle stage)
        this.stageFactors = this._initializeStageFactors();

        // Database connection (if not using embedded)
        this.materialsDatabase = null;
        if (options.materialsDatabase) {
            this.materialsDatabase = options.materialsDatabase;
        }

        console.log('LCA Calculator initialized with options:', this.options);
    }

    /**
     * Calculate full LCA for a material
     *
     * @param {Object} material - Material object with category, type, quantity
     * @param {Number} quantity - Material quantity (in appropriate units)
     * @param {Number} projectLife - Project lifespan in years
     * @returns {Object} - Full LCA results with stage breakdowns
     */
    calculateFullLCA(material, quantity, projectLife = this.options.projectLife) {
        // Get base carbon data for the material
        const carbonData = this._getMaterialCarbonData(material);

        if (!carbonData) {
            throw new Error(`No carbon data found for material: ${material.type}`);
        }

        // Calculate each life cycle stage
        const stageA = this._calculateStageA(carbonData, quantity);
        const stageB = this._calculateStageB(carbonData, quantity, projectLife);
        const stageC = this._calculateStageC(carbonData, quantity);
        const stageD = this.options.includeModule_D ?
            this._calculateStageD(carbonData, quantity) :
            { total: 0, subStages: {} };

        // Calculate sequestration benefit if applicable and enabled
        const sequestration = (this.options.includeSequestration && carbonData.biogenicStorage) ?
            carbonData.biogenicStorage * quantity :
            0;

        // Total up all stages
        const stageResults = {
            A: stageA,
            B: stageB,
            C: stageC,
            D: stageD
        };

        const embodiedCarbon = stageA.total + stageC.total;
        const operationalCarbon = stageB.total;
        const endOfLifeBenefits = stageD.total;

        const wholeLifeCarbon = embodiedCarbon + operationalCarbon + endOfLifeBenefits + sequestration;

        return {
            material: material.type,
            quantity: quantity,
            unit: carbonData.unit,
            stages: stageResults,
            totals: {
                embodiedCarbon: embodiedCarbon,
                operationalCarbon: operationalCarbon,
                endOfLifeBenefits: endOfLifeBenefits,
                sequestrationBenefit: sequestration,
                wholeLifeCarbon: wholeLifeCarbon
            },
            carbonIntensity: wholeLifeCarbon / quantity,
            projectLife: projectLife
        };
    }

    /**
     * Calculate LCA for multiple materials
     *
     * @param {Array} materials - Array of material objects
     * @param {Number} projectLife - Project lifespan in years
     * @returns {Object} - Aggregated LCA results
     */
    calculateMaterialsLCA(materials, projectLife = this.options.projectLife) {
        const results = [];
        let totalEmbodiedCarbon = 0;
        let totalOperationalCarbon = 0;
        let totalEndOfLifeBenefits = 0;
        let totalSequestrationBenefit = 0;
        let totalWholeLifeCarbon = 0;

        // Calculate LCA for each material
        for (const material of materials) {
            const materialLCA = this.calculateFullLCA(material, material.quantity, projectLife);
            results.push(materialLCA);

            // Aggregate totals
            totalEmbodiedCarbon += materialLCA.totals.embodiedCarbon;
            totalOperationalCarbon += materialLCA.totals.operationalCarbon;
            totalEndOfLifeBenefits += materialLCA.totals.endOfLifeBenefits;
            totalSequestrationBenefit += materialLCA.totals.sequestrationBenefit;
            totalWholeLifeCarbon += materialLCA.totals.wholeLifeCarbon;
        }

        // Group results by category
        const categorizedResults = this._categorizeMaterialResults(results);

        return {
            materials: results,
            categorized: categorizedResults,
            totals: {
                embodiedCarbon: totalEmbodiedCarbon,
                operationalCarbon: totalOperationalCarbon,
                endOfLifeBenefits: totalEndOfLifeBenefits,
                sequestrationBenefit: totalSequestrationBenefit,
                wholeLifeCarbon: totalWholeLifeCarbon
            },
            projectLife: projectLife
        };
    }

    /**
     * Categorize material results by material category
     */
    _categorizeMaterialResults(results) {
        const categorized = {};

        for (const result of results) {
            const material = result.material;
            const category = material.split('-')[0];

            if (!categorized[category]) {
                categorized[category] = {
                    materials: [],
                    embodiedCarbon: 0,
                    operationalCarbon: 0,
                    wholeLifeCarbon: 0,
                    sequestrationBenefit: 0
                };
            }

            categorized[category].materials.push(result);
            categorized[category].embodiedCarbon += result.totals.embodiedCarbon;
            categorized[category].operationalCarbon += result.totals.operationalCarbon;
            categorized[category].wholeLifeCarbon += result.totals.wholeLifeCarbon;
            categorized[category].sequestrationBenefit += result.totals.sequestrationBenefit;
        }

        return categorized;
    }

    /**
     * Get carbon data for a material
     */
    _getMaterialCarbonData(material) {
        if (this.materialsDatabase) {
            // Use external database if provided
            return this.materialsDatabase.getCarbonCoefficient(material.category, material.type);
        }

        // Use embedded data for demo/testing
        return this._getEmbeddedMaterialData(material);
    }

    /**
     * Get embedded material data (for demo/testing without external DB)
     */
    _getEmbeddedMaterialData(material) {
        const { category, type } = material;

        // Simulated material data when no database is connected
        const mockData = {
            'concrete-32mpa': { kgCO2e: 320, unit: 'kg CO₂e/m³' },
            'concrete-40mpa': { kgCO2e: 355, unit: 'kg CO₂e/m³' },
            'concrete-gpc-32mpa': { kgCO2e: 215, unit: 'kg CO₂e/m³' },
            'concrete-recycled-aggregate': { kgCO2e: 280, unit: 'kg CO₂e/m³' },
            'steel-reinforcing-bar': { kgCO2e: 1.55, unit: 'kg CO₂e/kg' },
            'steel-structural-sections': { kgCO2e: 1.65, unit: 'kg CO₂e/kg' },
            'steel-recycled': { kgCO2e: 0.95, unit: 'kg CO₂e/kg' },
            'timber-clt': { kgCO2e: 200, unit: 'kg CO₂e/m³', biogenicStorage: -750 },
            'timber-lvl': { kgCO2e: 280, unit: 'kg CO₂e/m³', biogenicStorage: -600 },
            'timber-glulam': { kgCO2e: 230, unit: 'kg CO₂e/m³', biogenicStorage: -680 },
            'block-concrete': { kgCO2e: 18, unit: 'kg CO₂e/m²' },
            'block-aac': { kgCO2e: 15, unit: 'kg CO₂e/m²' },
            'brick-clay': { kgCO2e: 22, unit: 'kg CO₂e/m²' },
            'insulation-glasswool': { kgCO2e: 3.5, unit: 'kg CO₂e/m²' },
            'insulation-rockwool': { kgCO2e: 4.2, unit: 'kg CO₂e/m²' },
            'insulation-xps': { kgCO2e: 8.5, unit: 'kg CO₂e/m²' },
            'glass-single-glazed': { kgCO2e: 45, unit: 'kg CO₂e/m²' },
            'glass-double-glazed': { kgCO2e: 65, unit: 'kg CO₂e/m²' },
            'window-aluminium': { kgCO2e: 120, unit: 'kg CO₂e/m²' },
            'window-timber': { kgCO2e: 35, unit: 'kg CO₂e/m²', biogenicStorage: -45 },
            'plasterboard': { kgCO2e: 4.2, unit: 'kg CO₂e/m²' },
            'carpet-nylon': { kgCO2e: 12.5, unit: 'kg CO₂e/m²' },
            'flooring-timber': { kgCO2e: 8.2, unit: 'kg CO₂e/m²', biogenicStorage: -15 }
        };

        return mockData[type];
    }

    /**
     * Calculate Stage A (Product stage + Construction Process stage)
     * A1-A3: Product stage (raw material extraction, transport, manufacturing)
     * A4-A5: Construction Process stage (transport to site, installation)
     */
    _calculateStageA(carbonData, quantity) {
        // Basic calculation: kgCO2e * quantity
        const baseCarbon = carbonData.kgCO2e * quantity;

        // Apply stage factors
        const stageFactors = this.stageFactors.A;

        // Calculate sub-stages
        const subStages = {
            A1: baseCarbon * stageFactors.A1,
            A2: baseCarbon * stageFactors.A2,
            A3: baseCarbon * stageFactors.A3,
            A4: baseCarbon * stageFactors.A4,
            A5: baseCarbon * stageFactors.A5
        };

        // Total for stage A
        const total = subStages.A1 + subStages.A2 + subStages.A3 + subStages.A4 + subStages.A5;

        return {
            total: total,
            subStages: subStages
        };
    }

    /**
     * Calculate Stage B (Use stage)
     * B1-B5: Use, maintenance, repair, replacement, refurbishment
     * B6-B7: Operational energy and water use
     */
    _calculateStageB(carbonData, quantity, projectLife) {
        // Basic rate per year (typically low for most materials)
        const annualRate = carbonData.kgCO2e * 0.005; // 0.5% of initial embodied carbon per year

        // Calculate B1-B5 based on material type and project life
        // This is a simplified model - real calculations would be more complex
        const subStages = {
            B1: annualRate * quantity * projectLife * this.stageFactors.B.B1,
            B2: annualRate * quantity * (projectLife / 2) * this.stageFactors.B.B2, // Maintenance every 2 years
            B3: annualRate * quantity * (projectLife / 10) * this.stageFactors.B.B3, // Repairs every 10 years
            B4: annualRate * quantity * (projectLife / 20) * this.stageFactors.B.B4, // Replacement every 20 years
            B5: annualRate * quantity * (projectLife / 15) * this.stageFactors.B.B5, // Refurb every 15 years
            B6: 0, // Operational energy (not material-specific)
            B7: 0  // Operational water (not material-specific)
        };

        // Total for stage B
        const total = subStages.B1 + subStages.B2 + subStages.B3 + subStages.B4 + subStages.B5;

        return {
            total: total,
            subStages: subStages
        };
    }

    /**
     * Calculate Stage C (End of life stage)
     * C1-C4: Demolition, transport, waste processing, disposal
     */
    _calculateStageC(carbonData, quantity) {
        // Basic calculation: typically 5-15% of initial embodied carbon
        const baseCarbon = carbonData.kgCO2e * quantity;

        // Apply stage factors
        const stageFactors = this.stageFactors.C;

        // Calculate sub-stages
        const subStages = {
            C1: baseCarbon * stageFactors.C1,
            C2: baseCarbon * stageFactors.C2,
            C3: baseCarbon * stageFactors.C3,
            C4: baseCarbon * stageFactors.C4
        };

        // Total for stage C
        const total = subStages.C1 + subStages.C2 + subStages.C3 + subStages.C4;

        return {
            total: total,
            subStages: subStages
        };
    }

    /**
     * Calculate Stage D (Benefits and loads beyond system boundary)
     * D: Reuse, recovery, recycling potential
     */
    _calculateStageD(carbonData, quantity) {
        // Materials with high recycling/reuse value have net benefits here
        let recyclingPotential = 0;

        // Different materials have different recycling/reuse potential
        switch (carbonData.type) {
            case 'steel-reinforcing-bar':
            case 'steel-structural-sections':
            case 'steel-recycled':
                recyclingPotential = -0.5; // 50% benefit from recycling
                break;
            case 'concrete-recycled-aggregate':
            case 'concrete-32mpa':
            case 'concrete-40mpa':
                recyclingPotential = -0.15; // 15% benefit from recycling as aggregate
                break;
            case 'timber-clt':
            case 'timber-lvl':
            case 'timber-glulam':
                recyclingPotential = -0.3; // 30% benefit from energy recovery
                break;
            default:
                recyclingPotential = -0.1; // Default 10% recovery benefit
        }

        // Apply stage factor
        const stageFactor = this.stageFactors.D.D1;

        // Calculate impact
        const impact = carbonData.kgCO2e * quantity * recyclingPotential * stageFactor;

        return {
            total: impact,
            subStages: {
                D1: impact
            }
        };
    }

    /**
     * Initialize stage factors for LCA calculation
     */
    _initializeStageFactors() {
        return {
            A: {
                A1: 0.6, // Raw material extraction
                A2: 0.1, // Transport to manufacturer
                A3: 0.2, // Manufacturing
                A4: 0.05, // Transport to site
                A5: 0.05  // Construction/installation
            },
            B: {
                B1: 0.1, // Use
                B2: 0.2, // Maintenance
                B3: 0.3, // Repair
                B4: 0.3, // Replacement
                B5: 0.1, // Refurbishment
                B6: 0.0, // Operational energy use
                B7: 0.0  // Operational water use
            },
            C: {
                C1: 0.2, // Demolition/deconstruction
                C2: 0.3, // Transport to waste processing
                C3: 0.2, // Waste processing
                C4: 0.3  // Disposal
            },
            D: {
                D1: 1.0  // Reuse, recovery, recycling potential
            }
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LCACalculator;
}
