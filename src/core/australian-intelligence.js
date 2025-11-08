/**
 * Australian Intelligence Overlay for CarbonIntelligence
 *
 * This module provides Australia-specific overlays for carbon calculations including:
 * 1. Climate zone mapping and adjustments
 * 2. Regional transport penalties
 * 3. Local supplier mapping
 * 4. Australian building code compliance (NCC Section J)
 * 5. NABERS rating adjustments
 * 6. Regional material availability
 * 
 * @author Climate Science Expert
 * @company CarbonConstruct
 * @version 2.0.0
 */

// ============================================================================
// CLIMATE ZONE MAPPING (National Construction Code)
// ============================================================================

const climateZones = {
    // Zone 1: Hot humid summer, warm winter
    1: {
        description: "Hot humid summer, warm winter",
        locations: ["darwin", "cairns", "townsville", "broome"],
        requirements: {
            insulationRoof: 4.1,
            insulationWalls: 3.3,
            windowsMaxUValue: 6.3,
            windowsMaxSHGC: 0.43,
            cycloneRating: true,
            airSealingRequirement: "Medium",
            thermalMassRecommendation: "Low"
        }
    },

    // Zone 2: Warm humid summer, mild winter
    2: {
        description: "Warm humid summer, mild winter",
        locations: ["brisbane", "gold coast", "sunshine coast", "coffs harbour"],
        requirements: {
            insulationRoof: 3.8,
            insulationWalls: 2.8,
            windowsMaxUValue: 5.7,
            windowsMaxSHGC: 0.57,
            cycloneRating: true,
            airSealingRequirement: "Medium",
            thermalMassRecommendation: "Medium"
        }
    },

    // Zone 3: Hot dry summer, warm winter
    3: {
        description: "Hot dry summer, warm winter",
        locations: ["alice springs", "longreach", "mount isa", "tennant creek"],
        requirements: {
            insulationRoof: 4.2,
            insulationWalls: 2.4,
            windowsMaxUValue: 5.7,
            windowsMaxSHGC: 0.51,
            cycloneRating: false,
            airSealingRequirement: "Medium",
            thermalMassRecommendation: "High"
        }
    },

    // Zone 4: Hot dry summer, cool winter
    4: {
        description: "Hot dry summer, cool winter",
        locations: ["dubbo", "wagga wagga", "mildura", "griffith"],
        requirements: {
            insulationRoof: 4.2,
            insulationWalls: 2.6,
            windowsMaxUValue: 4.3,
            windowsMaxSHGC: 0.57,
            cycloneRating: false,
            airSealingRequirement: "High",
            thermalMassRecommendation: "High"
        }
    },

    // Zone 5: Warm temperate
    5: {
        description: "Warm temperate",
        locations: ["sydney", "newcastle", "wollongong", "adelaide"],
        requirements: {
            insulationRoof: 4.2,
            insulationWalls: 2.8,
            windowsMaxUValue: 4.3,
            windowsMaxSHGC: 0.69,
            bushfireRating: true,
            airSealingRequirement: "Medium",
            thermalMassRecommendation: "Medium"
        }
    },

    // Zone 6: Mild temperate
    6: {
        description: "Mild temperate",
        locations: ["melbourne", "ballarat", "launceston", "mount gambier"],
        requirements: {
            insulationRoof: 4.8,
            insulationWalls: 3.3,
            windowsMaxUValue: 3.3,
            windowsMaxSHGC: 0.69,
            bushfireRating: true,
            airSealingRequirement: "High",
            thermalMassRecommendation: "High"
        }
    },

    // Zone 7: Cool temperate
    7: {
        description: "Cool temperate",
        locations: ["canberra", "orange", "katoomba", "armidale"],
        requirements: {
            insulationRoof: 5.1,
            insulationWalls: 3.8,
            windowsMaxUValue: 2.9,
            windowsMaxSHGC: 0.69,
            bushfireRating: true,
            airSealingRequirement: "Very High",
            thermalMassRecommendation: "Medium"
        }
    },

    // Zone 8: Alpine
    8: {
        description: "Cold temperate / Alpine",
        locations: ["thredbo", "falls creek", "mount hotham", "cradle mountain"],
        requirements: {
            insulationRoof: 6.3,
            insulationWalls: 4.8,
            windowsMaxUValue: 2.5,
            windowsMaxSHGC: 0.69,
            airSealingRequirement: "Very High",
            condensationManagement: true,
            thermalMassRecommendation: "Medium"
        }
    }
};

// ============================================================================
// CITY TO CLIMATE ZONE MAPPING
// ============================================================================

const cityToClimateZone = {
    // NSW
    "sydney": 5,
    "newcastle": 5,
    "wollongong": 5,
    "coffs harbour": 2,
    "wagga wagga": 4,
    "albury": 4,
    "dubbo": 4,
    "tamworth": 4,
    "broken hill": 4,
    "armidale": 7,
    "griffith": 4,
    "katoomba": 7,
    "batemans bay": 6,
    "thredbo": 8,

    // VIC
    "melbourne": 6,
    "geelong": 6,
    "ballarat": 6,
    "bendigo": 6,
    "wodonga": 6,
    "mildura": 4,
    "warrnambool": 6,
    "traralgon": 6,
    "falls creek": 8,
    "mount hotham": 8,

    // QLD
    "brisbane": 2,
    "gold coast": 2,
    "sunshine coast": 2,
    "cairns": 1,
    "townsville": 1,
    "mackay": 2,
    "rockhampton": 2,
    "toowoomba": 4,
    "mount isa": 3,
    "longreach": 3,

    // SA
    "adelaide": 5,
    "mount gambier": 6,
    "whyalla": 4,
    "port augusta": 4,
    "port lincoln": 5,
    "victor harbor": 5,

    // WA
    "perth": 5,
    "bunbury": 5,
    "albany": 6,
    "geraldton": 5,
    "kalgoorlie": 4,
    "broome": 1,
    "karratha": 1,

    // TAS
    "hobart": 7,
    "launceston": 6,
    "devonport": 7,
    "burnie": 7,
    "cradle mountain": 8,

    // NT
    "darwin": 1,
    "alice springs": 3,
    "katherine": 1,
    "tennant creek": 3,

    // ACT
    "canberra": 7
};

// ============================================================================
// STATE-SPECIFIC ENERGY GRID FACTORS
// ============================================================================

const stateEnergyFactors = {
    // Electricity grid emission factors (kg CO2-e/kWh)
    electricity: {
        nsw: 0.81,   // New South Wales
        vic: 0.98,   // Victoria (higher due to brown coal)
        qld: 0.79,   // Queensland
        sa: 0.32,    // South Australia (lower due to renewables)
        wa: 0.69,    // Western Australia
        tas: 0.15,   // Tasmania (very low due to hydro)
        nt: 0.54,    // Northern Territory
        act: 0.81    // Australian Capital Territory (uses NSW grid)
    },

    // Gas emission factors (kg CO2-e/GJ)
    gas: {
        nsw: 51.53,
        vic: 51.53,
        qld: 51.53,
        sa: 51.53,
        wa: 51.53,
        tas: 51.53,
        nt: 51.53,
        act: 51.53
    },

    // Renewable energy penetration (percentage)
    renewablePenetration: {
        nsw: 26.8,
        vic: 29.4,
        qld: 22.5,
        sa: 68.3,
        wa: 30.2,
        tas: 95.6,
        nt: 16.0,
        act: 100.0  // Target (purchases 100% renewable)
    },

    // Marginal abatement cost by state ($/tonne CO2-e)
    marginalAbatementCost: {
        nsw: 65,
        vic: 72,
        qld: 58,
        sa: 48,
        wa: 62,
        tas: 40,
        nt: 75,
        act: 65
    }
};

// ============================================================================
// REGIONAL TRANSPORT PENALTIES
// ============================================================================

const transportPenalties = {
    // State-specific transport distance penalties
    states: {
        nsw: { steel: 0.05, concrete: 4.0, timber: 0.03, masonry: 0.09, insulation: 0.02, glass: 0.04 },
        vic: { steel: 0.06, concrete: 4.2, timber: 0.04, masonry: 0.10, insulation: 0.02, glass: 0.05 },
        qld: { steel: 0.07, concrete: 4.5, timber: 0.02, masonry: 0.08, insulation: 0.03, glass: 0.05 },
        sa: { steel: 0.08, concrete: 5.0, timber: 0.05, masonry: 0.12, insulation: 0.03, glass: 0.06 },
        wa: { steel: 0.12, concrete: 5.5, timber: 0.06, masonry: 0.14, insulation: 0.04, glass: 0.08 },
        tas: { steel: 0.14, concrete: 6.0, timber: 0.04, masonry: 0.15, insulation: 0.05, glass: 0.09 },
        nt: { steel: 0.18, concrete: 7.0, timber: 0.08, masonry: 0.18, insulation: 0.06, glass: 0.10 },
        act: { steel: 0.06, concrete: 4.2, timber: 0.04, masonry: 0.10, insulation: 0.02, glass: 0.05 }
    },

    // City-specific transport penalties (more granular)
    cities: {
        sydney: { steel: 0.03, concrete: 4.0, timber: 0.02, masonry: 0.08, insulation: 0.01, glass: 0.03 },
        melbourne: { steel: 0.06, concrete: 4.2, timber: 0.04, masonry: 0.10, insulation: 0.02, glass: 0.05 },
        brisbane: { steel: 0.05, concrete: 4.3, timber: 0.02, masonry: 0.08, insulation: 0.02, glass: 0.04 },
        perth: { steel: 0.12, concrete: 5.3, timber: 0.06, masonry: 0.13, insulation: 0.04, glass: 0.08 },
        adelaide: { steel: 0.08, concrete: 4.8, timber: 0.05, masonry: 0.12, insulation: 0.03, glass: 0.06 },
        hobart: { steel: 0.14, concrete: 6.0, timber: 0.04, masonry: 0.15, insulation: 0.05, glass: 0.09 },
        darwin: { steel: 0.18, concrete: 6.8, timber: 0.08, masonry: 0.17, insulation: 0.06, glass: 0.10 },
        canberra: { steel: 0.06, concrete: 4.2, timber: 0.04, masonry: 0.10, insulation: 0.02, glass: 0.05 },

        // Regional cities
        newcastle: { steel: 0.03, concrete: 3.8, timber: 0.02, masonry: 0.07, insulation: 0.01, glass: 0.03 },
        wollongong: { steel: 0.02, concrete: 3.7, timber: 0.02, masonry: 0.07, insulation: 0.01, glass: 0.03 },
        geelong: { steel: 0.05, concrete: 4.0, timber: 0.03, masonry: 0.09, insulation: 0.02, glass: 0.04 },
        gold_coast: { steel: 0.05, concrete: 4.2, timber: 0.02, masonry: 0.08, insulation: 0.02, glass: 0.04 },
        townsville: { steel: 0.09, concrete: 5.0, timber: 0.04, masonry: 0.10, insulation: 0.03, glass: 0.06 },
        cairns: { steel: 0.10, concrete: 5.2, timber: 0.04, masonry: 0.11, insulation: 0.03, glass: 0.06 },
        toowoomba: { steel: 0.07, concrete: 4.5, timber: 0.03, masonry: 0.09, insulation: 0.02, glass: 0.05 },
        ballarat: { steel: 0.07, concrete: 4.4, timber: 0.04, masonry: 0.10, insulation: 0.02, glass: 0.05 },
        bendigo: { steel: 0.07, concrete: 4.4, timber: 0.04, masonry: 0.10, insulation: 0.02, glass: 0.05 },
        launceston: { steel: 0.12, concrete: 5.8, timber: 0.04, masonry: 0.14, insulation: 0.04, glass: 0.08 }
    }
};

// ============================================================================
// LOCAL SUPPLIER MAPPING
// ============================================================================

const supplierMapping = {
    // CONCRETE SUPPLIERS
    "concrete-32mpa": {
        nsw: ["Boral Sydney", "Hanson Sydney", "Holcim Sydney"],
        vic: ["Boral Melbourne", "Hanson Melbourne", "Holcim Melbourne"],
        qld: ["Boral Brisbane", "Hanson Brisbane", "Holcim Brisbane", "Wagners Toowoomba"],
        sa: ["Boral Adelaide", "Hanson Adelaide", "Holcim Adelaide"],
        wa: ["Boral Perth", "Hanson Perth", "Holcim Perth", "BGC Concrete"],
        tas: ["Boral Hobart", "Hanson Hobart", "Holcim Hobart"],
        nt: ["Boral Darwin", "Holcim Darwin"],
        act: ["Boral Canberra", "Hanson Canberra", "Holcim Canberra"]
    },

    "concrete-40mpa": {
        nsw: ["Boral Sydney", "Hanson Sydney", "Holcim Sydney"],
        vic: ["Boral Melbourne", "Hanson Melbourne", "Holcim Melbourne"],
        qld: ["Boral Brisbane", "Hanson Brisbane", "Holcim Brisbane", "Wagners Toowoomba"],
        sa: ["Boral Adelaide", "Hanson Adelaide", "Holcim Adelaide"],
        wa: ["Boral Perth", "Hanson Perth", "Holcim Perth", "BGC Concrete"],
        tas: ["Boral Hobart", "Hanson Hobart", "Holcim Hobart"],
        nt: ["Boral Darwin", "Holcim Darwin"],
        act: ["Boral Canberra", "Hanson Canberra", "Holcim Canberra"]
    },

    "concrete-gpc-32mpa": {
        qld: ["Wagners Toowoomba", "Wagners Brisbane"],
        nsw: ["Boral Sydney", "Concrete Grinding Solutions"],
        vic: ["Boral Melbourne", "EFC Green Concrete"],
        sa: ["GreenCon SA"],
        wa: ["BGC GPC Concrete", "Boral Perth"],
        tas: [],  // Limited availability
        nt: [],   // Limited availability
        act: ["Boral Canberra"]
    },

    "concrete-recycled-aggregate": {
        nsw: ["Boral Sydney", "Concrete Recyclers", "Benedict Recycled"],
        vic: ["Boral Melbourne", "Alex Fraser Group", "Repurpose It"],
        qld: ["Boral Brisbane", "NuCrush", "Brisbane Recycled Concrete"],
        sa: ["Boral Adelaide", "Southern Waste ResourceCo"],
        wa: ["Boral Perth", "Capital Recycling"],
        tas: ["Boral Hobart", "Spectran Group"],
        nt: ["Boral Darwin"],
        act: ["Boral Canberra", "ACT Recycling"]
    },

    // STEEL SUPPLIERS
    "steel-reinforcing-bar": {
        nsw: ["InfraBuild Sydney", "Liberty OneSteel", "Southern Steel", "Australian Reinforcing Company"],
        vic: ["InfraBuild Melbourne", "Liberty OneSteel", "BRC Victoria"],
        qld: ["InfraBuild Brisbane", "Liberty OneSteel", "OneSteel Reinforcing"],
        sa: ["InfraBuild Adelaide", "Liberty OneSteel", "Best Bar Adelaide"],
        wa: ["InfraBuild Perth", "Liberty OneSteel", "Best Bar Perth"],
        tas: ["InfraBuild Hobart", "Liberty OneSteel"],
        nt: ["InfraBuild Darwin", "OneSteel NT"],
        act: ["Liberty OneSteel", "Southern Steel ACT"]
    },

    "steel-structural-sections": {
        nsw: ["InfraBuild Sydney", "Liberty OneSteel", "BlueScope Distribution", "Southern Steel"],
        vic: ["InfraBuild Melbourne", "Liberty OneSteel", "BlueScope Distribution"],
        qld: ["InfraBuild Brisbane", "Liberty OneSteel", "BlueScope Distribution"],
        sa: ["InfraBuild Adelaide", "Liberty OneSteel", "BlueScope Distribution"],
        wa: ["InfraBuild Perth", "Liberty OneSteel", "BlueScope Distribution"],
        tas: ["InfraBuild Hobart", "Liberty OneSteel"],
        nt: ["InfraBuild Darwin", "OneSteel NT"],
        act: ["Liberty OneSteel", "Southern Steel ACT"]
    },

    "steel-recycled": {
        nsw: ["InfraBuild Sydney", "Liberty Recycling", "Sims Metal Management"],
        vic: ["InfraBuild Melbourne", "Liberty Recycling", "Sims Metal Management"],
        qld: ["InfraBuild Brisbane", "Liberty Recycling", "Sims Metal Management"],
        sa: ["InfraBuild Adelaide", "Liberty Recycling", "Sims Metal Management"],
        wa: ["InfraBuild Perth", "Liberty Recycling", "Sims Metal Management"],
        tas: ["InfraBuild Hobart", "Liberty Recycling"],
        nt: ["OneSteel NT", "Sims Metal Management"],
        act: ["Liberty Recycling", "Sims Metal Management"]
    },

    // TIMBER SUPPLIERS
    "timber-clt": {
        nsw: ["XLam Australia", "Strongbuild", "Timberlink"],
        vic: ["XLam Australia", "Australian Sustainable Hardwoods", "Hyne Timber"],
        qld: ["Hyne Timber", "Timbertruss"],
        sa: ["XLam Australia", "Timberlink"],
        wa: ["Wesbeam", "Timberlink"],
        tas: ["XLam Australia", "Tasmanian Timber"],
        nt: ["Limited local supply", "Imported from eastern states"],
        act: ["XLam Australia", "Timber Traders ACT"]
    },

    "timber-framing": {
        nsw: ["ITI Australia", "Hyne Timber", "Bunnings Commercial", "Boral Timber"],
        vic: ["ITI Australia", "Hyne Timber", "Carter Holt Harvey", "Bunnings Commercial"],
        qld: ["Hyne Timber", "Bunnings Commercial", "Carter Holt Harvey"],
        sa: ["Timberlink", "Bunnings Commercial"],
        wa: ["Wesbeam", "Wespine", "Bunnings Commercial"],
        tas: ["Timberlink", "Tasmanian Timber", "Bunnings Commercial"],
        nt: ["Bunnings Commercial", "Imported from QLD"],
        act: ["ITI Australia", "Bunnings Commercial"]
    },

    // MASONRY SUPPLIERS
    "block-aac": {
        nsw: ["CSR Hebel", "BigRiver Building Products", "Baines Masonry"],
        vic: ["CSR Hebel", "Integra Lightweight Concrete"],
        qld: ["CSR Hebel", "Brickworks Building Products"],
        sa: ["CSR Hebel", "PGH Bricks & Pavers"],
        wa: ["CSR Hebel", "BGC Masonry"],
        tas: ["CSR Hebel", "Island Block & Paving"],
        nt: ["CSR Hebel"],
        act: ["CSR Hebel", "PGH Bricks & Pavers"]
    },

    // INSULATION SUPPLIERS
    "insulation-glasswool": {
        nsw: ["CSR Bradford", "Fletcher Insulation", "Knauf Insulation"],
        vic: ["CSR Bradford", "Fletcher Insulation", "Knauf Insulation"],
        qld: ["CSR Bradford", "Fletcher Insulation", "Knauf Insulation"],
        sa: ["CSR Bradford", "Fletcher Insulation", "Knauf Insulation"],
        wa: ["CSR Bradford", "Fletcher Insulation", "Knauf Insulation"],
        tas: ["CSR Bradford", "Fletcher Insulation"],
        nt: ["CSR Bradford", "Fletcher Insulation"],
        act: ["CSR Bradford", "Fletcher Insulation", "Knauf Insulation"]
    },

    // GLAZING SUPPLIERS
    "glass-double-glazed": {
        nsw: ["Viridian Glass", "G.James Glass & Aluminium", "Jeld-Wen Australia"],
        vic: ["Viridian Glass", "G.James Glass & Aluminium", "Jeld-Wen Australia"],
        qld: ["G.James Glass & Aluminium", "Viridian Glass", "Jeld-Wen Australia"],
        sa: ["Viridian Glass", "G.James Glass & Aluminium"],
        wa: ["Viridian Glass", "G.James Glass & Aluminium"],
        tas: ["Viridian Glass", "Jeld-Wen Australia"],
        nt: ["G.James Glass & Aluminium"],
        act: ["Viridian Glass", "G.James Glass & Aluminium"]
    }
};

// ============================================================================
// CLIMATE ADJUSTMENT FACTORS
// ============================================================================

const climateAdjustments = {
    sydney: {
        insulationMultiplier: 1.2,
        bushfireRating: true,
        cycloneRating: false,
        thermalMass: "Medium",
        glareControl: "Medium",
        naturalVentilation: "High"
    },
    
    melbourne: {
        insulationMultiplier: 1.4,
        bushfireRating: true,
        cycloneRating: false,
        thermalMass: "High",
        glareControl: "Low",
        naturalVentilation: "Medium"
    },
    
    brisbane: {
        insulationMultiplier: 1.0,
        bushfireRating: true,
        cycloneRating: true,
        thermalMass: "Low",
        glareControl: "High",
        naturalVentilation: "High"
    },
    
    perth: {
        insulationMultiplier: 1.3,
        bushfireRating: true,
        cycloneRating: false,
        thermalMass: "Medium",
        glareControl: "High",
        naturalVentilation: "Medium"
    },
    
    adelaide: {
        insulationMultiplier: 1.3,
        bushfireRating: true,
        cycloneRating: false,
        thermalMass: "Medium",
        glareControl: "Medium",
        naturalVentilation: "Medium"
    },
    
    hobart: {
        insulationMultiplier: 1.6,
        bushfireRating: true,
        cycloneRating: false,
        thermalMass: "High",
        glareControl: "Low",
        naturalVentilation: "Low"
    },
    
    darwin: {
        insulationMultiplier: 0.8,
        bushfireRating: false,
        cycloneRating: true,
        thermalMass: "Very Low",
        glareControl: "Very High",
        naturalVentilation: "Very High"
    },
    
    canberra: {
        insulationMultiplier: 1.5,
        bushfireRating: true,
        cycloneRating: false,
        thermalMass: "High",
        glareControl: "Medium",
        naturalVentilation: "Low"
    },
    
    goldcoast: {
        insulationMultiplier: 1.0,
        bushfireRating: true,
        cycloneRating: true,
        thermalMass: "Low",
        glareControl: "High",
        naturalVentilation: "High"
    },
    
    cairns: {
        insulationMultiplier: 0.8,
        bushfireRating: false,
        cycloneRating: true,
        thermalMass: "Very Low",
        glareControl: "Very High",
        naturalVentilation: "Very High"
    },
    
    alicesprings: {
        insulationMultiplier: 1.2,
        bushfireRating: true,
        cycloneRating: false,
        thermalMass: "Very High",
        glareControl: "High",
        naturalVentilation: "Low"
    }
};

// ============================================================================
// NCC COMPLIANCE FUNCTIONS
// ============================================================================

/**
 * Check if a building meets NCC Section J requirements
 * @param {Object} buildingData - Building specifications
 * @param {number} climateZone - NCC Climate Zone (1-8)
 * @returns {Object} - Compliance results
 */
function checkNCCCompliance(buildingData, climateZone) {
    const zoneRequirements = climateZones[climateZone]?.requirements || {};
    
    // Initialize results
    const results = {
        pass: true,
        sections: {
            J1_2: true,  // Building fabric
            J1_3: true,  // Glazing
            J1_5: true,  // Building sealing
            J1_6: true,  // Lighting
            J5: true     // Embodied carbon (new addition)
        },
        details: {
            J1_2: {},
            J1_3: {},
            J1_5: {},
            J1_6: {},
            J5: {}
        },
        recommendations: []
    };
    
    // Check J1.2 Building Fabric (insulation, thermal mass)
    if (buildingData.insulation && zoneRequirements.insulationRoof) {
        if (buildingData.insulation.roof < zoneRequirements.insulationRoof) {
            results.sections.J1_2 = false;
            results.pass = false;
            results.details.J1_2.roof = {
                required: zoneRequirements.insulationRoof,
                provided: buildingData.insulation.roof,
                pass: false
            };
            results.recommendations.push({
                section: "J1.2",
                title: "Increase roof insulation",
                description: `Increase roof insulation from R${buildingData.insulation.roof} to minimum R${zoneRequirements.insulationRoof}`
            });
        }
        
        if (buildingData.insulation.walls < zoneRequirements.insulationWalls) {
            results.sections.J1_2 = false;
            results.pass = false;
            results.details.J1_2.walls = {
                required: zoneRequirements.insulationWalls,
                provided: buildingData.insulation.walls,
                pass: false
            };
            results.recommendations.push({
                section: "J1.2",
                title: "Increase wall insulation",
                description: `Increase wall insulation from R${buildingData.insulation.walls} to minimum R${zoneRequirements.insulationWalls}`
            });
        }
    }
    
    // Check J1.3 Glazing (U-value, SHGC)
    if (buildingData.glazing && zoneRequirements.windowsMaxUValue) {
        if (buildingData.glazing.uValue > zoneRequirements.windowsMaxUValue) {
            results.sections.J1_3 = false;
            results.pass = false;
            results.details.J1_3.uValue = {
                required: zoneRequirements.windowsMaxUValue,
                provided: buildingData.glazing.uValue,
                pass: false
            };
            results.recommendations.push({
                section: "J1.3",
                title: "Improve glazing thermal performance",
                description: `Reduce glazing U-Value from ${buildingData.glazing.uValue} to maximum ${zoneRequirements.windowsMaxUValue} W/m²K`
            });
        }
        
        if (buildingData.glazing.shgc > zoneRequirements.windowsMaxSHGC) {
            results.sections.J1_3 = false;
            results.pass = false;
            results.details.J1_3.shgc = {
                required: zoneRequirements.windowsMaxSHGC,
                provided: buildingData.glazing.shgc,
                pass: false
            };
            results.recommendations.push({
                section: "J1.3",
                title: "Reduce solar heat gain through glazing",
                description: `Reduce glazing SHGC from ${buildingData.glazing.shgc} to maximum ${zoneRequirements.windowsMaxSHGC}`
            });
        }
    }
    
    // Check J1.5 Building Sealing (air infiltration)
    if (buildingData.airLeakage && zoneRequirements.airSealingRequirement) {
        const requiredAirTightness = convertAirSealingRequirementToValue(zoneRequirements.airSealingRequirement);
        
        if (buildingData.airLeakage > requiredAirTightness) {
            results.sections.J1_5 = false;
            results.pass = false;
            results.details.J1_5.airLeakage = {
                required: requiredAirTightness,
                provided: buildingData.airLeakage,
                pass: false
            };
            results.recommendations.push({
                section: "J1.5",
                title: "Improve building air sealing",
                description: `Reduce air leakage from ${buildingData.airLeakage} ACH to maximum ${requiredAirTightness} ACH`
            });
        }
    }
    
    // Check J1.6 Lighting (maximum power density)
    if (buildingData.lighting && buildingData.lighting.powerDensity) {
        // Determine building type and appropriate lighting density
        const maxPowerDensity = getLightingPowerDensity(buildingData.buildingType);
        
        if (buildingData.lighting.powerDensity > maxPowerDensity) {
            results.sections.J1_6 = false;
            results.pass = false;
            results.details.J1_6.powerDensity = {
                required: maxPowerDensity,
                provided: buildingData.lighting.powerDensity,
                pass: false
            };
            results.recommendations.push({
                section: "J1.6",
                title: "Reduce lighting power density",
                description: `Reduce lighting power density from ${buildingData.lighting.powerDensity} W/m² to maximum ${maxPowerDensity} W/m²`
            });
        }
    }
    
    // Check J5 Embodied Carbon (new section introduced in NCC 2022)
    if (buildingData.embodiedCarbon && buildingData.gfa) {
        // Determine building type and appropriate embodied carbon limit
        const maxEmbodiedCarbon = getEmbodiedCarbonLimit(buildingData.buildingType);
        const calculatedEmbodiedCarbon = buildingData.embodiedCarbon / buildingData.gfa; // kg CO2-e per m²
        
        if (calculatedEmbodiedCarbon > maxEmbodiedCarbon) {
            results.sections.J5 = false;
            results.pass = false;
            results.details.J5.embodiedCarbon = {
                required: maxEmbodiedCarbon,
                provided: calculatedEmbodiedCarbon,
                pass: false
            };
            results.recommendations.push({
                section: "J5",
                title: "Reduce embodied carbon",
                description: `Reduce embodied carbon from ${calculatedEmbodiedCarbon.toFixed(1)} kg CO₂-e/m² to maximum ${maxEmbodiedCarbon} kg CO₂-e/m²`
            });
        }
    }
    
    // Calculate overall compliance
    results.pass = Object.values(results.sections).every(section => section === true);
    
    return results;
}

/**
 * Convert air sealing requirement text to numerical value
 * @param {string} requirement - Air sealing requirement (Very Low to Very High)
 * @returns {number} - Air changes per hour (ACH) at 50 Pa pressure difference
 */
function convertAirSealingRequirementToValue(requirement) {
    const mapping = {
        "Very Low": 10,
        "Low": 8,
        "Medium": 6,
        "High": 4,
        "Very High": 3
    };
    
    return mapping[requirement] || 6; // Default to Medium if not found
}

/**
 * Get lighting power density limits based on building type
 * @param {string} buildingType - Type of building
 * @returns {number} - Maximum lighting power density (W/m²)
 */
function getLightingPowerDensity(buildingType) {
    const mapping = {
        "office": 4.5,
        "retail": 14,
        "commercial": 5,
        "healthcare": 8,
        "educational": 6,
        "industrial": 4,
        "warehouse": 3,
        "residential": 5,
        "mixed": 7
    };
    
    return mapping[buildingType.toLowerCase()] || 7; // Default to mixed if not found
}

/**
 * Get embodied carbon limits based on building type (NCC 2022 Section J5)
 * @param {string} buildingType - Type of building
 * @returns {number} - Maximum embodied carbon (kg CO2-e/m²)
 */
function getEmbodiedCarbonLimit(buildingType) {
    const mapping = {
        "office": 800,
        "retail": 850,
        "commercial": 800,
        "healthcare": 900,
        "educational": 780,
        "industrial": 600,
        "warehouse": 500,
        "residential": 750,
        "mixed": 800
    };
    
    return mapping[buildingType.toLowerCase()] || 800; // Default to commercial if not found
}

// ============================================================================
// NABERS CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate NABERS rating based on energy consumption and building type
 * @param {Object} buildingData - Building specifications and energy data
 * @param {string} state - Australian state abbreviation (nsw, vic, etc.)
 * @returns {Object} - NABERS rating results
 */
function calculateNABERSRating(buildingData, state) {
    // Validate inputs
    if (!buildingData || !buildingData.gfa || !buildingData.energyConsumption) {
        return {
            stars: 0,
            grade: 'Not Rated',
            error: 'Insufficient data for NABERS calculation'
        };
    }
    
    // Get energy consumption in MJ/m² per annum
    const energyConsumption = {
        electricity: (buildingData.energyConsumption.electricity || 0) * 3.6 / buildingData.gfa, // kWh to MJ conversion
        gas: (buildingData.energyConsumption.gas || 0) / buildingData.gfa
    };
    
    // Calculate greenhouse gas emissions using state-specific factors
    const electricityFactor = stateEnergyFactors.electricity[state.toLowerCase()] || stateEnergyFactors.electricity.nsw;
    const gasFactor = stateEnergyFactors.gas[state.toLowerCase()] || stateEnergyFactors.gas.nsw;
    
    const ghgEmissions = {
        electricity: energyConsumption.electricity / 3.6 * electricityFactor, // Convert back to kWh for calculation
        gas: energyConsumption.gas * gasFactor / 1000 // Convert to tonnes CO₂-e
    };
    
    const totalEmissions = ghgEmissions.electricity + ghgEmissions.gas;
    const emissionsPerM2 = totalEmissions;
    
    // Get NABERS benchmark for building type
    const nabersBenchmark = getNABERSBenchmark(buildingData.buildingType);
    
    // Calculate rating
    let stars = 0;
    
    if (emissionsPerM2 <= nabersBenchmark['6star']) {
        stars = 6;
    } else if (emissionsPerM2 <= nabersBenchmark['5.5star']) {
        stars = 5.5;
    } else if (emissionsPerM2 <= nabersBenchmark['5star']) {
        stars = 5;
    } else if (emissionsPerM2 <= nabersBenchmark['4.5star']) {
        stars = 4.5;
    } else if (emissionsPerM2 <= nabersBenchmark['4star']) {
        stars = 4;
    } else if (emissionsPerM2 <= nabersBenchmark['3.5star']) {
        stars = 3.5;
    } else if (emissionsPerM2 <= nabersBenchmark['3star']) {
        stars = 3;
    } else if (emissionsPerM2 <= nabersBenchmark['2.5star']) {
        stars = 2.5;
    } else if (emissionsPerM2 <= nabersBenchmark['2star']) {
        stars = 2;
    } else if (emissionsPerM2 <= nabersBenchmark['1.5star']) {
        stars = 1.5;
    } else if (emissionsPerM2 <= nabersBenchmark['1star']) {
        stars = 1;
    } else {
        stars = 0;
    }
    
    // Determine grade
    let grade = '';
    if (stars >= 6) {
        grade = 'Market Leading';
    } else if (stars >= 5) {
        grade = 'Excellent';
    } else if (stars >= 4) {
        grade = 'Good';
    } else if (stars >= 3) {
        grade = 'Average';
    } else if (stars >= 2) {
        grade = 'Below Average';
    } else if (stars >= 1) {
        grade = 'Poor';
    } else {
        grade = 'Very Poor';
    }
    
    // Prepare recommendations for improvement
    const recommendations = [];
    
    if (stars < 6) {
        // Calculate how much energy reduction needed for next star rating
        let nextStarTarget = 0;
        
        if (stars === 0) {
            nextStarTarget = nabersBenchmark['1star'];
        } else if (stars === 5.5) {
            nextStarTarget = nabersBenchmark['6star'];
        } else {
            nextStarTarget = nabersBenchmark[`${stars + 0.5}star`];
        }
        
        const reductionNeeded = emissionsPerM2 - nextStarTarget;
        const percentageReduction = (reductionNeeded / emissionsPerM2) * 100;
        
        recommendations.push({
            title: `Improve NABERS rating to ${stars + 0.5} stars`,
            description: `Reduce emissions by ${percentageReduction.toFixed(1)}% (${reductionNeeded.toFixed(1)} kg CO₂-e/m²)`
        });
        
        // Specific recommendations based on consumption profile
        if (ghgEmissions.electricity > ghgEmissions.gas) {
            recommendations.push({
                title: 'Reduce electricity consumption',
                description: 'Focus on HVAC efficiency, LED lighting, and smart controls'
            });
        } else {
            recommendations.push({
                title: 'Reduce gas consumption',
                description: 'Improve heating efficiency and explore electric alternatives'
            });
        }
        
        recommendations.push({
            title: 'Consider renewable energy',
            description: 'Installing solar PV can significantly improve your NABERS rating'
        });
    }
    
    return {
        stars,
        grade,
        emissions: {
            total: totalEmissions,
            perM2: emissionsPerM2,
            breakdown: {
                electricity: ghgEmissions.electricity,
                gas: ghgEmissions.gas
            }
        },
        benchmark: nabersBenchmark,
        recommendations
    };
}

/**
 * Get NABERS benchmarks for different building types
 * @param {string} buildingType - Type of building
 * @returns {Object} - Emission benchmarks for each star rating (kg CO₂-e/m²)
 */
function getNABERSBenchmark(buildingType) {
    // Simplified benchmarks for common building types
    const benchmarks = {
        'office': {
            '1star': 139,
            '1.5star': 127,
            '2star': 115,
            '2.5star': 103,
            '3star': 91,
            '3.5star': 79,
            '4star': 67,
            '4.5star': 55,
            '5star': 43,
            '5.5star': 31,
            '6star': 22
        },
        'retail': {
            '1star': 210,
            '1.5star': 192,
            '2star': 175,
            '2.5star': 158,
            '3star': 140,
            '3.5star': 123,
            '4star': 105,
            '4.5star': 88,
            '5star': 70,
            '5.5star': 53,
            '6star': 35
        },
        'shopping_centre': {
            '1star': 310,
            '1.5star': 281,
            '2star': 252,
            '2.5star': 223,
            '3star': 193,
            '3.5star': 164,
            '4star': 135,
            '4.5star': 106,
            '5star': 76,
            '5.5star': 56,
            '6star': 42
        },
        'hotel': {
            '1star': 180,
            '1.5star': 165,
            '2star': 150,
            '2.5star': 135,
            '3star': 120,
            '3.5star': 105,
            '4star': 90,
            '4.5star': 75,
            '5star': 60,
            '5.5star': 45,
            '6star': 30
        },
        'data_centre': {
            '1star': 800,
            '1.5star': 720,
            '2star': 640,
            '2.5star': 560,
            '3star': 480,
            '3.5star': 400,
            '4star': 320,
            '4.5star': 240,
            '5star': 160,
            '5.5star': 115,
            '6star': 80
        },
        'apartment': {
            '1star': 120,
            '1.5star': 108,
            '2star': 96,
            '2.5star': 84,
            '3star': 72,
            '3.5star': 60,
            '4star': 48,
            '4.5star': 36,
            '5star': 24,
            '5.5star': 18,
            '6star': 12
        }
    };
    
    // Normalize building type input
    const normalizedType = buildingType.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    // Return benchmark for the specified building type, or office as default
    return benchmarks[normalizedType] || benchmarks['office'];
}

// ============================================================================
// AUSTRALIAN INTELLIGENCE OVERLAY MAIN FUNCTIONS
// ============================================================================

/**
 * Apply Australian intelligence overlay to a material
 * @param {Object} baseData - Base material data
 * @param {string} material - Material type identifier
 * @param {string} location - Project location (city or state)
 * @returns {Object} - Adjusted material data with Australian context
 */
function applyAustralianContext(baseData, material, location) {
    if (!baseData || !material || !location) {
        return baseData; // Return original data if inputs are invalid
    }
    
    // Normalize location to lowercase
    const normalizedLocation = location.toLowerCase().replace(/[^a-z]/g, '');
    
    // Get state from location if it's a city
    const state = getStateFromLocation(normalizedLocation);
    
    // Get climate factors
    const climate = climateAdjustments[normalizedLocation] || 
                   climateAdjustments[state] || 
                   { insulationMultiplier: 1.0 };
    
    // Get transport penalty based on material type
    let transportPenalty = 0;
    let materialCategory = '';
    
    if (material.includes('concrete') || material.includes('cement')) {
        materialCategory = 'concrete';
    } else if (material.includes('steel') || material.includes('rebar')) {
        materialCategory = 'steel';
    } else if (material.includes('timber') || material.includes('wood')) {
        materialCategory = 'timber';
    } else if (material.includes('brick') || material.includes('block') || material.includes('masonry')) {
        materialCategory = 'masonry';
    } else if (material.includes('insulation')) {
        materialCategory = 'insulation';
    } else if (material.includes('glass') || material.includes('window')) {
        materialCategory = 'glass';
    }
    
    // Apply city-specific transport penalty if available, otherwise use state-level
    if (transportPenalties.cities[normalizedLocation] && 
        transportPenalties.cities[normalizedLocation][materialCategory]) {
        transportPenalty = transportPenalties.cities[normalizedLocation][materialCategory];
    } else if (state && transportPenalties.states[state] && 
               transportPenalties.states[state][materialCategory]) {
        transportPenalty = transportPenalties.states[state][materialCategory];
    }
    
    // Get local suppliers
    const suppliers = supplierMapping[material]?.[state] || ["Generic Supplier"];
    
    // Calculate adjusted carbon rate with transport penalty
    const adjustedCarbon = baseData.carbonRate + transportPenalty;
    
    // Apply climate zone adjustments for certain materials
    let climateAdjusted = adjustedCarbon;
    
    if (materialCategory === 'insulation' && climate.insulationMultiplier) {
        // Performance adjustment based on climate requirements
        climateAdjusted = adjustedCarbon * climate.insulationMultiplier;
    }
    
    return {
        ...baseData,
        adjustedCarbon: climateAdjusted,
        transportPenalty,
        suppliers,
        climateFactors: climate,
        australianContext: true,
        state,
        climateZone: getClimateZone(normalizedLocation)
    };
}

/**
 * Get climate zone number based on location
 * @param {string} location - Project location (city)
 * @returns {number} - NCC Climate Zone (1-8)
 */
function getClimateZone(location) {
    const normalizedLocation = location.toLowerCase().replace(/[^a-z]/g, '');
    
    // Direct mapping from city to climate zone
    return cityToClimateZone[normalizedLocation] || 
           // Search in climate zones locations
           Object.entries(climateZones).find(([_, data]) => 
               data.locations.includes(normalizedLocation)
           )?.[0] || 5; // Default to Zone 5 if not found
}

/**
 * Get state abbreviation from location
 * @param {string} location - Project location (city)
 * @returns {string} - State abbreviation (nsw, vic, etc.)
 */
function getStateFromLocation(location) {
    // Check if location is already a state code
    if (['nsw', 'vic', 'qld', 'sa', 'wa', 'tas', 'nt', 'act'].includes(location)) {
        return location;
    }
    
    // City to state mapping
    const cityToState = {
        // NSW
        'sydney': 'nsw',
        'newcastle': 'nsw',
        'wollongong': 'nsw',
        'coffsharbour': 'nsw',
        'waggawagga': 'nsw',
        'albury': 'nsw',
        'dubbo': 'nsw',
        'tamworth': 'nsw',
        'brokenhill': 'nsw',
        'armidale': 'nsw',
        'griffith': 'nsw',
        'katoomba': 'nsw',
        'batemansbay': 'nsw',
        'thredbo': 'nsw',
        
        // VIC
        'melbourne': 'vic',
        'geelong': 'vic',
        'ballarat': 'vic',
        'bendigo': 'vic',
        'wodonga': 'vic',
        'mildura': 'vic',
        'warrnambool': 'vic',
        'traralgon': 'vic',
        'fallscreek': 'vic',
        'mounthotham': 'vic',
        
        // QLD
        'brisbane': 'qld',
        'goldcoast': 'qld',
        'sunshinecoast': 'qld',
        'cairns': 'qld',
        'townsville': 'qld',
        'mackay': 'qld',
        'rockhampton': 'qld',
        'toowoomba': 'qld',
        'mountisa': 'qld',
        'longreach': 'qld',
        
        // SA
        'adelaide': 'sa',
        'mountgambier': 'sa',
        'whyalla': 'sa',
        'portaugusta': 'sa',
        'portlincoln': 'sa',
        'victorharbor': 'sa',
        
        // WA
        'perth': 'wa',
        'bunbury': 'wa',
        'albany': 'wa',
        'geraldton': 'wa',
        'kalgoorlie': 'wa',
        'broome': 'wa',
        'karratha': 'wa',
        
        // TAS
        'hobart': 'tas',
        'launceston': 'tas',
        'devonport': 'tas',
        'burnie': 'tas',
        'cradlemountain': 'tas',
        
        // NT
        'darwin': 'nt',
        'alicesprings': 'nt',
        'katherine': 'nt',
        'tennantcreek': 'nt',
        
        // ACT
        'canberra': 'act'
    };
    
    return cityToState[location] || 'nsw'; // Default to NSW if not found
}

// ============================================================================
// BATCH PROCESSING FOR MULTIPLE MATERIALS
// ============================================================================

/**
 * Process multiple materials with Australian intelligence overlay
 * @param {Array} materials - Array of material IDs to process
 * @param {string} location - Project location (city or state)
 * @returns {Promise<Array>} - Array of adjusted material data with Australian context
 */
async function batchProcess(materials, location) {
    const results = [];
    
    // Process in batches of 3 for optimized API efficiency
    for (let i = 0; i < materials.length; i += 3) {
        const batch = materials.slice(i, i + 3);
        
        // Process batch in parallel
        const batchPromises = batch.map(async (material) => {
            const baseData = await getCachedOrFetch(material);
            return applyAustralianContext(baseData, material, location);
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
    }
    
    return results;
}

/**
 * Get cached material data or fetch from EC3/EPD database
 * @param {string} material - Material type identifier
 * @param {number} maxAge - Maximum cache age in milliseconds
 * @returns {Promise<Object>} - Material carbon data
 */
async function getCachedOrFetch(material, maxAge = 24 * 60 * 60 * 1000) {
    // Note: This is a placeholder for the actual implementation
    // In a real application, this would check a cache and make API calls
    
    // Simplified mock data for demonstration
    const mockData = {
        "concrete-32mpa": { carbonRate: 365, unit: "kg/m³", confidence: 0.95, epd_id: "EC3_CONC_001" },
        "concrete-40mpa": { carbonRate: 395, unit: "kg/m³", confidence: 0.95, epd_id: "EC3_CONC_002" },
        "concrete-gpc-32mpa": { carbonRate: 146, unit: "kg/m³", confidence: 0.92, epd_id: "EC3_CONC_003" },
        "concrete-recycled-aggregate": { carbonRate: 292, unit: "kg/m³", confidence: 0.90, epd_id: "EC3_CONC_004" },
        "steel-reinforcing-bar": { carbonRate: 1.65, unit: "kg/kg", confidence: 0.98, epd_id: "EC3_STEEL_001" },
        "steel-structural-sections": { carbonRate: 1.55, unit: "kg/kg", confidence: 0.98, epd_id: "EC3_STEEL_002" },
        "steel-recycled": { carbonRate: 0.42, unit: "kg/kg", confidence: 0.92, epd_id: "EC3_STEEL_003" },
        "timber-clt": { carbonRate: 0.32, unit: "kg/kg", confidence: 0.90, epd_id: "EC3_TIMBER_001" },
        "timber-framing": { carbonRate: 0.35, unit: "kg/kg", confidence: 0.88, epd_id: "EC3_TIMBER_002" },
        "block-aac": { carbonRate: 0.22, unit: "kg/each", confidence: 0.92, epd_id: "EC3_BRICK_001" },
        "insulation-glasswool": { carbonRate: 1.1, unit: "kg/m²", confidence: 0.90, epd_id: "EC3_INSUL_001" },
        "glass-double-glazed": { carbonRate: 27.5, unit: "kg/m²", confidence: 0.93, epd_id: "EC3_GLASS_001" },
        "window-aluminium": { carbonRate: 12.3, unit: "kg/m²", confidence: 0.91, epd_id: "EC3_ALUM_001" }
    };
    
    return mockData[material] || { carbonRate: 2.5, unit: "kg/unit", confidence: 0.75, epd_id: "EC3_GENERIC_001" };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    // Main functions
    applyAustralianContext,
    batchProcess,
    checkNCCCompliance,
    calculateNABERSRating,
    getClimateZone,
    
    // Data
    climateZones,
    cityToClimateZone,
    stateEnergyFactors,
    transportPenalties,
    supplierMapping,
    climateAdjustments
};