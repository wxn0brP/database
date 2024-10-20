import { createReadStream } from "fs";
import { createInterface } from "readline";

/**
 * Repairs a file path by replacing double slashes
 * @private
 * @param {string} path - The file path to repair.
 * @returns {string} The repaired file path.
 */
export function pathRepair(path){
    return path.replaceAll("//", "/");
}

/**
 * Creates a Readline interface for reading large files with a specified high water mark.
 * @private
 * @param {string} file - The file path to create a Readline interface for.
 * @returns {readline.Interface} The Readline interface.
 */
export function createRL(file){
    const read_stream = createReadStream(file, { highWaterMark: 10 * 1024 * 1024 }); //10MB
    const rl = createInterface({
        input: read_stream,
        crlfDelay: Infinity
    });
    return rl;
}