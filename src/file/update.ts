import { existsSync, promises, readdirSync } from "fs";
import { pathRepair, createRL } from "./utils";
import { parse, stringify } from "../format";
import hasFieldsAdvanced from "../utils/hasFieldsAdvanced";
import updateObjectAdvanced from "../utils/updateObject";
import { Context } from "../types/types";
import { Search, Updater } from "../types/arg";

/**
 * Updates a file based on search criteria and an updater function or object.
 */
async function updateWorker(file: string, search: Search, updater: Updater, context: Context = {}, one: boolean = false) {
    file = pathRepair(file);
    if (!existsSync(file)) {
        await promises.writeFile(file, "");
        return false;
    }
    await promises.copyFile(file, file + ".tmp");
    await promises.writeFile(file, "");

    const rl = createRL(file + ".tmp");

    let updated = false;
    for await (let line of rl) {
        if (one && updated) {
            await promises.appendFile(file, line + "\n");
            continue;
        }

        const data = parse(line);
        let ob = false;

        if (typeof search === "function") {
            ob = search(data, context) || false;
        } else if (typeof search === "object" && !Array.isArray(search)) {
            ob = hasFieldsAdvanced(data, search);
        }

        if (ob) {
            let updateObj = data;
            if (typeof updater === "function") {
                const updateObjValue = updater(data, context);
                if (updateObjValue) updateObj = updateObjValue;
            } else if (typeof updater === "object" && !Array.isArray(updater)) {
                updateObj = updateObjectAdvanced(data, updater);
            }
            line = await stringify(updateObj);
            updated = true;
        }

        await promises.appendFile(file, line + "\n");
    }
    await promises.writeFile(file + ".tmp", "");
    return updated;
}

/**
 * Asynchronously updates entries in a file based on search criteria and an updater function or object.
 */
async function update(cpath: string, arg: Search, updater: Updater, context: Context = {}, one: boolean = false) {
    let files = readdirSync(cpath).filter(file => !/\.tmp$/.test(file));
    files.reverse();
    let update = false;
    for (const file of files) {
        const updated = await updateWorker(cpath + file, arg, updater, context, one);
        if (one && updated) return true;
        update = update || updated;
    }
    return update;
}

export default update;