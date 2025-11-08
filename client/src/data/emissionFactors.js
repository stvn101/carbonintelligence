// Emission Factors for GHG Protocol Scopes Calculator
// Based on Australian National Greenhouse Accounts Factors and industry standards

export const emissionFactors = {
    // Scope 1: Direct Emissions
    fuels: {
        diesel: 2.68,          // kg CO₂-e per liter
        petrol: 2.31,          // kg CO₂-e per liter
        naturalGas: 51.4,      // kg CO₂-e per GJ
        lpg: 1.55              // kg CO₂-e per liter
    },

    vehicles: {
        'Ute': {
            diesel: 2.68,
            petrol: 2.31,
            lpg: 1.55
        },
        'Van': {
            diesel: 2.68,
            petrol: 2.31,
            lpg: 1.55
        },
        'Light truck': {
            diesel: 2.68,
            petrol: 2.31
        },
        'Heavy truck': {
            diesel: 2.68
        },
        'Excavator': {
            diesel: 2.68
        },
        'Crane': {
            diesel: 2.68
        },
        'Forklift': {
            diesel: 2.68,
            lpg: 1.55,
            electric: 0
        }
    },

    // Scope 3: Materials (kg CO₂-e per unit)
    materials: {
        concrete: {
            'concrete-32mpa': 365,              // kg CO₂-e per m³
            'concrete-40mpa': 410,              // kg CO₂-e per m³
            'concrete-gpc-32mpa': 146,          // kg CO₂-e per m³
            'concrete-recycled-aggregate': 292  // kg CO₂-e per m³
        },
        steel: {
            'steel-reinforcing-bar': 1850,      // kg CO₂-e per tonne
            'steel-structural-sections': 1900,  // kg CO₂-e per tonne
            'steel-recycled': 550               // kg CO₂-e per tonne
        },
        timber: {
            'timber-clt': -420,                 // kg CO₂-e per m³ (carbon sequestration)
            'timber-softwood': -350,            // kg CO₂-e per m³
            'timber-hardwood': -280             // kg CO₂-e per m³
        },
        masonry: {
            'brick-clay': 220,                  // kg CO₂-e per 1000 bricks
            'block-concrete': 150               // kg CO₂-e per m³
        },
        insulation: {
            'glasswool': 1.1,                   // kg CO₂-e per m²
            'rockwool': 1.3,                    // kg CO₂-e per m²
            'polystyrene': 4.5                  // kg CO₂-e per m²
        },
        glazing: {
            'single-glazed': 50,                // kg CO₂-e per m²
            'double-glazed': 75,                // kg CO₂-e per m²
            'triple-glazed': 100                // kg CO₂-e per m²
        },
        finishes: {
            'paint': 2.5,                       // kg CO₂-e per liter
            'tiles-ceramic': 20,                // kg CO₂-e per m²
            'carpet': 15                        // kg CO₂-e per m²
        }
    },

    // Scope 3: Transport (kg CO₂-e per tonne-km or passenger-km)
    transport: {
        lightVehicle: 0.175,      // kg CO₂-e per km
        mediumVehicle: 0.267,     // kg CO₂-e per km
        heavyVehicle: 0.655,      // kg CO₂-e per km
        freight: 0.097,           // kg CO₂-e per tonne-km
        sea: 0.011,               // kg CO₂-e per tonne-km
        air: 0.602,               // kg CO₂-e per tonne-km
        rail: 0.029               // kg CO₂-e per tonne-km
    },

    // Scope 3: Waste (kg CO₂-e per kg of waste)
    waste: {
        recycling: 0.05,          // kg CO₂-e per kg
        landfill: 0.52,           // kg CO₂-e per kg
        incineration: 0.31,       // kg CO₂-e per kg
        composting: 0.03          // kg CO₂-e per kg
    },

    // Scope 3: Employee Commuting (kg CO₂-e per km)
    commuting: {
        car: 0.175,               // Average passenger vehicle
        publicTransport: 0.089,   // Bus/train average
        cycling: 0,
        walking: 0
    }
};
