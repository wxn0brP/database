import { createReadStream } from "fs";
import { createInterface } from "readline";

/**
 * Repairs a file path by replacing double slashes
 */
export function pathRepair(path: string){
    return path.replaceAll("//", "/");
}

/**
 * Creates a Readline interface for reading large files with a specified high water mark.
 */
export function createRL(file: string){
    const read_stream = createReadStream(file, { highWaterMark: 10 * 1024 * 1024 }); //10MB
    const rl = createInterface({
        input: read_stream,
        crlfDelay: Infinity
    });
    return rl;
}