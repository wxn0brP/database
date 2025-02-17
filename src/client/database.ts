import ky from "ky";
import CollectionManager from "../CollectionManager";
import serializeFunctions from "./function";
import { Remote, RequestData } from "./remote";
import { Arg, Search, Updater } from "../types/arg";
import { DbFindOpts, FindOpts } from "../types/options";
import { Context } from "../types/types";
import Data from "../types/data";

/**
 * Represents a database management class for performing CRUD operations.
 * Uses a remote database.
 * @class
 */
class DataBaseRemote {
    remote: Remote

    constructor(remote: Remote) {
        this.remote = remote;
    }

    /**
     * Make a request to the remote database.
     */
    async _request<T>(type: string, params = []) {
        const processed = serializeFunctions(params);
        const data: RequestData = {
            db: this.remote.name,
            params: processed.data,
            keys: processed.keys
        };
        const res = await ky.post(this.remote.url + "/db/" + type, {
            json: data,
            headers: {
                "Authorization": this.remote.auth
            },
            throwHttpErrors: false
        }).json() as { err: boolean, msg: string, result: any };

        if (res.err) throw new Error(res.msg);
        return res.result as T;
    }

    /**
     * Create a new instance of a CollectionManager class.
     */
    c(collection: string) {
        return new CollectionManager(this, collection);
    }

    /**
     * Get the names of all available databases.
     */
    async getCollections() {
        return await this._request("getCollections", []) as string[];
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     */
    async checkCollection(collection: string) {
        return await this._request("checkCollection", [collection]) as boolean;
    }

    /**
     * Check if a collection exists.
     */
    async issetCollection(collection: string) {
        return await this._request("issetCollection", [collection]) as boolean;
    }

    /**
     * Add data to a database.
     */
    async add<T = Data>(collection: string, data: Arg, id_gen = true) {
        return await this._request("add", [collection, data, id_gen]) as T;
    }

    /**
     * Find data in a database.
     */
    async find<T = Data>(collection: string, search: Search, context: Context = {}, options: DbFindOpts = {}, findOpts: FindOpts = {}) {
        return await this._request("find", [collection, search, context, options, findOpts]) as T[];
    }

    /**
     * Find one data entry in a database.
     */
    async findOne<T = Data>(collection: string, search: Search, context: Context = {}, findOpts: FindOpts = {}) {
        return await this._request("findOne", [collection, search, context, findOpts]) as (T | null);
    }

    /**
     * Update data in a database.
     */
    async update(collection: string, search: Search, updater: Updater, context: Context = {}) {
        return await this._request("update", [collection, search, updater, context]) as boolean;
    }

    /**
     * Update one data entry in a database.
     */
    async updateOne(collection: string, search: Search, updater: Updater, context: Context = {}) {
        return await this._request("updateOne", [collection, search, updater, context]) as boolean;
    }

    /**
     * Remove data from a database.
     */
    async remove(collection: string, search: Search, context: Context = {}) {
        return await this._request("remove", [collection, search, context]) as boolean;
    }

    /**
     * Remove one data entry from a database.
     */
    async removeOne(collection: string, search: Search, context: Context = {}) {
        return await this._request("removeOne", [collection, search, context]) as boolean;
    }

    /**
     * Asynchronously updates one entry in a database or adds a new one if it doesn't exist.
     */
    async updateOneOrAdd(collection: string, search: Search, arg: Search, add_arg: Arg = {}, context: Context = {}, id_gen: boolean = true) {
        return await this._request("updateOneOrAdd", [collection, search, arg, add_arg, id_gen, context]) as boolean;
    }

    /**
     * Removes a database collection from the file system.
     */
    async removeCollection(name: string) {
        return await this._request<boolean>("removeCollection", [name]) as boolean;
    }
}

export default DataBaseRemote;