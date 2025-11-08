/**
 * Cache Utility
 *
 * Standalone caching system for storing and retrieving data
 * with TTL (Time To Live) support and LRU eviction.
 *
 * @author Steven Jenkins
 * @company CarbonConstruct
 * @version 1.0.0
 */

class CacheManager {
    constructor(options = {}) {
        this.maxSize = options.maxSize || 100; // Maximum number of entries
        this.defaultTTL = options.defaultTTL || 3600000; // 1 hour in milliseconds
        this.cache = new Map();
        this.accessOrder = new Map(); // Track access order for LRU
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            sets: 0
        };
    }

    /**
     * Set a value in the cache
     *
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds (optional)
     */
    set(key, value, ttl = null) {
        // Check if we need to evict entries
        if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
            this._evictLRU();
        }

        const expiresAt = Date.now() + (ttl || this.defaultTTL);

        this.cache.set(key, {
            value,
            expiresAt,
            createdAt: Date.now()
        });

        this.accessOrder.set(key, Date.now());
        this.stats.sets++;

        return true;
    }

    /**
     * Get a value from the cache
     *
     * @param {string} key - Cache key
     * @returns {*} - Cached value or null if not found/expired
     */
    get(key) {
        const entry = this.cache.get(key);

        if (!entry) {
            this.stats.misses++;
            return null;
        }

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            this.accessOrder.delete(key);
            this.stats.misses++;
            return null;
        }

        // Update access order
        this.accessOrder.set(key, Date.now());
        this.stats.hits++;

        return entry.value;
    }

    /**
     * Check if a key exists in the cache
     *
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
        const entry = this.cache.get(key);

        if (!entry) {
            return false;
        }

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            this.accessOrder.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Delete a key from the cache
     *
     * @param {string} key - Cache key
     * @returns {boolean} - True if deleted, false if not found
     */
    delete(key) {
        this.accessOrder.delete(key);
        return this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
        this.accessOrder.clear();
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            sets: 0
        };
    }

    /**
     * Get cache statistics
     *
     * @returns {Object} - Cache statistics
     */
    getStats() {
        return {
            ...this.stats,
            size: this.cache.size,
            hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
        };
    }

    /**
     * Evict least recently used entry
     * @private
     */
    _evictLRU() {
        let oldestKey = null;
        let oldestTime = Infinity;

        for (const [key, time] of this.accessOrder.entries()) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.accessOrder.delete(oldestKey);
            this.stats.evictions++;
        }
    }

    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
                this.accessOrder.delete(key);
                cleaned++;
            }
        }

        return cleaned;
    }

    /**
     * Get all keys in the cache
     *
     * @returns {Array<string>}
     */
    keys() {
        return Array.from(this.cache.keys());
    }

    /**
     * Get cache size
     *
     * @returns {number}
     */
    size() {
        return this.cache.size;
    }
}

/**
 * Specialized cache for API responses
 */
class APICache extends CacheManager {
    constructor(options = {}) {
        super({
            maxSize: options.maxSize || 200,
            defaultTTL: options.defaultTTL || 600000, // 10 minutes
            ...options
        });
    }

    /**
     * Generate cache key from request parameters
     *
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Request parameters
     * @returns {string} - Cache key
     */
    generateKey(endpoint, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${JSON.stringify(params[key])}`)
            .join('&');

        return `${endpoint}?${sortedParams}`;
    }

    /**
     * Cache API response
     *
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Request parameters
     * @param {*} response - API response
     * @param {number} ttl - Time to live (optional)
     */
    cacheResponse(endpoint, params, response, ttl = null) {
        const key = this.generateKey(endpoint, params);
        return this.set(key, response, ttl);
    }

    /**
     * Get cached API response
     *
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Request parameters
     * @returns {*} - Cached response or null
     */
    getCachedResponse(endpoint, params) {
        const key = this.generateKey(endpoint, params);
        return this.get(key);
    }

    /**
     * Invalidate cache entries matching pattern
     *
     * @param {string|RegExp} pattern - Pattern to match
     */
    invalidatePattern(pattern) {
        const regex = typeof pattern === 'string'
            ? new RegExp(pattern)
            : pattern;

        let invalidated = 0;

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.delete(key);
                invalidated++;
            }
        }

        return invalidated;
    }
}

/**
 * Specialized cache for calculation results
 */
class CalculationCache extends CacheManager {
    constructor(options = {}) {
        super({
            maxSize: options.maxSize || 50,
            defaultTTL: options.defaultTTL || 1800000, // 30 minutes
            ...options
        });
    }

    /**
     * Generate cache key from calculation parameters
     *
     * @param {string} calculationType - Type of calculation
     * @param {Object} params - Calculation parameters
     * @returns {string} - Cache key
     */
    generateKey(calculationType, params) {
        // Create a deterministic hash of the parameters
        const paramsStr = JSON.stringify(params, Object.keys(params).sort());
        return `${calculationType}:${this._hash(paramsStr)}`;
    }

    /**
     * Cache calculation result
     *
     * @param {string} calculationType - Type of calculation
     * @param {Object} params - Calculation parameters
     * @param {*} result - Calculation result
     * @param {number} ttl - Time to live (optional)
     */
    cacheResult(calculationType, params, result, ttl = null) {
        const key = this.generateKey(calculationType, params);
        return this.set(key, result, ttl);
    }

    /**
     * Get cached calculation result
     *
     * @param {string} calculationType - Type of calculation
     * @param {Object} params - Calculation parameters
     * @returns {*} - Cached result or null
     */
    getCachedResult(calculationType, params) {
        const key = this.generateKey(calculationType, params);
        return this.get(key);
    }

    /**
     * Simple hash function for parameter objects
     * @private
     */
    _hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
}

// Create singleton instances
const globalCache = new CacheManager();
const apiCache = new APICache();
const calculationCache = new CalculationCache();

// Export classes and instances
export {
    CacheManager,
    APICache,
    CalculationCache,
    globalCache,
    apiCache,
    calculationCache
};

// CommonJS export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CacheManager,
        APICache,
        CalculationCache,
        globalCache,
        apiCache,
        calculationCache
    };
}
