/**
 * Australian Context Module
 *
 * Australian-specific intelligence overlay providing:
 * - Climate zone data and analysis
 * - Transport distance calculations and penalties
 * - Supplier mapping and regional material availability
 * - State-specific regulatory compliance
 * - Regional cost adjustments
 *
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 1.0.0
 */

/**
 * Australian Climate Zone Manager
 */
class AustralianClimateZones {
    constructor() {
        this.zones = this._initializeClimateZones();
        this.cities = this._initializeCityMapping();
    }

    /**
     * Get climate zone by location
     *
     * @param {string} city - City name
     * @param {string} state - State code
     * @returns {Object} - Climate zone data
     */
    getZoneByLocation(city, state) {
        const cityKey = `${city.toLowerCase()}_${state}`;
        const zoneId = this.cities[cityKey] || this._inferZoneFromState(state);
        return this.zones[zoneId];
    }

    /**
     * Get zone by ID
     *
     * @param {number} zoneId - Zone ID (1-8)
     * @returns {Object} - Climate zone data
     */
    getZoneById(zoneId) {
        return this.zones[zoneId];
    }

    /**
     * Calculate heating/cooling requirements
     *
     * @param {number} zoneId - Climate zone ID
     * @param {number} gfa - Gross floor area (m²)
     * @param {string} buildingType - Building type
     * @returns {Object} - Energy requirements
     */
    calculateEnergyRequirements(zoneId, gfa, buildingType) {
        const zone = this.zones[zoneId];
        const typeFactors = {
            'office': { heating: 1.0, cooling: 1.2 },
            'residential': { heating: 0.8, cooling: 0.9 },
            'retail': { heating: 1.1, cooling: 1.4 },
            'industrial': { heating: 0.6, cooling: 0.7 },
            'education': { heating: 0.9, cooling: 1.0 }
        };

        const factors = typeFactors[buildingType] || typeFactors['office'];

        return {
            heatingEnergy: zone.heatingDegreeDays * gfa * factors.heating * 0.05, // kWh
            coolingEnergy: zone.coolingDegreeDays * gfa * factors.cooling * 0.08, // kWh
            totalEnergy: 0 // Calculated below
        };
    }

    /**
     * Initialize climate zone data
     * @private
     */
    _initializeClimateZones() {
        return {
            1: {
                id: 1,
                name: 'High Humidity Summer, Warm Winter',
                description: 'Hot humid coastal regions',
                heatingDegreeDays: 0,
                coolingDegreeDays: 3500,
                avgRainfall: 1800,
                avgHumidity: 75,
                solarRadiation: 18.5,
                regions: ['Far North QLD', 'Northern NT'],
                designTemp: { summer: 32, winter: 20 }
            },
            2: {
                id: 2,
                name: 'Warm Humid Summer, Mild Winter',
                description: 'Subtropical coastal areas',
                heatingDegreeDays: 200,
                coolingDegreeDays: 2800,
                avgRainfall: 1200,
                avgHumidity: 68,
                solarRadiation: 17.5,
                regions: ['Brisbane', 'Gold Coast', 'Northern NSW Coast'],
                designTemp: { summer: 30, winter: 12 }
            },
            3: {
                id: 3,
                name: 'Hot Dry Summer, Warm Winter',
                description: 'Inland dry regions',
                heatingDegreeDays: 300,
                coolingDegreeDays: 3200,
                avgRainfall: 400,
                avgHumidity: 45,
                solarRadiation: 20.0,
                regions: ['Inland QLD', 'Northern WA'],
                designTemp: { summer: 38, winter: 15 }
            },
            4: {
                id: 4,
                name: 'Hot Dry Summer, Cool Winter',
                description: 'Central inland areas',
                heatingDegreeDays: 800,
                coolingDegreeDays: 2500,
                avgRainfall: 350,
                avgHumidity: 40,
                solarRadiation: 19.0,
                regions: ['Central NSW', 'Northern SA'],
                designTemp: { summer: 35, winter: 5 }
            },
            5: {
                id: 5,
                name: 'Warm Temperate',
                description: 'Temperate coastal cities',
                heatingDegreeDays: 600,
                coolingDegreeDays: 1800,
                avgRainfall: 800,
                avgHumidity: 60,
                solarRadiation: 16.5,
                regions: ['Sydney', 'Perth', 'Adelaide'],
                designTemp: { summer: 28, winter: 8 }
            },
            6: {
                id: 6,
                name: 'Mild Temperate',
                description: 'Cooler coastal regions',
                heatingDegreeDays: 1200,
                coolingDegreeDays: 800,
                avgRainfall: 650,
                avgHumidity: 65,
                solarRadiation: 14.5,
                regions: ['Melbourne', 'Southern VIC'],
                designTemp: { summer: 26, winter: 4 }
            },
            7: {
                id: 7,
                name: 'Cool Temperate',
                description: 'Cold highland and southern areas',
                heatingDegreeDays: 2000,
                coolingDegreeDays: 300,
                avgRainfall: 700,
                avgHumidity: 70,
                solarRadiation: 13.0,
                regions: ['Hobart', 'Alpine regions'],
                designTemp: { summer: 22, winter: 0 }
            },
            8: {
                id: 8,
                name: 'Alpine',
                description: 'High altitude cold regions',
                heatingDegreeDays: 3500,
                coolingDegreeDays: 0,
                avgRainfall: 1500,
                avgHumidity: 75,
                solarRadiation: 15.0,
                regions: ['Snowy Mountains', 'Alpine VIC'],
                designTemp: { summer: 18, winter: -5 }
            }
        };
    }

    /**
     * Initialize city to zone mapping
     * @private
     */
    _initializeCityMapping() {
        return {
            'sydney_NSW': 5,
            'melbourne_VIC': 6,
            'brisbane_QLD': 2,
            'perth_WA': 5,
            'adelaide_SA': 5,
            'hobart_TAS': 7,
            'darwin_NT': 1,
            'canberra_ACT': 6,
            'gold coast_QLD': 2,
            'newcastle_NSW': 5,
            'wollongong_NSW': 5,
            'cairns_QLD': 1,
            'townsville_QLD': 1,
            'geelong_VIC': 6,
            'ballarat_VIC': 7,
            'bendigo_VIC': 6
        };
    }

    /**
     * Infer zone from state as fallback
     * @private
     */
    _inferZoneFromState(state) {
        const stateDefaults = {
            'NSW': 5,
            'VIC': 6,
            'QLD': 2,
            'SA': 5,
            'WA': 5,
            'TAS': 7,
            'NT': 1,
            'ACT': 6
        };
        return stateDefaults[state] || 5;
    }
}

/**
 * Australian Transport Calculator
 */
class AustralianTransport {
    constructor() {
        this.majorCities = this._initializeCityCoordinates();
        this.ports = this._initializePortLocations();
        this.emissionFactors = this._initializeTransportEmissions();
    }

    /**
     * Calculate transport distance between locations
     *
     * @param {string} origin - Origin city/state
     * @param {string} destination - Destination city/state
     * @returns {Object} - Distance and route information
     */
    calculateDistance(origin, destination) {
        const originCoords = this._getCoordinates(origin);
        const destCoords = this._getCoordinates(destination);

        // Calculate straight-line distance
        const straightLine = this._haversineDistance(
            originCoords.lat,
            originCoords.lng,
            destCoords.lat,
            destCoords.lng
        );

        // Apply road distance multiplier (typically 1.2-1.4x)
        const roadDistance = straightLine * 1.3;

        return {
            origin,
            destination,
            straightLine: Math.round(straightLine),
            road: Math.round(roadDistance),
            estimatedTime: Math.round(roadDistance / 80), // hours at 80 km/h avg
            route: this._determineRoute(origin, destination)
        };
    }

    /**
     * Calculate transport emissions
     *
     * @param {number} distance - Distance in km
     * @param {string} mode - Transport mode
     * @param {number} weight - Weight in tonnes
     * @returns {Object} - Emission calculations
     */
    calculateEmissions(distance, mode, weight) {
        const factor = this.emissionFactors[mode] || this.emissionFactors['truck'];
        const emissions = distance * weight * factor;

        return {
            distance,
            mode,
            weight,
            emissionFactor: factor,
            totalEmissions: emissions,
            unit: 'kg CO₂-e'
        };
    }

    /**
     * Find nearest port to location
     *
     * @param {string} location - City/state
     * @returns {Object} - Port information
     */
    findNearestPort(location) {
        const coords = this._getCoordinates(location);
        let nearest = null;
        let minDistance = Infinity;

        for (const [portName, portData] of Object.entries(this.ports)) {
            const distance = this._haversineDistance(
                coords.lat,
                coords.lng,
                portData.lat,
                portData.lng
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearest = { name: portName, ...portData, distance };
            }
        }

        return nearest;
    }

    /**
     * Calculate import penalties for overseas materials
     *
     * @param {string} destination - Australian destination
     * @param {string} originCountry - Origin country
     * @returns {Object} - Import penalties and considerations
     */
    calculateImportPenalty(destination, originCountry) {
        const port = this.findNearestPort(destination);
        const baseDistance = this._getInternationalDistance(originCountry);
        const portToSite = port.distance;

        // Sea freight emissions (lower per tonne-km than road)
        const seaFreight = baseDistance * 0.01; // kg CO₂-e per tonne-km
        // Road freight from port to site
        const roadFreight = portToSite * 0.12; // kg CO₂-e per tonne-km

        return {
            originCountry,
            destination,
            port: port.name,
            seaDistance: baseDistance,
            roadDistance: Math.round(portToSite),
            totalDistance: Math.round(baseDistance + portToSite),
            seaEmissions: seaFreight,
            roadEmissions: roadFreight,
            totalEmissionsPerTonne: seaFreight + roadFreight,
            complianceNote: 'Consider local alternatives to reduce transport emissions'
        };
    }

    /**
     * Initialize city coordinates
     * @private
     */
    _initializeCityCoordinates() {
        return {
            'sydney_NSW': { lat: -33.8688, lng: 151.2093 },
            'melbourne_VIC': { lat: -37.8136, lng: 144.9631 },
            'brisbane_QLD': { lat: -27.4698, lng: 153.0251 },
            'perth_WA': { lat: -31.9505, lng: 115.8605 },
            'adelaide_SA': { lat: -34.9285, lng: 138.6007 },
            'hobart_TAS': { lat: -42.8821, lng: 147.3272 },
            'darwin_NT': { lat: -12.4634, lng: 130.8456 },
            'canberra_ACT': { lat: -35.2809, lng: 149.1300 }
        };
    }

    /**
     * Initialize port locations
     * @private
     */
    _initializePortLocations() {
        return {
            'Port Botany': { lat: -33.9611, lng: 151.2169, state: 'NSW' },
            'Port of Melbourne': { lat: -37.8316, lng: 144.9216, state: 'VIC' },
            'Port of Brisbane': { lat: -27.3850, lng: 153.1700, state: 'QLD' },
            'Fremantle Port': { lat: -32.0569, lng: 115.7439, state: 'WA' },
            'Port Adelaide': { lat: -34.8417, lng: 138.5003, state: 'SA' },
            'Port of Hobart': { lat: -42.8794, lng: 147.3294, state: 'TAS' },
            'Darwin Port': { lat: -12.4678, lng: 130.8469, state: 'NT' }
        };
    }

    /**
     * Initialize transport emission factors
     * @private
     */
    _initializeTransportEmissions() {
        return {
            'truck': 0.12, // kg CO₂-e per tonne-km
            'rail': 0.03,
            'ship': 0.01,
            'air': 0.60
        };
    }

    /**
     * Haversine distance calculation
     * @private
     */
    _haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this._toRadians(lat2 - lat1);
        const dLon = this._toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._toRadians(lat1)) * Math.cos(this._toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    _toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * Get coordinates for location
     * @private
     */
    _getCoordinates(location) {
        const key = location.toLowerCase().replace(' ', '_');
        return this.majorCities[key] || this.majorCities['sydney_NSW'];
    }

    /**
     * Determine route classification
     * @private
     */
    _determineRoute(origin, destination) {
        const distance = this.calculateDistance(origin, destination).road;

        if (distance < 100) return 'local';
        if (distance < 500) return 'regional';
        if (distance < 2000) return 'interstate';
        return 'long-haul';
    }

    /**
     * Get international shipping distance estimates
     * @private
     */
    _getInternationalDistance(country) {
        const distances = {
            'China': 9000,
            'Japan': 8000,
            'South Korea': 8500,
            'Singapore': 6500,
            'India': 10000,
            'USA': 12000,
            'Europe': 18000,
            'UK': 18500,
            'New Zealand': 2500
        };
        return distances[country] || 12000;
    }
}

/**
 * Australian Supplier Database
 */
class AustralianSuppliers {
    constructor() {
        this.suppliers = this._initializeSupplierDatabase();
    }

    /**
     * Find suppliers for material
     *
     * @param {string} materialType - Type of material
     * @param {string} state - Preferred state
     * @returns {Array} - List of suppliers
     */
    findSuppliers(materialType, state) {
        const categorySuppliers = this.suppliers[materialType] || [];

        // Prioritize suppliers in the same state
        return categorySuppliers.sort((a, b) => {
            if (a.states.includes(state) && !b.states.includes(state)) return -1;
            if (!a.states.includes(state) && b.states.includes(state)) return 1;
            return 0;
        });
    }

    /**
     * Get regional material availability
     *
     * @param {string} state - Australian state
     * @returns {Object} - Available materials by category
     */
    getRegionalAvailability(state) {
        const availability = {};

        for (const [material, suppliers] of Object.entries(this.suppliers)) {
            availability[material] = suppliers.filter(s =>
                s.states.includes(state) || s.states.includes('National')
            );
        }

        return availability;
    }

    /**
     * Initialize supplier database
     * @private
     */
    _initializeSupplierDatabase() {
        return {
            'concrete': [
                {
                    name: 'Boral',
                    states: ['National'],
                    specialties: ['Standard concrete', 'High performance', 'Decorative'],
                    epd: true
                },
                {
                    name: 'Holcim',
                    states: ['National'],
                    specialties: ['ECOPact', 'Low carbon', 'Geopolymer'],
                    epd: true
                },
                {
                    name: 'Hanson',
                    states: ['NSW', 'VIC', 'QLD', 'SA'],
                    specialties: ['Recycled aggregate', 'Green concrete'],
                    epd: true
                }
            ],
            'steel': [
                {
                    name: 'BlueScope Steel',
                    states: ['National'],
                    specialties: ['Structural steel', 'Coated products', 'Low carbon steel'],
                    epd: true
                },
                {
                    name: 'InfraBuild',
                    states: ['National'],
                    specialties: ['Reinforcing', 'Structural', 'Recycled content'],
                    epd: false
                },
                {
                    name: 'Liberty Steel',
                    states: ['National'],
                    specialties: ['Electric arc furnace', 'Recycled steel'],
                    epd: false
                }
            ],
            'timber': [
                {
                    name: 'Hurford Hardwood',
                    states: ['QLD', 'NSW'],
                    specialties: ['Hardwood', 'FSC certified', 'Engineered timber'],
                    epd: false
                },
                {
                    name: 'Responsible Wood',
                    states: ['National'],
                    specialties: ['Certified sustainable timber'],
                    epd: false
                },
                {
                    name: 'Australian Sustainable Hardwoods',
                    states: ['VIC', 'NSW'],
                    specialties: ['Plantation hardwood', 'CLT'],
                    epd: true
                }
            ],
            'insulation': [
                {
                    name: 'CSR Bradford',
                    states: ['National'],
                    specialties: ['Glasswool', 'Polyester', 'High performance'],
                    epd: true
                },
                {
                    name: 'Knauf Insulation',
                    states: ['National'],
                    specialties: ['Glasswool', 'Earthwool'],
                    epd: true
                },
                {
                    name: 'Fletcher Insulation',
                    states: ['National'],
                    specialties: ['Glasswool', 'Pink Batts'],
                    epd: false
                }
            ],
            'glazing': [
                {
                    name: 'Viridian',
                    states: ['National'],
                    specialties: ['Low-E glass', 'Energy efficient'],
                    epd: true
                },
                {
                    name: 'CSR Gyprock',
                    states: ['National'],
                    specialties: ['Glass products', 'High performance'],
                    epd: false
                }
            ]
        };
    }
}

/**
 * Australian Regulatory Compliance Manager
 */
class AustralianCompliance {
    constructor() {
        this.nccVersions = this._initializeNCCVersions();
        this.stateRequirements = this._initializeStateRequirements();
    }

    /**
     * Check NCC Section J compliance
     *
     * @param {Object} projectData - Project data
     * @param {string} state - Australian state
     * @returns {Object} - Compliance assessment
     */
    checkNCCCompliance(projectData, state) {
        const stateReqs = this.stateRequirements[state];
        const nccVersion = stateReqs.nccVersion;

        const results = {
            compliant: true,
            version: nccVersion,
            state: state,
            checks: [],
            recommendations: []
        };

        // Energy efficiency requirements (Section J)
        if (projectData.buildingType === 'office') {
            const energyLimit = stateReqs.energyLimits.office;
            const projectEnergy = projectData.operationalCarbon.energyIntensity;

            results.checks.push({
                requirement: 'Section J Energy Efficiency',
                limit: energyLimit,
                actual: projectEnergy,
                compliant: projectEnergy <= energyLimit,
                unit: 'kWh/m²/year'
            });

            if (projectEnergy > energyLimit) {
                results.compliant = false;
                results.recommendations.push(
                    'Improve building envelope performance',
                    'Upgrade HVAC system efficiency',
                    'Consider renewable energy systems'
                );
            }
        }

        // State-specific additions
        if (stateReqs.additionalRequirements) {
            results.additionalRequirements = stateReqs.additionalRequirements;
        }

        return results;
    }

    /**
     * Get NABERS requirements for state
     *
     * @param {string} state - Australian state
     * @returns {Object} - NABERS requirements
     */
    getNABERSRequirements(state) {
        return this.stateRequirements[state].nabers || {
            mandatory: false,
            minimumRating: null
        };
    }

    /**
     * Get Green Star requirements
     *
     * @param {string} state - Australian state
     * @returns {Object} - Green Star information
     */
    getGreenStarInfo(state) {
        return this.stateRequirements[state].greenStar || {
            incentives: false,
            targetRating: null
        };
    }

    /**
     * Initialize NCC versions
     * @private
     */
    _initializeNCCVersions() {
        return {
            '2022': {
                version: 'NCC 2022',
                effectiveDate: '2023-05-01',
                sectionJ: {
                    version: 'J 2022',
                    changes: [
                        'Updated energy efficiency requirements',
                        'Enhanced building envelope standards',
                        'New renewable energy provisions'
                    ]
                }
            }
        };
    }

    /**
     * Initialize state-specific requirements
     * @private
     */
    _initializeStateRequirements() {
        return {
            'NSW': {
                nccVersion: '2022',
                energyLimits: { office: 105, residential: 50 },
                nabers: { mandatory: true, minimumRating: 5.0 },
                greenStar: { incentives: true, targetRating: 5 },
                additionalRequirements: [
                    'BASIX requirements for residential',
                    'Section J verification required for commercial'
                ]
            },
            'VIC': {
                nccVersion: '2022',
                energyLimits: { office: 100, residential: 45 },
                nabers: { mandatory: false, minimumRating: null },
                greenStar: { incentives: true, targetRating: 5 },
                additionalRequirements: [
                    'Sustainable Design Assessment (SDA) for large projects'
                ]
            },
            'QLD': {
                nccVersion: '2022',
                energyLimits: { office: 110, residential: 55 },
                nabers: { mandatory: false, minimumRating: null },
                greenStar: { incentives: false, targetRating: null },
                additionalRequirements: []
            },
            'SA': {
                nccVersion: '2022',
                energyLimits: { office: 105, residential: 50 },
                nabers: { mandatory: false, minimumRating: null },
                greenStar: { incentives: true, targetRating: 4 },
                additionalRequirements: []
            },
            'WA': {
                nccVersion: '2022',
                energyLimits: { office: 110, residential: 55 },
                nabers: { mandatory: false, minimumRating: null },
                greenStar: { incentives: false, targetRating: null },
                additionalRequirements: []
            },
            'TAS': {
                nccVersion: '2022',
                energyLimits: { office: 95, residential: 40 },
                nabers: { mandatory: false, minimumRating: null },
                greenStar: { incentives: false, targetRating: null },
                additionalRequirements: []
            },
            'NT': {
                nccVersion: '2022',
                energyLimits: { office: 120, residential: 60 },
                nabers: { mandatory: false, minimumRating: null },
                greenStar: { incentives: false, targetRating: null },
                additionalRequirements: []
            },
            'ACT': {
                nccVersion: '2022',
                energyLimits: { office: 100, residential: 45 },
                nabers: { mandatory: true, minimumRating: 5.5 },
                greenStar: { incentives: true, targetRating: 6 },
                additionalRequirements: [
                    'Zero emissions target by 2045',
                    'Mandatory disclosure of energy ratings'
                ]
            }
        };
    }
}

/**
 * Australian Context Manager - Facade for all Australian context
 */
class AustralianContextManager {
    constructor() {
        this.climateZones = new AustralianClimateZones();
        this.transport = new AustralianTransport();
        this.suppliers = new AustralianSuppliers();
        this.compliance = new AustralianCompliance();
    }

    /**
     * Get comprehensive context for a project location
     *
     * @param {string} city - City name
     * @param {string} state - State code
     * @returns {Object} - Complete Australian context
     */
    getProjectContext(city, state) {
        return {
            climate: this.climateZones.getZoneByLocation(city, state),
            transport: {
                nearestPort: this.transport.findNearestPort(`${city}_${state}`),
                majorRoutes: this._getMajorRoutes(state)
            },
            suppliers: this.suppliers.getRegionalAvailability(state),
            compliance: {
                ncc: this.compliance.stateRequirements[state],
                nabers: this.compliance.getNABERSRequirements(state),
                greenStar: this.compliance.getGreenStarInfo(state)
            }
        };
    }

    /**
     * Calculate complete project penalties and adjustments
     *
     * @param {Object} project - Project data
     * @returns {Object} - Penalties and adjustments
     */
    calculateProjectAdjustments(project) {
        const adjustments = {
            climate: {},
            transport: {},
            regional: {},
            compliance: {}
        };

        // Climate adjustments
        const climate = this.climateZones.getZoneByLocation(
            project.location.city,
            project.location.state
        );
        adjustments.climate = {
            heatingLoad: climate.heatingDegreeDays,
            coolingLoad: climate.coolingDegreeDays,
            factor: (climate.heatingDegreeDays + climate.coolingDegreeDays) / 3000
        };

        // Transport penalties
        if (project.materials) {
            adjustments.transport.totalDistance = 0;
            adjustments.transport.totalEmissions = 0;

            for (const material of project.materials) {
                if (material.origin) {
                    const distance = this.transport.calculateDistance(
                        material.origin,
                        `${project.location.city}_${project.location.state}`
                    );
                    const emissions = this.transport.calculateEmissions(
                        distance.road,
                        'truck',
                        material.quantity || 1
                    );

                    adjustments.transport.totalDistance += distance.road;
                    adjustments.transport.totalEmissions += emissions.totalEmissions;
                }
            }
        }

        // Regional cost adjustments (percentage)
        const regionalFactors = {
            'NSW': 1.05,
            'VIC': 1.00,
            'QLD': 1.02,
            'SA': 0.98,
            'WA': 1.15,
            'TAS': 1.08,
            'NT': 1.25,
            'ACT': 1.03
        };
        adjustments.regional.costFactor = regionalFactors[project.location.state] || 1.0;

        // Compliance requirements
        adjustments.compliance = this.compliance.checkNCCCompliance(
            project,
            project.location.state
        );

        return adjustments;
    }

    /**
     * Get major transport routes for state
     * @private
     */
    _getMajorRoutes(state) {
        const routes = {
            'NSW': ['Pacific Highway', 'Hume Highway', 'Princes Highway'],
            'VIC': ['Hume Freeway', 'Princes Freeway', 'Western Highway'],
            'QLD': ['Bruce Highway', 'Pacific Motorway', 'Warrego Highway'],
            'SA': ['Sturt Highway', 'Princes Highway', 'Eyre Highway'],
            'WA': ['Great Eastern Highway', 'Great Northern Highway'],
            'TAS': ['Midland Highway', 'Bass Highway'],
            'NT': ['Stuart Highway', 'Victoria Highway'],
            'ACT': ['Federal Highway', 'Monaro Highway']
        };
        return routes[state] || [];
    }
}

// Export classes
export {
    AustralianClimateZones,
    AustralianTransport,
    AustralianSuppliers,
    AustralianCompliance,
    AustralianContextManager
};

// CommonJS export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AustralianClimateZones,
        AustralianTransport,
        AustralianSuppliers,
        AustralianCompliance,
        AustralianContextManager
    };
}
