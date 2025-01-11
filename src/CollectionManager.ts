import DataBase from "./database.js";
import DataBaseRemote from "./client/database.js";
import { Arg, ArgOrFunc } from "./types/arg.js";
import { DbFindOpts, FindOpts } from "./types/options.js";
import { Context } from "./types/types.js";

class CollectionManager{
    db: DataBase | DataBaseRemote;
    collection: string;

    constructor(db: DataBase | DataBaseRemote, collection: string){
        this.db = db;
        this.collection = collection;
    }

    /**
     * Add data to a database.
     */
    async add(data: Arg, id_gen: boolean=true){
        return await this.db.add(this.collection, data, id_gen);
    }

    /**
     * Find data in a database.
     */
    async find(search: ArgOrFunc, context: Context={}, options: DbFindOpts={}, findOpts: FindOpts={}){
        return await this.db.find(this.collection, search, context, options, findOpts);
    }

    /**
     * Find one data entry in a database.
     */
    async findOne(search: ArgOrFunc, context: Context={}, findOpts: FindOpts={}){
        return await this.db.findOne(this.collection, search, context, findOpts);
    }

    /**
     * Update data in a database.
     */
    async update(search: ArgOrFunc, arg: ArgOrFunc, context: Context={}){
        return await this.db.update(this.collection, search, arg, context);
    }

    /**
     * Update one data entry in a database.
     */
    async updateOne(search: ArgOrFunc, arg: ArgOrFunc, context: Context={}){
        return await this.db.updateOne(this.collection, search, arg, context);
    }

    /**
     * Remove data from a database.
     */
    async remove(search: ArgOrFunc, context: Context={}){
        return await this.db.remove(this.collection, search, context);
    }

    /**
     * Remove one data entry from a database.
     */
    async removeOne(search: ArgOrFunc, context: Context={}){
        return await this.db.removeOne(this.collection, search, context);
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd(search: ArgOrFunc, arg: ArgOrFunc, add_arg: Arg={}, context: Context={}, id_gen: boolean=true){
        return await this.db.updateOneOrAdd(this.collection, search, arg, add_arg, context, id_gen);
    }
}

export default CollectionManager;
