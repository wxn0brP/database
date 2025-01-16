import { existsSync, promises, appendFileSync, readdirSync, cp } from "fs";
import { pathRepair, createRL } from "./utils.js";
import { parse } from "../format.js";
import hasFieldsAdvanced from "../utils/hasFieldsAdvanced.js";
import { Search } from "../types/arg.js";
import { Context } from "../types/types.js";

/**
 * Removes entries from a file based on search criteria.
 */
async function removeWorker(file: string, search: Search, context: Context={}, one: boolean=false){
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
 */
async function remove(cpath: string, arg: Search, context: Context={}, one: boolean=false){
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