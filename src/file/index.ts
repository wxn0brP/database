import update from "./update";
import remove from "./remove";
import { find, findOne } from "./find";
import FileCpu from "../types/fileCpu";
import { appendFileSync } from "fs";
import { Arg } from "../types/arg";
import { stringify } from "../format";

const vFileCpu: FileCpu = {
    add: async (file: string, data: Arg) => {
        const dataString = stringify(data);
        appendFileSync(file, dataString + "\n");
    },
    find,
    findOne,
    update,
    remove
}

export default vFileCpu;