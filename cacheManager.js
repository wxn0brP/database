/**
 * A cache manager for storing and managing cached data.
 * @class
 */
class CacheManager{
    /**
     * Create a new cache manager instance.
     * @constructor
     * @param {number} cacheThreshold - The threshold for caching query results.
     * @param {number} ttl - The time-to-live (TTL) for cached data in milliseconds.
     */
    constructor(cacheThreshold, ttl){
        this.queryCounterCache = {};
        this.dataCache = {};
        this.cacheThreshold = cacheThreshold;
        this.ttl = ttl;
    }

    /**
     * Increment the query counter for a specific cache key.
     * @private
     * @param {string} key - The cache key.
     * @returns {number} The updated query count for the cache key.
     */
    _incrementQueryCounter(key){
        if(!this.queryCounterCache[key]){
            this.queryCounterCache[key] = 1;
        }else{
            this.queryCounterCache[key]++;
        }
        return this.queryCounterCache[key];
    }

    /**
     * Set data in the cache for a specific cache key.
     * @private
     * @param {string} key - The cache key.
     * @param {*} data - The data to be cached.
     */
    _setCache(key, data){
        this.dataCache[key] = { data, expires: Date.now() + this.ttl };
    }

    /**
     * Get data from the cache for a specific cache key if it is not expired.
     * @param {string} key - The cache key.
     * @returns {*} The cached data if not expired, otherwise null.
     */
    getFromCache(key){
        const item = this.dataCache[key];
        if(item && Date.now() < item.expires){
            return item.data;
        }
        delete this.dataCache[key];
        return null;
    }

    /**
     * Add data to the cache if the query count exceeds the cache threshold.
     * @param {string} key - The cache key.
     * @param {*} data - The data to be cached.
     */
    addToCacheIfNeeded(key, data){
        const queryCount = this._incrementQueryCounter(key);
        if(queryCount > this.cacheThreshold){
            this._setCache(key, data);
        }
    }

    /**
     * Invalidate cache entries matching a specific key pattern.
     * @param {string} keyPattern - The key pattern to match and invalidate cache entries.
     */
    invalidateCache(keyPattern){
        Object.keys(this.dataCache).forEach(key => {
            if(key.startsWith(keyPattern)){
                delete this.dataCache[key];
            }
        });
    }
}

export default CacheManager;