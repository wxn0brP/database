import DataBase from "./database";
import { Search } from "./types/arg";
import { DbFindOpts } from "./types/options";

export interface Databases {
    [key: string]: DataBase;
}

interface RelationConfig {
    from: string;
    localField: string;
    foreignField: string;
    as?: string;
    multiple?: boolean;
}

class Relation {
    private databases: Databases;

    constructor(databases: Databases) {
        this.databases = databases;
    }

    /**
     * Resolves the relation path in format 'dbName.collectionName'.
     */
    private _resolvePath(path: string): { db: DataBase; collection: string } {
        if (!path.includes(".")) {
            throw new Error(`Invalid path format "${path}". Expected format 'dbName.collectionName'.`);
        }

        const sanitizedPath = path.replace(/\\\./g, "\uffff");
        const [dbName, collectionName] = sanitizedPath.split(".", 2).map(part => part.replace(/\uffff/g, "."));

        const db = this.databases[dbName];
        if (!db) {
            throw new Error(`Database "${dbName}" not found.`);
        }

        return { db, collection: collectionName };
    }

    /**
     * Processes relations for a single item.
     */
    private async _processItemRelations(item: Record<string, any>, relations: Record<string, RelationConfig>): Promise<Record<string, any>> {
        if (!item || typeof item !== "object") return item;

        const result: Record<string, any> = { ...item };

        for (const [field, relationConfig] of Object.entries(relations)) {
            if (!relationConfig.from || !relationConfig.localField || !relationConfig.foreignField) {
                console.warn(`Skipping invalid relation configuration for field: "${field}"`);
                continue;
            }

            try {
                const { db, collection } = this._resolvePath(relationConfig.from);
                const searchQuery = { [relationConfig.foreignField]: item[relationConfig.localField] };
                const fetchFn = relationConfig.multiple ? db.find.bind(db) : db.findOne.bind(db);

                result[relationConfig.as || field] = await fetchFn(collection, searchQuery) || null;
            } catch (error) {
                console.error(`Error processing relation for field "${field}":`, error);
            }
        }

        return result;
    }

    /**
     * Finds multiple items with relations.
     */
    async find(
        path: string,
        search: Search,
        relations: Record<string, RelationConfig> = {},
        options: DbFindOpts = {}
    ): Promise<Record<string, any>[]> {
        const { db, collection } = this._resolvePath(path);
        const items = await db.find(collection, search, {}, options);
        return Promise.all(items.map(item => this._processItemRelations(item, relations)));
    }

    /**
     * Finds a single item with relations.
     */
    async findOne(
        path: string,
        search: Search,
        relations: Record<string, RelationConfig> = {}
    ): Promise<Record<string, any> | null> {
        const { db, collection } = this._resolvePath(path);
        const item = await db.findOne(collection, search);
        return item ? this._processItemRelations(item, relations) : null;
    }
}

export default Relation;
