/**
 * CarbonIntelligence Integration Guide & Example
 * 
 * This demonstrates how to use the complete CarbonIntelligence system
 * to create the most comprehensive carbon calculation app ever built.
 * 
 * System Components:
 * 1. materials-database.js - Base materials with embodied carbon coefficients
 * 2. lca-calculator.js - Life Cycle Assessment (A1-D stages)
 * 3. scopes-calculator.js - GHG Protocol Scopes 1, 2, 3
 * 4. carbon-intelligence-core.js - Main integration engine
 * 5. carbon-intelligence-dashboard.js - Interactive visualizations
 * 
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 2.0.0
 */

// ============================================================================
// EXAMPLE 1: Basic Project Analysis
// ============================================================================

async function example1_BasicAnalysis() {
    console.log('=== EXAMPLE 1: Basic Project Analysis ===\n');
    
    // Initialize the core engine
    const carbonIntelligence = new CarbonIntelligenceCore({
        state: 'nsw',
        climateZone: 5, // NCC Climate Zone for Sydney
        projectLife: 50,
        useEC3: true,
        enableAI: true,
        optimizationLevel: 'aggressive'
    });

    // Define project data
    const projectData = {
        name: 'Green Office Tower',
        location: {
            state: 'nsw',
            city: 'Sydney',
            latitude: -33.8688,
            longitude: 151.2093
        },
        gfa: 5000, // m² Gross Floor Area
        buildingType: 'commercial',
        energyRating: 'good',
        
        // Materials list
        materials: [
            // Structural concrete
            {
                category: 'concrete',
                type: 'concrete-32mpa',
                quantity: 500, // m³
                description: 'Structural slabs and columns'
            },
            {
                category: 'concrete',
                type: 'concrete-gpc-32mpa',
                quantity: 200, // m³
                description: 'Non-structural elements (GPC used for carbon reduction)'
            },
            // Steel reinforcement
            {
                category: 'steel',
                type: 'steel-reinforcing-bar',
                quantity: 80, // tonnes
                description: 'Rebar'
            },
            {
                category: 'steel',
                type: 'steel-structural-sections',
                quantity: 120, // tonnes
                description: 'Structural steel frame'
            },
            // Timber elements
            {
                category: 'timber',
                type: 'timber-clt',
                quantity: 150, // m³
                description: 'CLT internal walls and floors'
            },
            // Masonry
            {
                category: 'masonry',
                type: 'block-aac',
                quantity: 1200, // m²
                description: 'AAC blocks for internal walls'
            },
            // Insulation
            {
                category: 'insulation',
                type: 'insulation-glasswool',
                quantity: 5000, // m²
                description: 'Wall and roof insulation'
            },
            // Glazing
            {
                category: 'glazing',
                type: 'glass-double-glazed',
                quantity: 800, // m²
                description: 'Double glazed windows'
            },
            {
                category: 'glazing',
                type: 'window-aluminium',
                quantity: 800, // m²
                description: 'Aluminium frames'
            },
            // Finishes
            {
                category: 'finishes',
                type: 'plasterboard',
                quantity: 8000, // m²
                description: 'Internal linings'
            },
            {
                category: 'finishes',
                type: 'carpet-nylon',
                quantity: 3000, // m²
                description: 'Carpet flooring'
            }
        ],
        
        // Construction logistics (for Scope 1 & 3)
        construction: {
            fuels: [
                { type: 'diesel', quantity: 5000, description: 'Excavators and generators' }
            ],
            vehicles: [
                { type: 'Light truck', fuelType: 'diesel', fuelUsed: 2000 }
            ]
        },
        
        // Waste management (Scope 3)
        waste: [
            { type: 'Mixed construction waste', quantity: 50000, disposalMethod: 'recycling' },
            { type: 'Non-recyclable', quantity: 20000, disposalMethod: 'landfill' }
        ]
    };

    // Run comprehensive analysis
    const results = await carbonIntelligence.calculateProject(projectData);
    
    // Display results
    console.log('PROJECT SUMMARY');
    console.log('==============');
    console.log(`Total Carbon Footprint: ${results.totalCarbon.wholeOfLife.toLocaleString()} tonnes CO₂-e`);
    console.log(`  - Embodied: ${results.totalCarbon.embodied.toLocaleString()} tonnes CO₂-e (${(results.totalCarbon.embodied/results.totalCarbon.wholeOfLife*100).toFixed(0)}%)`);
    console.log(`  - Operational (50yr): ${results.totalCarbon.operational.toLocaleString()} tonnes CO₂-e (${(results.totalCarbon.operational/results.totalCarbon.wholeOfLife*100).toFixed(0)}%)`);
    console.log();
    
    console.log(`Carbon Intensity: ${results.totalCarbon.perSquareMeter.total.toFixed(1)} kg CO₂-e/m² GFA`);
    console.log();
    
    console.log('COMPLIANCE STATUS');
    console.log('================');
    console.log(`NCC Section J: ${results.compliance.ncc.pass ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`NABERS Rating: ${results.compliance.nabers.energy.stars} stars (${results.compliance.nabers.energy.grade})`);
    console.log();
    
    console.log('OPTIMIZATION OPPORTUNITIES');
    console.log('=========================');
    console.log(`Total Potential Savings: ${results.optimizations.totalPotentialSavings.toLocaleString()} kg CO₂-e`);
    console.log(`Percentage Reduction: ${results.optimizations.savingsPercentage.toFixed(1)}%`);
    console.log();
    console.log('Top 3 Recommendations:');
    results.optimizations.recommendations.slice(0, 3).forEach((opt, i) => {
        console.log(`${i+1}. ${opt.title}`);
        console.log(`   Savings: ${(opt.carbonSavings/1000).toFixed(1)} tonnes CO₂-e`);
        console.log(`   Cost Impact: ${opt.costImpact}`);
        console.log();
    });
    
    return results;
}

// ============================================================================
// EXAMPLE 2: Material Comparison Analysis
// ============================================================================

function example2_MaterialComparison() {
    console.log('=== EXAMPLE 2: Material Comparison Analysis ===\n');
    
    // Compare different concrete options for 500m³ structural concrete
    const quantity = 500;
    const concreteOptions = [
        { id: 'concrete-32mpa', name: '32 MPa Standard Concrete' },
        { id: 'concrete-40mpa', name: '40 MPa High Strength' },
        { id: 'concrete-gpc-32mpa', name: '32 MPa Geopolymer (GPC)' },
        { id: 'concrete-recycled-aggregate', name: 'Concrete with 30% Recycled Aggregate' }
    ];
    
    console.log('CONCRETE OPTIONS COMPARISON');
    console.log('===========================');
    console.log(`Quantity: ${quantity}m³\n`);
    
    const lca = new LCACalculator();
    const results = [];
    
    concreteOptions.forEach(option => {
        const material = { category: 'concrete', type: option.id, quantity: quantity };
        const lcaResult = lca.calculateFullLCA(material, quantity, 50);
        
        results.push({
            name: option.name,
            embodiedCarbon: lcaResult.totals.embodiedCarbon,
            wholeLifeCarbon: lcaResult.totals.wholeLifeCarbon
        });
        
        console.log(`${option.name}:`);
        console.log(`  Embodied Carbon (A1-A5): ${lcaResult.totals.embodiedCarbon.toLocaleString()} kg CO₂-e`);
        console.log(`  Whole Life Carbon: ${lcaResult.totals.wholeLifeCarbon.toLocaleString()} kg CO₂-e`);
        console.log(`  Per m³: ${(lcaResult.totals.embodiedCarbon/quantity).toFixed(0)} kg CO₂-e/m³`);
        console.log();
    });
    
    // Calculate savings compared to standard concrete
    const baseline = results[0];
    console.log('CARBON SAVINGS vs Standard 32 MPa Concrete:');
    console.log('===========================================');
    results.slice(1).forEach(result => {
        const savings = baseline.embodiedCarbon - result.embodiedCarbon;
        const percentage = (savings / baseline.embodiedCarbon * 100).toFixed(1);
        console.log(`${result.name}: ${savings.toLocaleString()} kg CO₂-e saved (${percentage}%)`);
    });
    console.log();
    
    return results;
}

// ============================================================================
// EXAMPLE 3: Scope 1, 2, 3 Detailed Breakdown
// ============================================================================

function example3_ScopesBreakdown() {
    console.log('=== EXAMPLE 3: GHG Protocol Scopes Breakdown ===\n');
    
    const scopes = new ScopesCalculator();
    
    // Comprehensive scopes input
    const scopesInput = {
        scope1: {
            fuels: [
                { type: 'diesel', quantity: 5000, description: 'Site equipment' },
                { type: 'naturalGas', quantity: 1000, description: 'Site heating' }
            ],
            vehicles: [
                { type: 'Ute', fuelType: 'diesel', fuelUsed: 2000 },
                { type: 'Van', fuelType: 'petrol', fuelUsed: 1500 }
            ]
        },
        scope2: {
            electricity: { kwh: 1100000 } // Annual consumption
        },
        scope3: {
            // Materials (this would come from LCA calculation)
            materials: [
                { category: 'concrete', type: 'concrete-32mpa', quantity: 500 },
                { category: 'steel', type: 'steel-structural-sections', quantity: 120 }
            ],
            transport: [
                { type: 'heavyVehicle', distance: 50000, weight: 1000, description: 'Material delivery' }
            ],
            waste: [
                { type: 'Construction waste', quantity: 50000, disposalMethod: 'recycling' },
                { type: 'Non-recyclable', quantity: 20000, disposalMethod: 'landfill' }
            ],
            employeeCommuting: {
                employees: 50,
                totalKm: 250000 // Annual total
            }
        }
    };
    
    const results = scopes.calculateAllScopes(scopesInput, 'nsw');
    
    console.log('GHG PROTOCOL SCOPES SUMMARY');
    console.log('===========================');
    console.log(`Total Emissions: ${results.total.toLocaleString()} kg CO₂-e\n`);
    
    console.log(`SCOPE 1 (Direct): ${results.scope1.total.toLocaleString()} kg CO₂-e (${results.percentages.scope1.toFixed(1)}%)`);
    Object.entries(results.scope1.categories).forEach(([category, value]) => {
        console.log(`  - ${category}: ${value.toLocaleString()} kg CO₂-e`);
    });
    console.log();
    
    console.log(`SCOPE 2 (Energy): ${results.scope2.total.toLocaleString()} kg CO₂-e (${results.percentages.scope2.toFixed(1)}%)`);
    Object.entries(results.scope2.categories).forEach(([category, value]) => {
        console.log(`  - ${category}: ${value.toLocaleString()} kg CO₂-e`);
    });
    console.log();
    
    console.log(`SCOPE 3 (Value Chain): ${results.scope3.total.toLocaleString()} kg CO₂-e (${results.percentages.scope3.toFixed(1)}%)`);
    Object.entries(results.scope3.categories).forEach(([category, value]) => {
        console.log(`  - ${category}: ${value.toLocaleString()} kg CO₂-e`);
    });
    console.log();
    
    console.log(`Largest Contributor: ${results.summary.largestScope}`);
    console.log(`Materials Impact: ${(results.summary.materialsPercentage).toFixed(1)}% of total`);
    console.log();
    
    return results;
}

// ============================================================================
// EXAMPLE 4: Complete Dashboard Visualization
// ============================================================================

async function example4_DashboardVisualization() {
    console.log('=== EXAMPLE 4: Dashboard Visualization ===\n');
    
    // Run full analysis
    const carbonIntelligence = new CarbonIntelligenceCore({
        state: 'nsw',
        climateZone: 5,
        projectLife: 50,
        nabersTarget: 5.0
    });
    
    const projectData = {
        name: 'Sustainable Commercial Building',
        location: { state: 'nsw', city: 'Sydney' },
        gfa: 3000,
        buildingType: 'commercial',
        energyRating: 'excellent',
        materials: [
            { category: 'concrete', type: 'concrete-gpc-32mpa', quantity: 300 },
            { category: 'steel', type: 'steel-recycled', quantity: 60 },
            { category: 'timber', type: 'timber-clt', quantity: 100 },
            { category: 'insulation', type: 'insulation-glasswool', quantity: 3000 },
            { category: 'glazing', type: 'glass-double-glazed', quantity: 500 }
        ],
        construction: {
            fuels: [{ type: 'diesel', quantity: 3000 }],
            vehicles: [{ type: 'Truck', fuelType: 'diesel', fuelUsed: 1500 }]
        },
        waste: [
            { type: 'Recyclable', quantity: 30000, disposalMethod: 'recycling' }
        ]
    };
    
    const results = await carbonIntelligence.calculateProject(projectData);
    
    console.log('Dashboard data ready for visualization...');
    console.log('Initialize dashboard with:');
    console.log(`const dashboard = new CarbonIntelligenceDashboard('dashboard-container', 'professional');`);
    console.log(`await dashboard.render(results);`);
    console.log();
    
    // In a real application, you would:
    // const dashboard = new CarbonIntelligenceDashboard('dashboard-container', 'professional');
    // await dashboard.render(results);
    
    return results;
}

// ============================================================================
// EXAMPLE 5: NCC Section J Compliance Check
// ============================================================================

function example5_NCCCompliance() {
    console.log('=== EXAMPLE 5: NCC Section J Compliance ===\n');
    
    const carbonIntelligence = new CarbonIntelligenceCore({
        state: 'vic',
        climateZone: 6, // Melbourne
        nccCompliance: true
    });
    
    // This would normally be part of a full analysis
    // but we'll demonstrate the compliance checking logic
    
    console.log('NCC 2022 Section J Requirements:');
    console.log('================================');
    console.log('J1.2 Building Fabric: Thermal insulation requirements');
    console.log('J1.3 Glazing: SHGC and U-value limits');
    console.log('J1.5 Building Sealing: Air tightness standards');
    console.log('J1.6 Lighting: Maximum lighting power density');
    console.log('J5 Embodied Carbon: Whole-of-building limits (commercial)');
    console.log();
    
    console.log('Compliance Strategy:');
    console.log('1. Use high-performance insulation (R-values above minimum)');
    console.log('2. Specify low-SHGC glazing for climate zone');
    console.log('3. Implement comprehensive air sealing details');
    console.log('4. LED lighting throughout with daylight integration');
    console.log('5. Use low-carbon materials to meet J5 limits');
    console.log();
}

// ============================================================================
// EXAMPLE 6: AI-Powered Optimization Demo
// ============================================================================

function example6_AIOptimization() {
    console.log('=== EXAMPLE 6: AI-Powered Optimization ===\n');
    
    console.log('AI Optimization Strategies:');
    console.log('==========================\n');
    
    console.log('1. MATERIAL SUBSTITUTION');
    console.log('   AI analyzes embodied carbon and suggests:');
    console.log('   - Replace 32 MPa concrete → GPC concrete (60% reduction)');
    console.log('   - Replace virgin steel → Recycled steel (75% reduction)');
    console.log('   - Add CLT timber elements (carbon sequestration)');
    console.log();
    
    console.log('2. DESIGN OPTIMIZATION');
    console.log('   AI evaluates building orientation, glazing, and fabric:');
    console.log('   - Optimize window-to-wall ratio by facade');
    console.log('   - Recommend enhanced insulation zones');
    console.log('   - Suggest shading devices for solar control');
    console.log();
    
    console.log('3. SYSTEM OPTIMIZATION');
    console.log('   AI models operational performance:');
    console.log('   - Right-size HVAC for actual loads');
    console.log('   - Optimize control strategies');
    console.log('   - Integrate renewable energy systems');
    console.log();
    
    console.log('4. CONSTRUCTION OPTIMIZATION');
    console.log('   AI improves construction process:');
    console.log('   - Optimize delivery schedules (reduce transport)');
    console.log('   - Minimize waste through prefabrication');
    console.log('   - Recommend local material sourcing');
    console.log();
    
    console.log('Expected Outcomes:');
    console.log('- 30-50% embodied carbon reduction');
    console.log('- 20-40% operational carbon reduction');
    console.log('- Cost-neutral or cost-positive solutions');
    console.log('- Improved NCC & NABERS compliance');
    console.log();
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║        CARBONINTELLIGENCE INTEGRATION EXAMPLES             ║');
    console.log('║                                                            ║');
    console.log('║   The Most Comprehensive Carbon Calculation System         ║');
    console.log('║   Built by Steven Jenkins @ CarbonConstruct                ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n');
    
    try {
        // Run examples sequentially
        await example1_BasicAnalysis();
        console.log('\n' + '='.repeat(60) + '\n');
        
        example2_MaterialComparison();
        console.log('\n' + '='.repeat(60) + '\n');
        
        example3_ScopesBreakdown();
        console.log('\n' + '='.repeat(60) + '\n');
        
        await example4_DashboardVisualization();
        console.log('\n' + '='.repeat(60) + '\n');
        
        example5_NCCCompliance();
        console.log('\n' + '='.repeat(60) + '\n');
        
        example6_AIOptimization();
        
        console.log('\n');
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                                                            ║');
        console.log('║              ALL EXAMPLES COMPLETED SUCCESSFULLY            ║');
        console.log('║                                                            ║');
        console.log('║  Ready to exceed OneClickLCA and ETool standards!          ║');
        console.log('║                                                            ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log('\n');
        
    } catch (error) {
        console.error('Error running examples:', error);
    }
}

// ============================================================================
// HTML INTEGRATION TEMPLATE
// ============================================================================

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CarbonIntelligence - Comprehensive Carbon Analysis</title>
    
    <!-- Load Chart.js for visualizations -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
    
    <!-- Load our modules -->
    <script src="materials-database.js"></script>
    <script src="lca-calculator.js"></script>
    <script src="scopes-calculator.js"></script>
    <script src="carbon-intelligence-core.js"></script>
    <script src="carbon-intelligence-dashboard.js"></script>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #F5F5F5;
            padding: 2rem;
        }
        
        #app-container {
            max-width: 1400px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div id="app-container">
        <div id="dashboard-container"></div>
    </div>
    
    <script>
        // Initialize and run analysis
        async function initializeApp() {
            // Create core engine
            const carbonIntelligence = new CarbonIntelligenceCore({
                state: 'nsw',
                climateZone: 5,
                projectLife: 50,
                nabersTarget: 5.0
            });
            
            // Define project (this would come from user input)
            const projectData = {
                name: 'Your Project Name',
                location: { state: 'nsw', city: 'Sydney' },
                gfa: 5000,
                buildingType: 'commercial',
                materials: [
                    // Add your materials here
                ]
            };
            
            // Run analysis
            const results = await carbonIntelligence.calculateProject(projectData);
            
            // Create and render dashboard
            const dashboard = new CarbonIntelligenceDashboard(
                'dashboard-container',
                'professional'
            );
            await dashboard.render(results);
        }
        
        // Start the app
        initializeApp().catch(console.error);
    </script>
</body>
</html>
`;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        example1_BasicAnalysis,
        example2_MaterialComparison,
        example3_ScopesBreakdown,
        example4_DashboardVisualization,
        example5_NCCCompliance,
        example6_AIOptimization,
        runAllExamples,
        htmlTemplate
    };
}

console.log('CarbonIntelligence Integration Guide Loaded ✓');
console.log('Run: runAllExamples() to see the system in action');
