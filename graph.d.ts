import DataBase from "./database.js";

declare class Graph {
    db: DataBase;

    constructor(databaseFolder: string);

    add(collection: string, nodeA: string, nodeB: string): Promise<object>;

    remove(collection: string, nodeA: string, nodeB: string): Promise<boolean>;

    find(collection: string, node: string): Promise<object[]>;

    findOne(collection: string, nodeA: string, nodeB: string): Promise<object | null>;

    getAll(collection: string): Promise<object[]>;

    getCollections(): Promise<string[]>;

    checkCollection(collection: string): Promise<void>;

    issetCollection(collection: string): Promise<boolean>;
}

export default Graph;
