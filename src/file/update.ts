import { existsSync, promises, appendFileSync, readdirSync } from "fs";
import { pathRepair, createRL } from "./utils.js";
import { parse, stringify } from "../format.js";
import hasFieldsAdvanced from "../utils/hasFieldsAdvanced.js";
import updateObject from "../utils/updateObject.js";
import { Context } from "../types/types.js";
import { Search } from "../types/arg.js";

/**
 * Updates a file based on search criteria and an updater function or object.
 */
async function updateWorker(file: string, search: Search, updater: Search, context: Context={}, one: boolean=false){
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
 */
async function update(cpath: string, arg: Search, obj: Search, context: Context={}, one: boolean=false){
    let files = readdirSync(cpath).filter(file => !/\.tmp$/.test(file));
    files.reverse();
    let update = false;
    for(const file of files){
        const updated = await updateWorker(cpath + file, arg, obj, context, one);
        if(one && updated) return true;
        update = update || updated;
    }
    return update;
}

export default update;