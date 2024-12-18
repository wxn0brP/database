import { existsSync, promises, appendFileSync, readdirSync, cp } from "fs";
import { pathRepair, createRL } from "./utils.js";
import { parse } from "../format.js";
import hasFieldsAdvanced from "../utils/hasFieldsAdvanced.js";

/**
 * Removes entries from a file based on search criteria.
 * @private
 * @param {string} file - The file path to remove entries from.
 * @param {function|Object} search - The search criteria. It can be a function or an object.
 * @param {Object} context - The context object (for functions).
 * @param {boolean} [one=false] - Indicates whether to remove only one matching entry (default: false).
 * @returns {Promise<boolean>} A Promise that resolves to `true` if entries were removed, or `false` otherwise.
 */
async function removeWorker(file, search, context={}, one=false){
    file = pathRepair(file);
    if(!existsSync(file)){
        await promises.writeFile(file, "");
        return false;
    }
    await promises.copyFile(file, file+".tmp");
    await promises.writeFile(file, "");

    const rl = createRL(file+".tmp");
  
    let removed = false;
    for await(let line of rl){
        if(one && removed){
            appendFileSync(file, line+"\n");
            continue;
        }

        const data = parse(line);

        if(typeof search === "function"){
            if(search(data, context)){
                removed = true;
                continue;
            }
        }else if(typeof search === "object" && !Array.isArray(search)){
            if(hasFieldsAdvanced(data, search)){
                removed = true;
                continue;
            }
        }
        
        appendFileSync(file, line+"\n");
    }
    await promises.writeFile(file+".tmp", "");
    return removed;
}

/**
 * Asynchronously removes entries from a file based on search criteria.
 * @function
 * @param {string} cpath - Path to the collection.
 * @param {function|Object} arg - The search criteria. It can be a function or an object.
 * @param {Object} context - The context object (for functions).
 * @param {boolean} one - Indicates whether to remove only one matching entry (default: false).
 * @returns {Promise<boolean>} A Promise that resolves to `true` if entries were removed, or `false` otherwise.
 */
async function remove(cpath, arg, context={}, one){
    let files = readdirSync(cpath).filter(file => !/\.tmp$/.test(file));
    files.reverse();
    let remove = false;
    for(const file of files){
        const removed = await removeWorker(cpath + file, arg, context, one);
        if(one && removed) break;
        remove = remove || removed;
    }
    return remove;
}

export default remove;