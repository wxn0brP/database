import dbActionC from "./action.js";
import executorC from "./executor.js";
import CollectionManager from "./CollectionManager.js";
import { DbFindOpts, DbOpts, FindOpts } from "./types/options.js";
import { Arg, ArgOrFunc } from "./types/arg.js";
import Data from "./types/data.js";
import { Context } from "./types/types.js";

/**
 * Represents a database management class for performing CRUD operations.
 * @class
 */
class DataBase{
    dbAction: dbActionC;
    executor: executorC;

    constructor(folder: string, options: DbOpts={}){
        this.dbAction = new dbActionC(folder, options);
        this.executor = new executorC();
    }

    /**
     * Create a new instance of a CollectionManager class.
     */
    c(collection: string){
        return new CollectionManager(this, collection);
    }

    /**
     * Get the names of all available databases.
     */
    async getCollections(){
        return this.dbAction.getCollections();
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     */
    async checkCollection(collection: string){
        this.dbAction.checkCollection(collection);
    }

    /**
     * Check if a collection exists.
     */
    async issetCollection(collection: string){
        return this.dbAction.issetCollection(collection);
    }

    /**
     * Add data to a database.
     */
    async add(collection: string, data: Arg, id_gen: boolean=true){
        return await this.executor.addOp(this.dbAction.add.bind(this.dbAction), collection, data, id_gen) as Data;
    }

    /**
     * Find data in a database.
     */
    async find(collection: string, search: ArgOrFunc, context: Context={}, options: DbFindOpts={}, findOpts: FindOpts={}){
        return await this.executor.addOp(this.dbAction.find.bind(this.dbAction), collection, search, context, options, findOpts) as Data[];
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
    async findOne(collection: string, search: ArgOrFunc, context: Context={}, findOpts: FindOpts={}){
        return await this.executor.addOp(this.dbAction.findOne.bind(this.dbAction), collection, search, context, findOpts) as Data|null;
    }

    /**
     * Update data in a database.
     */
    async update(collection: string, search: ArgOrFunc, arg: ArgOrFunc, context={}){
        return await this.executor.addOp(this.dbAction.update.bind(this.dbAction), collection, search, arg, context) as boolean;
    }

    /**
     * Update one data entry in a database.
     */
    async updateOne(collection: string, search: ArgOrFunc, arg: ArgOrFunc, context: Context={}){
        return await this.executor.addOp(this.dbAction.updateOne.bind(this.dbAction), collection, search, arg, context) as boolean;
    }

    /**
     * Remove data from a database.
     */
    async remove(collection: string, search: ArgOrFunc, context: Context={}){
        return await this.executor.addOp(this.dbAction.remove.bind(this.dbAction), collection, search, context) as boolean;
    }

    /**
     * Remove one data entry from a database.
     */
    async removeOne(collection: string, search: ArgOrFunc, context: Context={}){
        return await this.executor.addOp(this.dbAction.removeOne.bind(this.dbAction), collection, search, context) as boolean;
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd(collection: string, search: ArgOrFunc, arg: ArgOrFunc, add_arg: Arg={}, context: Context={}, id_gen: boolean=true){
        const res = await this.updateOne(collection, search, arg, context);
        if(!res){
            const assignData = [];
            if(typeof search === "object" && !Array.isArray(search)) assignData.push(search);
            if(typeof arg === "object" && !Array.isArray(arg)) assignData.push(arg);
            if(typeof add_arg === "object" && !Array.isArray(add_arg)) assignData.push(add_arg);
            await this.add(collection, Object.assign({}, ...assignData), id_gen);
        }
        return res as boolean;
    }

    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection: string){
         this.dbAction.removeCollection(collection);
    }
}

export default DataBase;