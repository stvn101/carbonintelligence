/**
 * API Client Utility
 *
 * RESTful API client for external data sources:
 * - EC3 (Embodied Carbon in Construction Calculator) database
 * - Australian EPD (Environmental Product Declaration) Register
 * - Australian National Greenhouse Accounts
 * - Custom backend APIs
 *
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 1.0.0
 */

import { apiCache } from './cache.js';

/**
 * Base API Client class
 */
class APIClient {
    constructor(options = {}) {
        this.baseURL = options.baseURL || '';
        this.timeout = options.timeout || 30000; // 30 seconds
        this.headers = options.headers || {
            'Content-Type': 'application/json'
        };
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
        this.useCache = options.useCache !== false;
        this.cacheTTL = options.cacheTTL || 600000; // 10 minutes
    }

    /**
     * Make HTTP request with retry logic
     *
     * @param {string} method - HTTP method
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async request(method, endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method,
            headers: { ...this.headers, ...options.headers },
            signal: AbortSignal.timeout(this.timeout)
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        // Check cache for GET requests
        if (method === 'GET' && this.useCache) {
            const cached = apiCache.getCachedResponse(url, options.params || {});
            if (cached) {
                return cached;
            }
        }

        let lastError;
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, config);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Cache successful GET responses
                if (method === 'GET' && this.useCache) {
                    apiCache.cacheResponse(url, options.params || {}, data, this.cacheTTL);
                }

                return data;
            } catch (error) {
                lastError = error;

                // Don't retry on client errors (4xx)
                if (error.message.includes('HTTP 4')) {
                    throw error;
                }

                // Wait before retrying
                if (attempt < this.retryAttempts) {
                    await new Promise(resolve =>
                        setTimeout(resolve, this.retryDelay * attempt)
                    );
                }
            }
        }

        throw new Error(`Request failed after ${this.retryAttempts} attempts: ${lastError.message}`);
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request('GET', url, { params });
    }

    /**
     * POST request
     */
    async post(endpoint, body, options = {}) {
        return this.request('POST', endpoint, { body, ...options });
    }

    /**
     * PUT request
     */
    async put(endpoint, body, options = {}) {
        return this.request('PUT', endpoint, { body, ...options });
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, options);
    }
}

/**
 * EC3 Database API Client
 * Building Transparency's Embodied Carbon in Construction Calculator
 */
class EC3Client extends APIClient {
    constructor(apiKey) {
        super({
            baseURL: 'https://buildingtransparency.org/api',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            cacheTTL: 3600000 // 1 hour - EPD data doesn't change frequently
        });
        this.apiKey = apiKey;
    }

    /**
     * Search for materials in EC3 database
     *
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Array>} - Matching materials
     */
    async searchMaterials(criteria) {
        return this.get('/materials', {
            category: criteria.category,
            jurisdiction: criteria.jurisdiction || 'AU',
            keyword: criteria.keyword
        });
    }

    /**
     * Get material EPD by ID
     *
     * @param {string} epdId - EPD identifier
     * @returns {Promise<Object>} - EPD data
     */
    async getMaterialEPD(epdId) {
        return this.get(`/epds/${epdId}`);
    }

    /**
     * Get carbon coefficient for material
     *
     * @param {string} materialId - Material identifier
     * @returns {Promise<number>} - Carbon coefficient (kg CO2-e/unit)
     */
    async getCarbonCoefficient(materialId) {
        const epd = await this.getMaterialEPD(materialId);
        return epd.gwp_per_declared_unit || 0;
    }

    /**
     * Get Australian-specific EPD data
     *
     * @param {string} category - Material category
     * @returns {Promise<Array>} - Australian EPDs
     */
    async getAustralianEPDs(category) {
        return this.get('/epds', {
            jurisdiction: 'AU',
            category: category,
            valid: true
        });
    }
}

/**
 * Australian EPD Register API Client
 */
class AustralianEPDClient extends APIClient {
    constructor() {
        super({
            baseURL: 'https://epd-australasia.com/api/v1',
            cacheTTL: 7200000 // 2 hours
        });
    }

    /**
     * Search EPD register
     *
     * @param {Object} query - Search query
     * @returns {Promise<Array>} - Matching EPDs
     */
    async searchEPDs(query) {
        return this.get('/epds/search', {
            product: query.product,
            manufacturer: query.manufacturer,
            standard: query.standard || 'ISO 14025'
        });
    }

    /**
     * Get EPD details
     *
     * @param {string} epdNumber - EPD registration number
     * @returns {Promise<Object>} - EPD details
     */
    async getEPD(epdNumber) {
        return this.get(`/epds/${epdNumber}`);
    }

    /**
     * Get manufacturers
     *
     * @param {string} category - Product category
     * @returns {Promise<Array>} - List of manufacturers
     */
    async getManufacturers(category = null) {
        const params = category ? { category } : {};
        return this.get('/manufacturers', params);
    }
}

/**
 * Australian National Greenhouse Accounts API Client
 */
class NGAClient extends APIClient {
    constructor() {
        super({
            baseURL: 'https://www.industry.gov.au/data-and-publications/api',
            cacheTTL: 86400000 // 24 hours - emission factors updated annually
        });
    }

    /**
     * Get state electricity emission factors
     *
     * @param {string} state - Australian state code
     * @param {number} year - Year (defaults to current)
     * @returns {Promise<Object>} - Emission factors
     */
    async getElectricityEmissions(state, year = new Date().getFullYear()) {
        return this.get('/nger/emission-factors/electricity', {
            state: state,
            year: year
        });
    }

    /**
     * Get fuel emission factors
     *
     * @param {string} fuelType - Type of fuel
     * @returns {Promise<Object>} - Emission factors
     */
    async getFuelEmissions(fuelType) {
        return this.get('/nger/emission-factors/fuels', {
            fuel: fuelType
        });
    }

    /**
     * Get transport emission factors
     *
     * @param {string} mode - Transport mode
     * @returns {Promise<Object>} - Emission factors
     */
    async getTransportEmissions(mode) {
        return this.get('/nger/emission-factors/transport', {
            mode: mode
        });
    }

    /**
     * Get all emission factors for a state
     *
     * @param {string} state - Australian state code
     * @returns {Promise<Object>} - All emission factors
     */
    async getAllEmissionFactors(state) {
        return this.get('/nger/emission-factors/all', {
            state: state,
            year: new Date().getFullYear()
        });
    }
}

/**
 * Custom Backend API Client
 */
class CarbonIntelligenceAPI extends APIClient {
    constructor(baseURL, apiKey) {
        super({
            baseURL: baseURL || process.env.API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${apiKey || process.env.API_KEY}`,
                'Content-Type': 'application/json'
            },
            cacheTTL: 300000 // 5 minutes
        });
    }

    // Project endpoints
    async getProjects() {
        return this.get('/projects');
    }

    async getProject(projectId) {
        return this.get(`/projects/${projectId}`);
    }

    async createProject(projectData) {
        return this.post('/projects', projectData);
    }

    async updateProject(projectId, projectData) {
        return this.put(`/projects/${projectId}`, projectData);
    }

    async deleteProject(projectId) {
        return this.delete(`/projects/${projectId}`);
    }

    // Calculation endpoints
    async calculateProject(projectData) {
        return this.post('/calculations/project', projectData);
    }

    async calculateMaterials(materials) {
        return this.post('/calculations/materials', materials);
    }

    async calculateScopes(scopesData) {
        return this.post('/calculations/scopes', scopesData);
    }

    // Analysis endpoints
    async analyzeCompliance(projectId) {
        return this.get(`/analysis/compliance/${projectId}`);
    }

    async getOptimizations(projectId, level = 'balanced') {
        return this.get(`/analysis/optimizations/${projectId}`, { level });
    }

    async compareScenarios(projectId, scenarios) {
        return this.post(`/analysis/compare/${projectId}`, { scenarios });
    }

    // Reporting endpoints
    async generateReport(projectId, format = 'pdf') {
        return this.get(`/reports/${projectId}`, { format });
    }

    async exportData(projectId, format = 'json') {
        return this.get(`/export/${projectId}`, { format });
    }

    // User/Auth endpoints
    async login(credentials) {
        return this.post('/auth/login', credentials);
    }

    async getUserProfile() {
        return this.get('/user/profile');
    }

    async updateUserProfile(profileData) {
        return this.put('/user/profile', profileData);
    }
}

/**
 * API Manager - Facade for all API clients
 */
class APIManager {
    constructor(config = {}) {
        this.ec3 = config.ec3ApiKey
            ? new EC3Client(config.ec3ApiKey)
            : null;

        this.australianEPD = new AustralianEPDClient();
        this.nga = new NGAClient();

        this.backend = config.backendURL
            ? new CarbonIntelligenceAPI(config.backendURL, config.backendApiKey)
            : null;
    }

    /**
     * Check if external APIs are configured
     */
    isConfigured() {
        return {
            ec3: this.ec3 !== null,
            australianEPD: true,
            nga: true,
            backend: this.backend !== null
        };
    }

    /**
     * Get material data from available sources
     *
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Object>} - Material data from all sources
     */
    async getMaterialData(criteria) {
        const results = {
            ec3: null,
            australianEPD: null,
            error: null
        };

        try {
            // Try EC3 first if available
            if (this.ec3) {
                results.ec3 = await this.ec3.searchMaterials(criteria);
            }

            // Try Australian EPD Register
            results.australianEPD = await this.australianEPD.searchEPDs({
                product: criteria.keyword,
                manufacturer: criteria.manufacturer
            });
        } catch (error) {
            results.error = error.message;
        }

        return results;
    }

    /**
     * Get emission factors for calculations
     *
     * @param {string} state - Australian state
     * @returns {Promise<Object>} - Emission factors
     */
    async getEmissionFactors(state) {
        try {
            return await this.nga.getAllEmissionFactors(state);
        } catch (error) {
            console.error('Error fetching emission factors:', error);
            // Return fallback values if API fails
            return this._getFallbackEmissionFactors(state);
        }
    }

    /**
     * Fallback emission factors (from 2023 NGER data)
     * @private
     */
    _getFallbackEmissionFactors(state) {
        const electricityFactors = {
            'NSW': 0.76,
            'VIC': 0.98,
            'QLD': 0.81,
            'SA': 0.44,
            'WA': 0.68,
            'TAS': 0.15,
            'NT': 0.55,
            'ACT': 0.76
        };

        return {
            electricity: electricityFactors[state] || 0.76,
            naturalGas: 2.00,
            diesel: 2.68,
            petrol: 2.31
        };
    }
}

// Export classes
export {
    APIClient,
    EC3Client,
    AustralianEPDClient,
    NGAClient,
    CarbonIntelligenceAPI,
    APIManager
};

// CommonJS export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APIClient,
        EC3Client,
        AustralianEPDClient,
        NGAClient,
        CarbonIntelligenceAPI,
        APIManager
    };
}
