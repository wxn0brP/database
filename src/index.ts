import DataBase from "./database.js";
import Graph from "./graph.js";
import DataBaseRemote from "./client/database.js";
import GraphRemote from "./client/graph.js";
import genId from "./gen.js";
import Relation from "./relation.js";

export {
    DataBase,
    Graph,
    DataBaseRemote,
    GraphRemote,
    Relation,
    genId
}

import type Id from "./types/Id.js";
import type { Arg, Search, Updater } from "./types/arg.js";
import type { DbFindOpts, FindOpts, DbOpts } from "./types/options.js";
import type Data from "./types/data.js";
import type { SearchOptions } from "./types/searchOpts.js";

export type {
    Id,
    Arg,
    Search,
    Updater,
    DbFindOpts,
    FindOpts,
    DbOpts,
    Data,
    SearchOptions
}