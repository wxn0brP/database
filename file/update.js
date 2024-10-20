import { existsSync, promises, appendFileSync, readdirSync } from "fs";
import { pathRepair, createRL } from "./utils.js";
import { parse, stringify } from "../format.js";
import { hasFieldsAdvanced, updateObject } from "../more.js";

/**
 * Updates a file based on search criteria and an updater function or object.
 * @private
 * @param {string} file - The file path to update.
 * @param {function|Object} search - The search criteria. It can be a function or an object.
 * @param {function|Object} updater - The updater function or object.
 * @param {Object} context - The context object (for functions).
 * @param {boolean} [one=false] - Indicates whether to update only one matching entry (default: false).
 * @returns {Promise<boolean>} A Promise that resolves to `true` if the file was updated, or `false` otherwise.
 */
async function updateWorker(file, search, updater, context={}, one=false){
    file = pathRepair(file);
    if(!existsSync(file)){
        await promises.writeFile(file, "");
        return false;
    }
    await promises.copyFile(file, file+".tmp");
    await promises.writeFile(file, "");

    const rl = createRL(file+".tmp");
  
    let updated = false;
    for await(let line of rl){
        if(one && updated){
            appendFileSync(file, line+"\n");
            continue;
        }

        const data = parse(line);
        let ob = false;

        if(typeof search === "function"){
            ob = search(data, context) || false;
        }else if(typeof search === "object" && !Array.isArray(search)){
            ob = hasFieldsAdvanced(data, search);
        }

        if(ob){
            let updateObj;
            if(typeof updater === "function"){
                updateObj = updater(data, context);
            }else if(typeof updater === "object" && !Array.isArray(updater)){
                updateObj = updateObject(data, updater);
            }
            line = await stringify(updateObj);
            updated = true;
        }
        
        appendFileSync(file, line+"\n");
    }
    await promises.writeFile(file+".tmp", "");
    return updated;
}

/**
 * Asynchronously updates entries in a file based on search criteria and an updater function or object.
 * @function
 * @param {string} folder - The folder containing the file.
 * @param {string} name - The name of the file to update.
 * @param {function|Object} arg - The search criteria. It can be a function or an object.
 * @param {function|Object} obj - The updater function or object.
 * @param {Object} context - The context object (for functions).
 * @param {boolean} one - Indicates whether to update only one matching entry (default: false).
 * @returns {Promise<boolean>} A Promise that resolves to `true` if entries were updated, or `false` otherwise.
 */
async function update(folder, name, arg, obj, context={}, one){
    let files = readdirSync(folder + "/" + name).filter(file => !/\.tmp$/.test(file));
    files.reverse();
    let update = false;
    for(const file of files){
        const updated = await updateWorker(folder + "/" + name + "/" + file, arg, obj, context, one);
        if(one && updated) return true;
        update = update || updated;
    }
    return update;
}

export default update;