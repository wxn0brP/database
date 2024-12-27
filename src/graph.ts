import DataBase from "./database.js";
import Data from "./types/data.js";

/**
 * A class representing a graph database.
 * @class
 */
class Graph{
    db: DataBase
    
    constructor(databaseFolder: string){
        this.db = new DataBase(databaseFolder);
    }

    /**
     * Adds an edge between two nodes.
     */
    async add(collection: string, nodeA: string, nodeB: string){
        const sortedNodes = [nodeA, nodeB].sort();
        return await this.db.add(collection, {
            a: sortedNodes[0],
            b: sortedNodes[1]
        }, false);
    }

    /**
     * Removes an edge between two nodes.
     */
    async remove(collection: string, nodeA: string, nodeB: string){
        const sortedNodes = [nodeA, nodeB].sort();
        const query = { a: sortedNodes[0], b: sortedNodes[1] };
        return await this.db.removeOne(collection, query);
    }
    
    /**
     * Finds all edges with either node equal to `node`.
     */
    async find(collection: string, node: string){
        const edges = [];
        const edgesByANode = await this.db.find(collection, { a: node });
        const edgesByBNode = await this.db.find(collection, { b: node });

        if(edgesByANode) edges.push(...edgesByANode);
        if(edgesByBNode) edges.push(...edgesByBNode);

        return edges as Data[];
    }

    /**
     * Finds one edge with either node equal to `nodeA` and the other equal to `nodeB`.
     */
    async findOne(collection, nodeA, nodeB){
        const edgeAB = await this.db.findOne(collection, { a: nodeA, b: nodeB });
        if(edgeAB) return edgeAB as Data;

        const edgeBA = await this.db.findOne(collection, { a: nodeB, b: nodeA });
        if(edgeBA) return edgeBA as Data;

        return null;
    }

    /**
     * Gets all edges in the database.
     */
    async getAll(collection){
        return await this.db.find(collection, {}) as Data[];
    }

    /**
     * Get the names of all available databases.
     */
    async getCollections(){
        return await this.db.getCollections();
    }

    /**
     * Check and create the specified collection if it doesn't exist.
     */
    async checkCollection(collection){
        await this.db.checkCollection(collection);
    }

    /**
     * Check if a collection exists.
     */
    async issetCollection(collection){
        return await this.db.issetCollection(collection);
    }

    /**
     * Removes a database collection from the file system.
     */
    removeCollection(collection){
         this.db.removeCollection(collection);
    }
}

export default Graph;