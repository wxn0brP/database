let args = process.argv.slice(2);

if(args.length == 0){
    console.log("No arguments");
    process.exit(1);
}

import DataBase from "../../database.js";
import { addUserAccess, removeUser } from "../server/auth.js";
global.db = new DataBase("./serverDB");

switch(args.shift()){
    case "help":
        console.log("commands:");
        console.log("  add-db <type> <name> <folder> <opts>");
        console.log("  rm-db <name>");
        console.log("  list-dbs");
        console.log("  add-user <login> <password>");
        console.log("  rm-user <login>");
        console.log("  list-users");
    break;
    case "add-db":
        if(args.length < 3){
            console.log("usage: add-db <type> <name> <folder> <opts>");
            console.log("*type: 'database' or 'graph'");
            console.log("*opts: JSON object");
            process.exit(1);
        }
        const type = args[0];
        const name = args[1];
        const folder = args[2];
        const opts = args[3] ? JSON.parse(args[3]) : {};
        
        const dbExists = await global.db.findOne("dbs", { name });
        if(dbExists){
            console.log("Database already exists");
            process.exit(1);
        }

        global.db.add("dbs", {
            type,
            name,
            folder,
            opts
        }, false).then(() => console.log("Done"));
    break;
    case "rm-db":
        if(args.length < 1){
            console.log("No database name");
            process.exit(1);
        }
        global.db.removeOne("dbs", { name: args[0] }).then((res) => console.log(res ? "Done" : "Database not found"));
    break;
    case "list-dbs":
        global.db.find("dbs", {}).then(dbs => console.log(dbs));
    break;
    case "add-user":
        if(args.length < 2){
            console.log("usage: add-user <login> <password>");
            process.exit(1);
        }
        const login = args[0];
        const password = args[1];
        addUserAccess(login, password).then((res) => console.log(res.err ? res.msg : res.user._id));
    break;
    case "rm-user":
        if(args.length < 1){
            console.log("No user login or id");
            process.exit(1);
        }
        removeUser(args[0]).then((res) => console.log(res ? "Done" : "User not found"));
    break;
    case "list-users":
        global.db.find("user", {}).then(users => {
            users = users.map(u => {
                return {
                    login: u.login,
                    _id: u._id
                }
            });
            console.log(users);
        });
    break;
    default:
        console.log("Invalid argument. Use help for more info");
}