import databaseC from "./database.js";
import graphC from "./graph.js";

export async function DataBase(remote){
    return new databaseC(remote);
}

export async function Graph(remote){
    return new graphC(remote);
}