import got from "got";
import CollectionManager from "../CollectionManager.js";
import serializeFunctions from "./function.js";
import { findOptsRemote, Remote, RequestData } from "./remote.js";
import { Arg, Search, Updater } from "../types/arg";
import { DbFindOpts, FindOpts } from "../types/options.js";
import { Context } from "../types/types";
import Data from "../types/data.js";

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
    async _request<T>(type: string, data: RequestData){
        data.db = this.remote.name;
        const processed = serializeFunctions(data);
        data = {
            keys: processed.keys,
            ...processed.data
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
        return res.body.result as T;
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
        return await this._request("getCollections", {}) as string[];
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     */
    async checkCollection(collection: string){
        return await this._request("checkCollection", { collection }) as boolean;
    }

    /**
     * Check if a collection exists.
     */
    async issetCollection(collection: string){
        return await this._request("issetCollection", { collection }) as boolean;
    }

    /**
     * Add data to a database.
     */
    async add<T=Data>(collection: string, data: Arg, id_gen=true){
        return await this._request("add", { collection, data, id_gen }) as T;
    }

    /**
     * Find data in a database.
     */
    async find<T=Data>(collection: string, search: Search, context: Context={}, options: DbFindOpts={}, findOpts: FindOpts={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const findOptsRemote: findOptsRemote = {};
        if(findOpts.select) findOptsRemote.select = findOpts.select;
        if(findOpts.exclude) findOptsRemote.exclude = findOpts.exclude;
        if(findOpts.transform) findOptsRemote.transform = findOpts.transform.toString();

        return await this._request("find", { collection, search: searchStr, options, context, findOpts }) as T[];
    }

    /**
     * Find one data entry in a database.
     */
    async findOne<T=Data>(collection: string, search: Search, context: Context={}, findOpts: FindOpts={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const findOptsRemote: findOptsRemote = {};
        if(findOpts.select) findOptsRemote.select = findOpts.select;
        if(findOpts.exclude) findOptsRemote.exclude = findOpts.exclude;
        if(findOpts.transform) findOptsRemote.transform = findOpts.transform.toString();

        return await this._request("findOne", { collection, search: searchStr, context, findOpts }) as (T|null);
    }

    /**
     * Update data in a database.
     */
    async update(collection: string, search: Search, updater: Updater, context: Context={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const argStr = typeof updater === "function" ? updater.toString() : updater;
        return await this._request("update", { collection, search: searchStr, arg: argStr, context }) as boolean;
    }

    /**
     * Update one data entry in a database.
     */
    async updateOne(collection: string, search: Search, updater: Updater, context: Context={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const argStr = typeof updater === "function" ? updater.toString() : updater;
        return await this._request("updateOne", { collection, search: searchStr, arg: argStr, context }) as boolean;
    }

    /**
     * Remove data from a database.
     */
    async remove(collection: string, search: Search, context: Context={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        return await this._request("remove", { collection, search: searchStr, context }) as boolean;
    }

    /**
     * Remove one data entry from a database.
     */
    async removeOne(collection: string, search: Search, context: Context={}){
        const searchStr = typeof search === "function" ? search.toString() : search;
        return await this._request("removeOne", { collection, search: searchStr, context }) as boolean;
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd(collection: string, search: Search, arg: Search, add_arg: Arg={}, context: Context={}, id_gen: boolean=true){
        const searchStr = typeof search === "function" ? search.toString() : search;
        const argStr = typeof arg === "function" ? arg.toString() : arg;
        return await this._request("updateOneOrAdd", { collection, search: searchStr, arg: argStr, add_arg, id_gen, context }) as boolean;
    }

    /**
     * Removes a database collection from the file system.
     */
    async removeCollection(name: string){
        return await this._request<boolean>("removeCollection", { name }) as boolean;
    }
}

export default DataBaseRemote;