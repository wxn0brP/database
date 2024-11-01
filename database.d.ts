import dbActionC from "./action.js";
import executorC from "./executor.js";
import CollectionManager from "./CollectionManager.js";

declare class DataBase {
    constructor(folder: string, options?: {
        cacheThreshold?: number,
        cacheTTL?: number
    });

    dbAction: dbActionC;
    executor: executorC;

    c(collection: string): CollectionManager;

    getCollections(): Promise<string[]>;

    checkCollection(collection: string): Promise<void>;

    issetCollection(collection: string): Promise<boolean>;

    add(collection: string, data: object, id_gen?: boolean): Promise<object>;

    find(collection: string, search: object | Function, context?: object, options?: {
        max?: number,
        reverse?: boolean
    }, findOpts?: object): Promise<object[]>;

    findOne(collection: string, search: object | Function, context?: object, findOpts?: object): Promise<object | null>;

    update(collection: string, search: object | Function, arg: object | Function, context?: object): Promise<boolean>;

    updateOne(collection: string, search: object | Function, arg: object | Function, context?: object): Promise<boolean>;

    remove(collection: string, search: object | Function, context?: object): Promise<boolean>;

    removeOne(collection: string, search: object | Function, context?: object): Promise<boolean>;

    updateOneOrAdd(collection: string, search: object | Function, arg: object | Function, add_arg?: object, context?: object, id_gen?: boolean): Promise<boolean>;

    removeCollection(collection: string): void;
}

export default DataBase;
