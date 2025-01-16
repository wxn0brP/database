import Id from "./Id";
import { SearchOptions } from "./searchOpts";
import { Context } from "./types";
import { UpdaterArg } from "./updater";

export interface Arg {
    _id?: Id,
    [key: string]: any
}

export type SearchFunc<T> = (data: T, context: Context) => boolean;
export type UpdaterFunc<T> = (data: T, context: Context) => boolean;

export type Search<T=any> = (Arg & SearchOptions) | SearchFunc<T>;
export type Updater<T=any> = UpdaterArg | UpdaterArg[] | UpdaterFunc<T>;