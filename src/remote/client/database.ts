import got from "got";
import CollectionManager from "../../CollectionManager.js";
import serializeFunctions from "./function.js";
import { findOptsRemote, Remote, RequestData } from "./remote.js";
import { Arg, ArgOrFunc } from "../../types/arg";
import { DbFindOpts, FindOpts } from "../../types/options.js";
import { Context } from "../../types/types";

/**
 * Represents a database management class for performing CRUD operations.
 * Uses a remote database.
 * @class
 */
class DataBaseRemote{
    remote: Remote

    constructor(remote: Remote){
        this.remote = remote;
    }

    /**
     * Make a request to the remote database.
     */
    async _request(type: string, data: RequestData){
        data.db = this.remote.name;
        const procesed = serializeFunctions(data);
        data = {
            keys: procesed.keys,
            ...procesed.data
        }
        const res = await got.post(this.remote.url + "/db/database/" + type, {
            // @ts-ignore: Some jerk can't do the types correctly.
            body: data,
            headers: {
                "Authorization": this.remote.auth
            },
            json: true,
            responseType: "json"
        });

        if(res.body.err) throw new Error(res.body.msg);
        return res.body.result;
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
        return await this._request("getCollections", {});
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     */
    async checkCollection(collection: string){
        return await this._request("checkCollection", { collection });
    }

    /**
     * Check if a collection exists.
     */
    async issetCollection(collection){
        return await this._request("issetCollection", { collection });
    }

    /**
     * Add data to a database.
     */
    async add(collection, data, id_gen=true){
        return await this._request("add", { collection, data, id_gen });
    }

    /**
     * Find data in a database.
     */
    async find(collection: string, search: ArgOrFunc, context: Context={}, options: DbFindOpts={}, findOpts: FindOpts={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const findOptsRemote: findOptsRemote = {};
        if(findOpts.select) findOptsRemote.select = findOpts.select;
        if(findOpts.exclude) findOptsRemote.exclude = findOpts.exclude;
        if(findOpts.transform) findOptsRemote.transform = findOpts.transform.toString();

        return await this._request("find", { collection, search: searchStr, options, context, findOpts });
    }

    /**
     * Find one data entry in a database.
     */
    async findOne(collection: string, search: ArgOrFunc, context: Context={}, findOpts: FindOpts={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const findOptsRemote: findOptsRemote = {};
        if(findOpts.select) findOptsRemote.select = findOpts.select;
        if(findOpts.exclude) findOptsRemote.exclude = findOpts.exclude;
        if(findOpts.transform) findOptsRemote.transform = findOpts.transform.toString();

        return await this._request("findOne", { collection, search: searchStr, context, findOpts });
    }

    /**
     * Update data in a database.
     */
    async update(collection: string, search: ArgOrFunc, arg: ArgOrFunc, context: Context={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const argStr = typeof arg === "function" ? arg.toString() : arg;
        return await this._request("update", { collection, search: searchStr, arg: argStr, context });
    }

    /**
     * Update one data entry in a database.
     */
    async updateOne(collection: string, search: ArgOrFunc, arg: ArgOrFunc, context: Context={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const argStr = typeof arg === "function" ? arg.toString() : arg;
        return await this._request("updateOne", { collection, search: searchStr, arg: argStr, context });
    }

    /**
     * Remove data from a database.
     */
    async remove(collection: string, search: ArgOrFunc, context: Context={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        return await this._request("remove", { collection, search: searchStr, context });
    }

    /**
     * Remove one data entry from a database.
     */
    async removeOne(collection: string, search: ArgOrFunc, context: Context={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        return await this._request("removeOne", { collection, search: searchStr, context });
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd(collection: string, search: ArgOrFunc, arg: ArgOrFunc, add_arg: Arg={}, context: Context={}, id_gen: boolean=true){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const argStr = typeof arg === "function" ? arg.toString() : arg;
        return await this._request("updateOneOrAdd", { collection, search: searchStr, arg: argStr, add_arg, id_gen, context });
    }

    /**
     * Removes a database collection from the file system.
     */
    removeCollection(name: string){
        return this._request("removeCollection", { name });
    }
}

export default DataBaseRemote;