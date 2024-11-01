import CollectionManager from "../../CollectionManager.js";

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

    find(collection: string, search: object | string, context?: object, options?: object, findOpts?: object): Promise<object[]>;

    findOne(collection: string, search: object | string, context?: object, findOpts?: object): Promise<object | null>;

    update(collection: string, search: object | string, arg: object | string, context?: object): Promise<boolean>;

    updateOne(collection: string, search: object | string, arg: object | string, context?: object): Promise<boolean>;

    remove(collection: string, search: object | string, context?: object): Promise<boolean>;

    removeOne(collection: string, search: object | string, context?: object): Promise<boolean>;

    updateOneOrAdd(collection: string, search: object | string, arg: object | string, add_arg?: object | string, context?: object, id_gen?: boolean): Promise<boolean>;

    removeCollection(name: string): Promise<void>;
}

export default DataBaseRemote;
