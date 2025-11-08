/**
 * Materials Database
 *
 * Comprehensive database of construction materials with embodied carbon coefficients.
 * Provides accurate carbon data for Australian building materials with regional variations.
 *
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 2.0.0
 */

class MaterialsDatabase {
    constructor(options = {}) {
        this.options = {
            useEC3: true, // Use external EC3 database when available
            preferAustralian: true, // Prefer Australian EPDs when available
            cacheResults: true, // Cache results for performance
            ...options
        };

        // Initialize database
        this.materials = this._initializeMaterialsDatabase();

        // Cache for API calls
        this.cache = new Map();

        console.log('MaterialsDatabase initialized with options:', this.options);
    }

    /**
     * Get carbon coefficient for a specific material
     *
     * @param {string} category - Material category (concrete, steel, etc)
     * @param {string} type - Specific material type
     * @param {object} context - Additional context (state, region, etc)
     * @returns {object} Carbon coefficient data
     */
    async getCarbonCoefficient(category, type, context = {}) {
        const materialKey = `${category}-${type}`;

        // Check cache first if enabled
        if (this.options.cacheResults) {
            const cachedValue = this.cache.get(materialKey);
            if (cachedValue) {
                return {
                    ...cachedValue,
                    source: 'cache'
                };
            }
        }

        // Check local database
        const localData = this.materials[category]?.[type];

        // Try external API if enabled and not found locally
        if ((!localData || this.options.alwaysCheckExternal) && this.options.useEC3) {
            try {
                const externalData = await this._fetchExternalData(category, type, context);

                // Cache the result if enabled
                if (this.options.cacheResults) {
                    this.cache.set(materialKey, externalData);
                }

                return {
                    ...externalData,
                    source: 'EC3'
                };
            } catch (error) {
                console.warn(`Failed to fetch external data for ${materialKey}:`, error);

                // Fall back to local data if external fetch fails
                if (localData) {
                    return {
                        ...localData,
                        source: 'local'
                    };
                }

                throw new Error(`No carbon data available for ${materialKey}`);
            }
        }

        // Return local data with regional adjustments
        const adjustedData = this._applyRegionalAdjustments(localData, context);

        return {
            ...adjustedData,
            source: 'local'
        };
    }

    /**
     * Apply regional adjustments to material data
     */
    _applyRegionalAdjustments(materialData, context) {
        if (!materialData) return null;

        const { state, region } = context;

        let adjustedData = { ...materialData };

        // Apply state-specific adjustments
        if (state && this.regionalFactors[state]) {
            const stateFactor = this.regionalFactors[state];

            // Apply category adjustment if available
            if (stateFactor[materialData.category]) {
                adjustedData.kgCO2e *= stateFactor[materialData.category];
            }

            // Apply transport adjustment if available
            if (stateFactor.transport) {
                adjustedData.transportFactor = stateFactor.transport;
            }
        }

        // Apply region-specific adjustments
        if (region && this.regionalFactors.regions?.[region]) {
            const regionFactor = this.regionalFactors.regions[region];

            // Apply category adjustment if available
            if (regionFactor[materialData.category]) {
                adjustedData.kgCO2e *= regionFactor[materialData.category];
            }
        }

        return adjustedData;
    }

    /**
     * Fetch data from external source like EC3
     */
    async _fetchExternalData(category, type, context) {
        // Simulate API call to EC3 or other external database
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulated EC3 response
                const mockResponse = {
                    id: `ec3-${category}-${type}`,
                    category: category,
                    type: type,
                    name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    kgCO2e: this._getMockCarbonValue(category, type),
                    unit: this._getMockUnit(category),
                    source: 'EC3',
                    confidence: 0.95,
                    epdId: `EPD-${Math.floor(Math.random() * 10000)}`
                };

                resolve(mockResponse);
            }, 300); // Simulate network delay
        });
    }

    /**
     * Get mock carbon value for external API simulation
     */
    _getMockCarbonValue(category, type) {
        // Simulated values that make sense for each category
        const baselines = {
            concrete: 300,
            steel: 1500,
            timber: 150,
            masonry: 250,
            insulation: 5,
            glazing: 80,
            finishes: 10,
            metals: 1200
        };

        const baseline = baselines[category] || 100;

        // Generate a realistic variation based on the type
        // Low-carbon options will have lower values
        let multiplier = 1.0;
        if (type.includes('recycled')) multiplier = 0.6;
        if (type.includes('gpc')) multiplier = 0.65;
        if (type.includes('low-carbon')) multiplier = 0.7;
        if (type.includes('high')) multiplier = 1.2;

        return baseline * multiplier;
    }

    /**
     * Get mock unit for external API simulation
     */
    _getMockUnit(category) {
        const units = {
            concrete: 'kg CO₂e/m³',
            steel: 'kg CO₂e/tonne',
            timber: 'kg CO₂e/m³',
            masonry: 'kg CO₂e/m²',
            insulation: 'kg CO₂e/m²',
            glazing: 'kg CO₂e/m²',
            finishes: 'kg CO₂e/m²',
            metals: 'kg CO₂e/tonne'
        };

        return units[category] || 'kg CO₂e/unit';
    }

    /**
     * Initialize materials database with default values
     */
    _initializeMaterialsDatabase() {
        return {
            concrete: {
                'concrete-32mpa': {
                    id: 'concrete-32mpa',
                    name: 'Concrete 32 MPa',
                    category: 'concrete',
                    kgCO2e: 320,
                    unit: 'kg CO₂e/m³',
                    description: 'Standard 32 MPa concrete',
                    source: 'Australian EPD Register'
                },
                'concrete-40mpa': {
                    id: 'concrete-40mpa',
                    name: 'Concrete 40 MPa',
                    category: 'concrete',
                    kgCO2e: 355,
                    unit: 'kg CO₂e/m³',
                    description: 'High-strength 40 MPa concrete',
                    source: 'Australian EPD Register'
                },
                'concrete-gpc-32mpa': {
                    id: 'concrete-gpc-32mpa',
                    name: 'Geopolymer Concrete 32 MPa',
                    category: 'concrete',
                    kgCO2e: 215,
                    unit: 'kg CO₂e/m³',
                    description: 'Low carbon geopolymer concrete, 32 MPa',
                    source: 'Australian EPD Register'
                },
                'concrete-recycled-aggregate': {
                    id: 'concrete-recycled-aggregate',
                    name: 'Recycled Aggregate Concrete',
                    category: 'concrete',
                    kgCO2e: 280,
                    unit: 'kg CO₂e/m³',
                    description: 'Concrete with 30% recycled aggregate',
                    source: 'Australian EPD Register'
                }
            },
            steel: {
                'steel-reinforcing-bar': {
                    id: 'steel-reinforcing-bar',
                    name: 'Steel Reinforcing Bar',
                    category: 'steel',
                    kgCO2e: 1.55,
                    unit: 'kg CO₂e/kg',
                    description: 'Standard steel reinforcing bar (rebar)',
                    source: 'Australian EPD Register'
                },
                'steel-structural-sections': {
                    id: 'steel-structural-sections',
                    name: 'Steel Structural Sections',
                    category: 'steel',
                    kgCO2e: 1.65,
                    unit: 'kg CO₂e/kg',
                    description: 'Steel beams and columns',
                    source: 'Australian EPD Register'
                },
                'steel-recycled': {
                    id: 'steel-recycled',
                    name: 'Recycled Steel',
                    category: 'steel',
                    kgCO2e: 0.95,
                    unit: 'kg CO₂e/kg',
                    description: 'Steel with high recycled content',
                    source: 'Australian EPD Register'
                }
            },
            timber: {
                'timber-clt': {
                    id: 'timber-clt',
                    name: 'Cross Laminated Timber',
                    category: 'timber',
                    kgCO2e: 200,
                    unit: 'kg CO₂e/m³',
                    description: 'Cross laminated timber panels',
                    source: 'Australian EPD Register',
                    biogenicStorage: -750
                },
                'timber-lvl': {
                    id: 'timber-lvl',
                    name: 'Laminated Veneer Lumber',
                    category: 'timber',
                    kgCO2e: 280,
                    unit: 'kg CO₂e/m³',
                    description: 'Engineered wood product',
                    source: 'Australian EPD Register',
                    biogenicStorage: -600
                },
                'timber-glulam': {
                    id: 'timber-glulam',
                    name: 'Glued Laminated Timber',
                    category: 'timber',
                    kgCO2e: 230,
                    unit: 'kg CO₂e/m³',
                    description: 'Structural glued laminated timber',
                    source: 'Australian EPD Register',
                    biogenicStorage: -680
                }
            },
            masonry: {
                'block-concrete': {
                    id: 'block-concrete',
                    name: 'Concrete Block',
                    category: 'masonry',
                    kgCO2e: 18,
                    unit: 'kg CO₂e/m²',
                    description: 'Standard concrete masonry blocks',
                    source: 'Australian EPD Register'
                },
                'block-aac': {
                    id: 'block-aac',
                    name: 'Autoclaved Aerated Concrete Block',
                    category: 'masonry',
                    kgCO2e: 15,
                    unit: 'kg CO₂e/m²',
                    description: 'Lightweight AAC blocks',
                    source: 'Australian EPD Register'
                },
                'brick-clay': {
                    id: 'brick-clay',
                    name: 'Clay Brick',
                    category: 'masonry',
                    kgCO2e: 22,
                    unit: 'kg CO₂e/m²',
                    description: 'Standard clay brick',
                    source: 'Australian EPD Register'
                }
            },
            insulation: {
                'insulation-glasswool': {
                    id: 'insulation-glasswool',
                    name: 'Glass Wool Insulation',
                    category: 'insulation',
                    kgCO2e: 3.5,
                    unit: 'kg CO₂e/m²',
                    description: 'Standard glass wool insulation batts',
                    source: 'Australian EPD Register'
                },
                'insulation-rockwool': {
                    id: 'insulation-rockwool',
                    name: 'Rock Wool Insulation',
                    category: 'insulation',
                    kgCO2e: 4.2,
                    unit: 'kg CO₂e/m²',
                    description: 'Rock wool insulation batts',
                    source: 'Australian EPD Register'
                },
                'insulation-xps': {
                    id: 'insulation-xps',
                    name: 'Extruded Polystyrene Insulation',
                    category: 'insulation',
                    kgCO2e: 8.5,
                    unit: 'kg CO₂e/m²',
                    description: 'XPS rigid insulation panels',
                    source: 'Australian EPD Register'
                }
            },
            glazing: {
                'glass-single-glazed': {
                    id: 'glass-single-glazed',
                    name: 'Single Glazed Glass',
                    category: 'glazing',
                    kgCO2e: 45,
                    unit: 'kg CO₂e/m²',
                    description: 'Single glazed window glass',
                    source: 'Australian EPD Register'
                },
                'glass-double-glazed': {
                    id: 'glass-double-glazed',
                    name: 'Double Glazed Glass',
                    category: 'glazing',
                    kgCO2e: 65,
                    unit: 'kg CO₂e/m²',
                    description: 'Double glazed window glass',
                    source: 'Australian EPD Register'
                },
                'window-aluminium': {
                    id: 'window-aluminium',
                    name: 'Aluminium Window Frame',
                    category: 'glazing',
                    kgCO2e: 120,
                    unit: 'kg CO₂e/m²',
                    description: 'Aluminium window framing',
                    source: 'Australian EPD Register'
                },
                'window-timber': {
                    id: 'window-timber',
                    name: 'Timber Window Frame',
                    category: 'glazing',
                    kgCO2e: 35,
                    unit: 'kg CO₂e/m²',
                    description: 'Timber window framing',
                    source: 'Australian EPD Register',
                    biogenicStorage: -45
                }
            },
            finishes: {
                'plasterboard': {
                    id: 'plasterboard',
                    name: 'Plasterboard',
                    category: 'finishes',
                    kgCO2e: 4.2,
                    unit: 'kg CO₂e/m²',
                    description: 'Standard plasterboard lining',
                    source: 'Australian EPD Register'
                },
                'carpet-nylon': {
                    id: 'carpet-nylon',
                    name: 'Nylon Carpet',
                    category: 'finishes',
                    kgCO2e: 12.5,
                    unit: 'kg CO₂e/m²',
                    description: 'Nylon carpet flooring',
                    source: 'Australian EPD Register'
                },
                'flooring-timber': {
                    id: 'flooring-timber',
                    name: 'Timber Flooring',
                    category: 'finishes',
                    kgCO2e: 8.2,
                    unit: 'kg CO₂e/m²',
                    description: 'Timber flooring',
                    source: 'Australian EPD Register',
                    biogenicStorage: -15
                }
            }
        };
    }

    // Regional adjustment factors
    regionalFactors = {
        // State adjustments
        nsw: {
            concrete: 1.0,
            steel: 0.95,
            timber: 1.0,
            transport: 0.03
        },
        vic: {
            concrete: 1.05,
            steel: 1.0,
            timber: 1.1,
            transport: 0.06
        },
        qld: {
            concrete: 1.02,
            steel: 1.05,
            timber: 0.9,
            transport: 0.15
        },
        wa: {
            concrete: 1.1,
            steel: 1.15,
            timber: 1.05,
            transport: 0.25
        },
        sa: {
            concrete: 1.03,
            steel: 1.0,
            timber: 1.1,
            transport: 0.12
        },
        tas: {
            concrete: 1.05,
            steel: 1.05,
            timber: 0.9,
            transport: 0.2
        },
        act: {
            concrete: 1.0,
            steel: 0.95,
            timber: 1.0,
            transport: 0.05
        },
        nt: {
            concrete: 1.15,
            steel: 1.2,
            timber: 1.15,
            transport: 0.35
        },
        // Regional adjustments
        regions: {
            sydney: {
                concrete: 0.98,
                steel: 0.95,
                timber: 1.0
            },
            melbourne: {
                concrete: 1.0,
                steel: 0.98,
                timber: 1.05
            },
            brisbane: {
                concrete: 1.0,
                steel: 1.02,
                timber: 0.9
            },
            perth: {
                concrete: 1.05,
                steel: 1.1,
                timber: 1.0
            },
            adelaide: {
                concrete: 1.0,
                steel: 0.98,
                timber: 1.05
            },
            hobart: {
                concrete: 1.02,
                steel: 1.05,
                timber: 0.95
            },
            darwin: {
                concrete: 1.1,
                steel: 1.15,
                timber: 1.1
            }
        }
    };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaterialsDatabase;
}
