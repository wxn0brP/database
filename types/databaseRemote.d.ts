import type { CollectionManager } from "./CollectionManager";
import type { FindOptions } from "./findOpts";
import type { SearchOptions } from "./searchOpts";

declare class DataBaseRemote {
    remote: {
        name: string;
        auth: string;
        url: string;
    };

    constructor(remote: { name: string; auth: string; url: string });

    private _request(type: string, data: object): Promise<any>;

    c(collection: string): CollectionManager;

    getCollections(): Promise<string[]>;

    checkCollection(collection: string): Promise<void>;

    issetCollection(collection: string): Promise<boolean>;

    add(collection: string, data: object, id_gen?: boolean): Promise<object>;

    find(collection: string, search: SearchOptions | Function, context?: object, options?: {
        max?: number,
        reverse?: boolean
    }, findOpts?: FindOptions): Promise<object[]>;

    findOne(collection: string, search: SearchOptions | Function, context?: object, findOpts?: FindOptions): Promise<object | null>;

    update(collection: string, search: SearchOptions | Function, arg: object | Function, context?: object): Promise<boolean>;

    updateOne(collection: string, search: SearchOptions | Function, arg: object | Function, context?: object): Promise<boolean>;

    remove(collection: string, search: SearchOptions | Function, context?: object): Promise<boolean>;

    removeOne(collection: string, search: SearchOptions | Function, context?: object): Promise<boolean>;

    updateOneOrAdd(collection: string, search: SearchOptions | Function, arg: object | Function, add_arg?: object, context?: object, id_gen?: boolean): Promise<boolean>;

    removeCollection(collection: string): void;
}

export default DataBaseRemote;
