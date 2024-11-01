import dbActionC from "./action.js";
import executorC from "./executor.js";
import CollectionManager from "./CollectionManager.js";

/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
class DataBase{
    /**
     * Create a new database instance.
     * @constructor
     * @param {string} folder - The folder path where the database files are stored.
     * @param {object} [options] - The options object.
     * @param {number} [options.maxFileSize=2*1024*1024] - The maximum size of a file in bytes. Default is 2 MB.
     * @param {number} 
     */
    constructor(folder, options={}){
        this.dbAction = new dbActionC(folder, options);
        this.executor = new executorC();
    }

    /**
     * Create a new instance of a CollectionManager class.
     * @function
     * @param {string} collection - The name of the collection.
     * @returns {CollectionManager} A new instance of CollectionManager.
     */
    c(collection){
        return new CollectionManager(this, collection);
    }

    /**
     * Get the names of all available databases.
     *
     * @function
     * @returns {string[]} An array of database names.
     */
    async getCollections(){
        return await this.dbAction.getCollections();
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     *
     * @function
     * @param {string} collection - The collection to check.
     */
    async checkCollection(collection){
        await this.dbAction.checkCollection(collection);
    }

    /**
     * Check if a collection exists.
     *
     * @function
     * @param {string} collection - The name of the collection.
     * @returns {boolean} True if the collection exists, false otherwise.
     */
    async issetCollection(collection){
        return await this.dbAction.issetCollection(collection);
    }

    /**
     * Add data to a database.
     *
     * @async
     * @function
     * @param {string} collection - The name of the collection.
     * @param {Object} data - The data to add.
     * @param {boolean} id_gen - Whether to generate an ID for the entry. Default is true.
     * @returns {Promise<Object>} A Promise that resolves with the added data.
     */
    async add(collection, data, id_gen=true){
        return await this.executor.addOp(this.dbAction.add.bind(this.dbAction), collection, data, id_gen);
    }

    /**
     * Find data in a database.
     *
     * @async
     * @function
     * @param {string} collection - Name of the database collection.
     * @param {function|Object} search - The query. It can be an object or a function.
     * @param {Object} context - The context object (for functions).
     * @param {Object} options - The options for the search.
     * @param {number} options.max - The maximum number of entries to return. Default is -1, meaning no limit.
     * @param {boolean} options.reverse - Whether to reverse the order of returned entries. Default is false.
     * @param {Object} findOpts - Update result object with findOpts options.
     * @returns {Promise<Array<Object>>} A Promise that resolves with the matching data.
     */
    async find(collection, search, context={}, options={}, findOpts={}){
        return await this.executor.addOp(this.dbAction.find.bind(this.dbAction), collection, search, context, options, findOpts);
    }

    /**
     * Find one data entry in a database.
     *
     * @async
     * @function
     * @param {string} collection - Name of the database collection.
     * @param {function|Object} search - The query. It can be an object or a function.
     * @param {Object} context - The context object (for functions).
     * @param {Object} findOpts - Update result object with findOpts options.
     * @returns {Promise<Object|null>} A Promise that resolves with the first matching data entry.
     */
    async findOne(collection, search, context={}, findOpts={}){
        return await this.executor.addOp(this.dbAction.findOne.bind(this.dbAction), collection, search, context, findOpts);
    }

    /**
     * Update data in a database.
     *
     * @async
     * @function
     * @param {string} collection - Name of the database collection.
     * @param {function|Object} search - The query. It can be an object or a function.
     * @param {function|Object} arg - Update arguments.
     * @param {Object} context - The context object (for functions).
     * @returns {Promise<boolean>} A Promise that resolves when the data is updated.
     */
    async update(collection, search, arg, context={}){
        return await this.executor.addOp(this.dbAction.update.bind(this.dbAction), collection, search, arg, context);
    }

    /**
     * Update one data entry in a database.
     *
     * @async
     * @function
     * @param {string} collection - Name of the database collection.
     * @param {function|Object} search - The query. It can be an object or a function.
     * @param {function|Object} arg - The query.
     * @param {Object} context - The context object (for functions).
     * @returns {Promise<boolean>} A Promise that resolves when the data entry is updated.
     */
    async updateOne(collection, search, arg, context={}){
        return await this.executor.addOp(this.dbAction.updateOne.bind(this.dbAction), collection, search, arg, context);
    }

    /**
     * Remove data from a database.
     *
     * @async
     * @function
     * @param {string} collection - Name of the database collection.
     * @param {function|Object} search - The query. It can be an object or a function.
     * @param {Object} context - The context object (for functions).
     * @returns {Promise<boolean>} A Promise that resolves when the data is removed.
     */
    async remove(collection, search, context={}){
        return await this.executor.addOp(this.dbAction.remove.bind(this.dbAction), collection, search, context);
    }

    /**
     * Remove one data entry from a database.
     *
     * @async
     * @function
     * @param {string} collection - Name of the database collection.
     * @param {function|Object} search - The query. It can be an object or a function.
     * @param {Object} context - The context object (for functions).
     * @returns {Promise<boolean>} A Promise that resolves when the data entry is removed.
     */
    async removeOne(collection, search, context={}){
        return await this.executor.addOp(this.dbAction.removeOne.bind(this.dbAction), collection, search, context);
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     *
     * @param {string} collection - Name of the database collection.
     * @param {function|Object} search - The query. It can be an object or a function.
     * @param {function|Object} arg - The search criteria for the update.
     * @param {function|Object} add_arg - The arguments to be added to the new entry.
     * @param {Object} context - The context object (for functions).
     * @param {boolean} id_gen - Whether to generate an ID for the entry. Default is true.
     * @return {Promise<boolean>} A Promise that resolves to `true` if the entry was updated, or `false` if it was added.
     */
    async updateOneOrAdd(collection, search, arg, add_arg={}, context={}, id_gen=true){
        const res = await this.updateOne(collection, search, arg, context);
        if(!res){
            const assignData = [];
            if(typeof search === "object" && !Array.isArray(search)) assignData.push(search);
            if(typeof arg === "object" && !Array.isArray(arg)) assignData.push(arg);
            if(typeof add_arg === "object" && !Array.isArray(add_arg)) assignData.push(add_arg);
            await this.add(collection, Object.assign({}, ...assignData), id_gen);
        }
        return res;
    }

    /**
     * Removes a database collection from the file system.
     *
     * @param {string} collection - The name of the collection to remove.
     * @return {void}
     */
    removeCollection(collection){
         this.dbAction.removeCollection(collection);
    }
}

export default DataBase;