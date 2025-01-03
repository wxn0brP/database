import { existsSync, promises } from "fs";
import { pathRepair, createRL } from "./utils.js";
import { parse } from "../format.js";
import hasFieldsAdvanced from "../utils/hasFieldsAdvanced.js";
import updateFindObject from "../utils/updateFindObject.js";
import { ArgOrFunc } from "../types/arg.js";
import { Context } from "../types/types.js";
import { SearchOptions } from "../types/searchOpts.js";
import { FindOpts } from "../types/options.js";

/**
 * Processes a line of text from a file and checks if it matches the search criteria.
 */
async function findProcesLine(arg: ArgOrFunc, line: string, context: Context={}, findOpts: FindOpts={}){
    const ob = parse(line);
    let res = false;
    
    if(typeof arg === "function"){
        if(arg(ob, context)) res = true;
    }else if(typeof arg === "object" && !Array.isArray(arg)){
        if(hasFieldsAdvanced(ob, arg)) res = true;
    }

    if(res) return updateFindObject(ob, findOpts);
    return null;
}

/**
 * Asynchronously finds entries in a file based on search criteria.
 */
export async function find(file: string, arg: ArgOrFunc, context: Context={}, findOpts: FindOpts={}){
    file = pathRepair(file);
    return await new Promise(async (resolve) => {
        if(!existsSync(file)){
            await promises.writeFile(file, "");
            resolve(false);
            return;
        }
        const rl = createRL(file);
        const resF = [];
        for await(const line of rl){
            if(line == "" || !line) continue;

            const res = await findProcesLine(arg, line, context, findOpts);
            if(res) resF.push(res); 
        };
        resolve(resF);
        rl.close();
    })
}

/**
 * Asynchronously finds one entry in a file based on search criteria.
 */
export async function findOne(file: string, arg: ArgOrFunc, context: Context={}, findOpts: FindOpts={}){
    file = pathRepair(file);
    return await new Promise(async (resolve) => {
        if(!existsSync(file)){
            await promises.writeFile(file, "");
            resolve(false);
            return;
        }
        const rl = createRL(file);
        for await(const line of rl){
            if(line == "" || !line) continue;

            const res = await findProcesLine(arg, line, context, findOpts);
            if(res){
                resolve(res);
                rl.close();
            }
        };
        resolve(false);
    });
}