import Id from "./Id";

export interface Arg {
    _id?: Id,
    [key: string]: any
}

export type ArgOrFunc = Arg | Function;