import Id from "./Id";
import { SearchOptions } from "./searchOpts";
import { Context } from "./types";

export interface Arg {
    _id?: Id,
    [key: string]: any
}

type SearchFunc<T> = (data: T, context: Context) => boolean;

export type Search<T=any> = (Arg & SearchOptions) | SearchFunc<T>;