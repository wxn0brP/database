import type DataBase from "./database.js";
import type { FindOptions } from "./findOpts.js";
import type { SearchOptions } from "./searchOpts.js";

declare class CollectionManager{
    constructor(db: DataBase, collection: string);
    
    add(data: object, id_gen?: boolean): Promise<object>;

    find(search: SearchOptions | Function, context?: object, options?: {
        max?: number,
        reverse?: boolean
    }, findOpts?: FindOptions): Promise<object[]>;

    findOne(search: SearchOptions | Function, context?: object, findOpts?: FindOptions): Promise<object | null>;

    update(search: SearchOptions | Function, arg: object | Function, context?: object): Promise<boolean>;

    updateOne(search: SearchOptions | Function, arg: object | Function, context?: object): Promise<boolean>;

    remove(search: SearchOptions | Function, context?: object): Promise<boolean>;

    removeOne(search: SearchOptions | Function, context?: object): Promise<boolean>;

    updateOneOrAdd(search: SearchOptions | Function, arg: object | Function, add_arg?: object, context?: object, id_gen?: boolean): Promise<boolean>;
}

export default CollectionManager;
export { CollectionManager };