import Id from "./Id";
import { SearchOptions } from "./searchOpts";
import { Context } from "./types";
import { UpdaterArg } from "./updater";

export interface Arg {
    _id?: Id,
    [key: string]: any
}

export type SearchFunc<T=any> = (data: T, context: Context) => boolean;
export type UpdaterFunc<T=any> = (data: T, context: Context) => boolean;

export type Search<T=any> = SearchOptions | SearchFunc<T>;
export type Updater<T=any> = UpdaterArg | UpdaterArg[] | UpdaterFunc<T>;