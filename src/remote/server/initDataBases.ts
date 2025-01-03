import DataBase from "../../database.js";
import Graph from "../../graph.js";
global.db = new DataBase("./serverDB");
global.dataCenter = {};

global.db.find("dbs", {}).then(databases => {
    for(const db of databases){
        if(db.type === "database"){
            global.dataCenter[db.name] = {
                type: "database",
                db: new DataBase(db.folder, db.opts || {})
            }
        }else if(db.type === "graph"){
            global.dataCenter[db.name] = {
                type: "graph",
                db: new Graph(db.folder)
            }
        }
    }
})
