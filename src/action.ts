import { existsSync, mkdirSync, readdirSync, appendFileSync, rmSync, writeFileSync, statSync } from "fs";
import gen from "./gen.js";
import { stringify } from "./format.js";
import { find as _find, findOne as _findOne, update as _update, remove as _remove } from "./file/index.js";
import { Arg, Search, Updater } from "./types/arg.js";
import { DbFindOpts, DbOpts, FindOpts } from "./types/options.js";
import { Context } from "./types/types";
import { SortedFiles } from "./types/types";
import { SearchOptions } from "./types/searchOpts.js";
import Data from "./types/data.js";

/**
 * A class representing database actions on files.
 * @class
 */
class dbActionC{
    folder: string;
    options: DbOpts;

    /**
     * Creates a new instance of dbActionC.
     * @constructor
     * @param folder - The folder where database files are stored.
     * @param options - The options object.
     */
    constructor(folder: string, options: DbOpts){
        this.folder = folder;
        this.options = {
            maxFileSize: 2 * 1024 * 1024, //2 MB
            ...options,
        };
        
        if(!existsSync(folder)) mkdirSync(folder, { recursive: true });
    }

    _getCollectionPath(collection: string){
        return this.folder + "/" + collection + "/";
    }

    /**
     * Get a list of available databases in the specified folder.
     */
    getCollections(){
        const collections = readdirSync(this.folder, { recursive: true, withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                if(dirent.parentPath === this.folder) return dirent.name;
                return dirent.parentPath.replace(this.folder + "/", "") + "/" + dirent.name
            });

        return collections;
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     */
    checkCollection(collection: string){
        const cpath = this._getCollectionPath(collection);
        if(!existsSync(cpath)) mkdirSync(cpath, { recursive: true });
    }

    /**
     * Check if a collection exists.
     */
    issetCollection(collection: string){
        const path = this.folder + "/" + collection;
        return existsSync(path);
    }

    /**
     * Add a new entry to the specified database.
     */
    async add(collection: string, arg: Arg, id_gen: boolean=true){
        this.checkCollection(collection);
        const cpath = this._getCollectionPath(collection);
        const file = cpath + getLastFile(cpath, this.options.maxFileSize);

        if(id_gen) arg._id = arg._id || gen();
        const data = stringify(arg);
        appendFileSync(file, data+"\n");
        return arg;
    }

    /**
     * Find entries in the specified database based on search criteria.
     */
    async find(collection: string, arg: Search, context: Context={}, options: DbFindOpts={}, findOpts: FindOpts={}){
        options.reverse = options.reverse || false;
        options.max = options.max || -1;

        this.checkCollection(collection);
        const cpath = this._getCollectionPath(collection);
        const files = getSortedFiles(cpath).map(f => f.f);
        if(options.reverse) files.reverse();
        let datas = [];

        let totalEntries = 0;

        for(let f of files){
            let data = await _find(cpath + f, arg, context, findOpts) as Data[];
            if(options.reverse) data.reverse();

            if(options.max !== -1){
                if(totalEntries + data.length > options.max){
                    let remainingEntries = options.max - totalEntries;
                    data = data.slice(0, remainingEntries);
                    totalEntries = options.max;
                }else{
                    totalEntries += data.length;
                }
            }

            datas = datas.concat(data);

            if(options.max !== -1 && totalEntries >= options.max) break;
        }
        return datas;
    }

    /**
     * Find the first matching entry in the specified database based on search criteria.
     */
    async findOne(collection: string, arg: SearchOptions, context: Context={}, findOpts: FindOpts={}){
        this.checkCollection(collection);
        const cpath = this._getCollectionPath(collection);
        const files = getSortedFiles(cpath).map(f => f.f);

        for(let f of files){
            let data = await _findOne(cpath + f, arg, context, findOpts) as Data;
            if(data) return data;
        }
        return null;
    }

    /**
     * Update entries in the specified database based on search criteria and an updater function or object.
     */
    async update(collection: string, arg: Search, updater: Updater, context={}){
        this.checkCollection(collection);
        return await _update(this._getCollectionPath(collection), arg, updater, context);
    }

    /**
     * Update the first matching entry in the specified database based on search criteria and an updater function or object.
     */
    async updateOne(collection: string, arg: Search, updater: Updater, context: Context={}){
        this.checkCollection(collection);
        return await _update(this._getCollectionPath(collection), arg, updater, context, true);
    }

    /**
     * Remove entries from the specified database based on search criteria.
     */
    async remove(collection: string, arg: Search, context: Context={}){
        this.checkCollection(collection);
        return await _remove(this._getCollectionPath(collection), arg, context);
    }

    /**
     * Remove the first matching entry from the specified database based on search criteria.
     */
    async removeOne(collection: string, arg: Search, context: Context={}){
        this.checkCollection(collection);
        return await _remove(this._getCollectionPath(collection), arg, context, true);
    }

    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection: string){
        rmSync(this.folder + "/" + collection, { recursive: true, force: true });
    }
}

/**
 * Get the last file in the specified directory.
 */
function getLastFile(path: string, maxFileSize: number=1024*1024){
    if(!existsSync(path)) mkdirSync(path, { recursive: true });
    const files = getSortedFiles(path);

    if(files.length == 0){
        writeFileSync(path+"/1.db", "");
        return "1.db";
    }

    const last = files[files.length-1];
    const info = path + "/" + last.f;

    if(statSync(info).size < maxFileSize) return last.f;
    
    const num = last.i + 1;
    writeFileSync(path + "/" + num + ".db", "");
    return num+".db";
}

/**
 * Get all files in a directory sorted by name.
 */
function getSortedFiles(path: string){
    const files = readdirSync(path).filter(file => file.endsWith(".db"));
    if(files.length == 0) return [];

    const filesWithoutExt = files.map(file => parseInt(file.replace(".db", "")))
    filesWithoutExt.sort();
    
    return filesWithoutExt.map(file => {
        return {
            i: file,
            f: file+".db"
        } as SortedFiles
    });
}

export default dbActionC;