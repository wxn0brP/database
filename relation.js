class Relation{
    constructor(databases){
        this.databases = databases;
    }

     /**
     * Resolves the relation path in format 'dbName.collectionName'
     * @param {string} path - Path in format 'dbName.collectionName' with support for escaped dots (\.)
     * @returns {Object} Object containing database and collection name
     * @throws {Error} If database doesn't exist
     */
     _resolvePath(path){
        const sanitizedPath = path.replace(/\\\./g, '\uffff');
        const separatorIndex = sanitizedPath.indexOf('.');

        if(separatorIndex === -1)
            throw new Error(`Invalid path format "${path}". Expected format 'dbName.collectionName'.`);

        const dbName = sanitizedPath.slice(0, separatorIndex).replace(/\uffff/g, '.');
        const collectionName = sanitizedPath.slice(separatorIndex + 1).replace(/\uffff/g, '.');

        if(!this.databases[dbName])
            throw new Error(`Database "${dbName}" not found`);

        return { db: this.databases[dbName], collection: collectionName };
    }
       
    /**
     * Processes relations for a single item
     * @param {Object} item - Item to process relations for
     * @param {Object} relations - Relations configuration
     * @returns {Promise<Object>} Processed item with resolved relations
     */
    async _processItemRelations(item, relations){
        const result = { ...item };

        for(const [field, relationConfig] of Object.entries(relations)){
            const { from, localField, foreignField, as, multiple = false } = relationConfig;
            const { db, collection } = this._resolvePath(from);

            const searchQuery = { [foreignField]: item[localField] };
            const fn = multiple ? db.find : db.findOne;
            const relatedItem = await fn(collection, searchQuery);
            result[as || field] = relatedItem;
        }

        return result;
    }

    /**
     * Finds items with relations
     * @param {string} path - Path in format 'dbName.collectionName'
     * @param {Object|Function} search - Search query or function
     * @param {Object} relations - Relations configuration
     * @param {Object} options - Search options
     * @returns {Promise<Array>} Array of items with resolved relations
     */
    async find(path, search, relations={}, options={}){
        const { db, collection } = this._resolvePath(path);
        const items = await db.find(collection, search, {}, options);

        const results = await Promise.all(
            items.map(item => this._processItemRelations(item, relations))
        );

        return results;
    }

    /**
     * Finds one item with relations
     * @param {string} path - Path in format 'dbName.collectionName'
     * @param {Object|Function} search - Search query or function
     * @param {Object} relations - Relations configuration
     * @returns {Promise<Object>} Item with resolved relations
     */
    async findOne(path, search, relations={}){
        const { db, collection } = this._resolvePath(path);
        const item = await db.findOne(collection, search);

        if (!item) return null;

        return await this._processItemRelations(item, relations);
    }
}

export default Relation;