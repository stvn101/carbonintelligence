// GHG Protocol Scopes Calculator API Utilities
import { emissionFactors } from '@/data/emissionFactors';
import { australianGridFactors } from '@/data/australianGridFactors';

/**
 * Calculate Scope 1 emissions from direct fuel combustion and vehicles
 */
export const calculateScope1 = (scope1Data) => {
    let totalEmissions = 0;
    const categories = {};

    // Stationary Combustion
    if (scope1Data.stationaryCombustion?.length > 0) {
        let fuelEmissions = 0;
        scope1Data.stationaryCombustion.forEach(item => {
            const factor = emissionFactors.fuels[item.fuelType] || 0;
            let emissions = 0;

            if (item.unit === 'liters') {
                emissions = item.quantity * factor;
            } else if (item.unit === 'GJ') {
                emissions = item.quantity * factor;
            }

            fuelEmissions += emissions;
        });
        categories['Stationary Combustion'] = fuelEmissions;
        totalEmissions += fuelEmissions;
    }

    // Mobile Combustion (Vehicles)
    if (scope1Data.mobileCombustion?.length > 0) {
        let vehicleEmissions = 0;
        scope1Data.mobileCombustion.forEach(item => {
            const vehicleFactors = emissionFactors.vehicles[item.vehicleType];
            if (vehicleFactors) {
                const factor = vehicleFactors[item.fuelType] || 0;
                const emissions = item.fuelConsumed * factor;
                vehicleEmissions += emissions;
            }
        });
        categories['Mobile Combustion'] = vehicleEmissions;
        totalEmissions += vehicleEmissions;
    }

    return {
        total: totalEmissions,
        categories: categories
    };
};

/**
 * Calculate Scope 2 emissions from purchased electricity
 */
export const calculateScope2 = (scope2Data, state = 'nsw') => {
    let totalEmissions = 0;
    const categories = {};

    if (scope2Data.electricity?.length > 0) {
        let electricityEmissions = 0;
        const gridFactor = australianGridFactors[state.toLowerCase()] || australianGridFactors.nsw;

        scope2Data.electricity.forEach(item => {
            const emissions = item.quantity * gridFactor;
            electricityEmissions += emissions;
        });

        categories['Purchased Electricity'] = electricityEmissions;
        totalEmissions += electricityEmissions;
    }

    return {
        total: totalEmissions,
        categories: categories
    };
};

/**
 * Calculate Scope 3 emissions from materials, transport, waste, and commuting
 */
export const calculateScope3 = (scope3Data) => {
    let totalEmissions = 0;
    const categories = {};

    // Materials
    if (scope3Data.materials?.length > 0) {
        let materialsEmissions = 0;
        scope3Data.materials.forEach(item => {
            const materialType = item.materialType;
            let factor = 0;

            // Find the emission factor from nested materials structure
            if (materialType.startsWith('concrete-')) {
                factor = emissionFactors.materials.concrete[materialType] || 0;
            } else if (materialType.startsWith('steel-')) {
                factor = emissionFactors.materials.steel[materialType] || 0;
            } else if (materialType.startsWith('timber-')) {
                factor = emissionFactors.materials.timber[materialType] || 0;
            } else if (materialType.startsWith('brick-') || materialType.startsWith('block-')) {
                factor = emissionFactors.materials.masonry[materialType] || 0;
            } else {
                // Search all material categories
                Object.values(emissionFactors.materials).forEach(category => {
                    if (category[materialType]) {
                        factor = category[materialType];
                    }
                });
            }

            let emissions = 0;
            if (item.unit === 'm3') {
                emissions = item.quantity * factor;
            } else if (item.unit === 'tonnes') {
                emissions = item.quantity * factor;
            } else if (item.unit === 'm2') {
                emissions = item.quantity * factor;
            } else if (item.unit === 'units') {
                emissions = item.quantity * factor / 1000; // Assume factor is per 1000 units
            }

            materialsEmissions += emissions;
        });
        categories['Materials'] = materialsEmissions;
        totalEmissions += materialsEmissions;
    }

    // Transport
    if (scope3Data.transport?.length > 0) {
        let transportEmissions = 0;
        scope3Data.transport.forEach(item => {
            const factor = emissionFactors.transport[item.transportMode] || 0;
            let emissions = 0;

            if (item.transportMode === 'freight' || item.transportMode === 'sea' ||
                item.transportMode === 'air' || item.transportMode === 'rail') {
                // tonne-km
                emissions = item.weight * item.distance * factor;
            } else {
                // vehicle-km
                emissions = item.distance * factor;
            }

            transportEmissions += emissions;
        });
        categories['Transport'] = transportEmissions;
        totalEmissions += transportEmissions;
    }

    // Waste
    if (scope3Data.waste?.length > 0) {
        let wasteEmissions = 0;
        scope3Data.waste.forEach(item => {
            const factor = emissionFactors.waste[item.wasteType] || 0;
            const emissions = item.quantity * factor;
            wasteEmissions += emissions;
        });
        categories['Waste'] = wasteEmissions;
        totalEmissions += wasteEmissions;
    }

    // Employee Commuting
    if (scope3Data.commuting?.length > 0) {
        let commutingEmissions = 0;
        scope3Data.commuting.forEach(item => {
            const factor = emissionFactors.commuting[item.transportMode] || 0;
            const emissions = item.employees * item.distance * item.workingDays * factor;
            commutingEmissions += emissions;
        });
        categories['Employee Commuting'] = commutingEmissions;
        totalEmissions += commutingEmissions;
    }

    return {
        total: totalEmissions,
        categories: categories
    };
};

/**
 * Calculate total emissions across all scopes
 */
export const calculateTotalEmissions = (scope1Data, scope2Data, scope3Data, state = 'nsw') => {
    const scope1 = calculateScope1(scope1Data);
    const scope2 = calculateScope2(scope2Data, state);
    const scope3 = calculateScope3(scope3Data);

    return {
        scope1: scope1,
        scope2: scope2,
        scope3: scope3,
        total: scope1.total + scope2.total + scope3.total
    };
};

/**
 * Generate CSV report of emissions data
 */
export const generateCSVReport = (results, projectInfo) => {
    let csv = 'GHG Protocol Scopes Calculator Report\n\n';
    csv += `Project: ${projectInfo.project}\n`;
    csv += `Location: ${projectInfo.location}\n`;
    csv += `Period: ${projectInfo.period}\n\n`;

    csv += 'Scope,Category,Emissions (kg CO₂-e)\n';

    // Scope 1
    Object.entries(results.scope1.categories).forEach(([category, value]) => {
        csv += `Scope 1,${category},${value.toFixed(2)}\n`;
    });
    csv += `Scope 1,Total,${results.scope1.total.toFixed(2)}\n\n`;

    // Scope 2
    Object.entries(results.scope2.categories).forEach(([category, value]) => {
        csv += `Scope 2,${category},${value.toFixed(2)}\n`;
    });
    csv += `Scope 2,Total,${results.scope2.total.toFixed(2)}\n\n`;

    // Scope 3
    Object.entries(results.scope3.categories).forEach(([category, value]) => {
        csv += `Scope 3,${category},${value.toFixed(2)}\n`;
    });
    csv += `Scope 3,Total,${results.scope3.total.toFixed(2)}\n\n`;

    csv += `Total Emissions,All Scopes,${results.total.toFixed(2)}\n`;

    return csv;
};
