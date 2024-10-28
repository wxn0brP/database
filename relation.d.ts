import DataBase from "./database.js";

interface RelationConfig {
    from: string;
    localField: string;
    foreignField: string;
    as?: string;
    multiple?: boolean;
}

declare class Relation {
    constructor(databases: Record<string, DataBase>);

    private _resolvePath(path: string): { db: DataBase; collection: string };

    private _processItemRelations(item: object, relations: Record<string, any>): Promise<object>;

    find(path: string, search: object, relations?: Record<string, RelationConfig>, options?: object): Promise<Array<object>>;

    findOne(path: string, search: object, relations?: Record<string, RelationConfig>): Promise<object | null>;
}

export default Relation;