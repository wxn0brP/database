import express from "express";
import bodyParser from "body-parser";
import { authMiddleware, loginFunction } from "./auth.js";
import dbRouter from "./db.js";
import graphRouter from "./graph.js";
import "./initDataBases.js";
import cors from "cors";
import { configDotenv } from "dotenv";

configDotenv({ path: ".db.env" });
const port = process.env.PORT || 14785;
global.baseDir = process.env.baseDir || process.cwd();

console.log("baseDir", global.baseDir);
global.app = express();
global.app.get("/", (req, res) => res.send("Server is running."));
global.app.use(bodyParser.urlencoded({ extended: true }));
global.app.use(bodyParser.json());
global.app.use(cors({
    origin: "*",
}));

const apiDbRouter = express.Router();
apiDbRouter.use(authMiddleware);
apiDbRouter.use(checkRequest);

function checkRequest(req, res, next){
    const dbName = req.body.db;

    if(!global.dataCenter[dbName]){
        return res.status(400).json({ err: true, msg: "Invalid data center." });
    }

    req.dataCenter = global.dataCenter[dbName].db;
    req.dbType = global.dataCenter[dbName].type;

    next();
}

apiDbRouter.use("/database", dbRouter);
apiDbRouter.use("/graph", graphRouter);

global.app.use("/db/", apiDbRouter);
global.app.post("/login", async (req, res) => {
    const { login, password } = req.body;
    if(!login || !password) return res.json({ err: true, msg: "Login and password are required" });
    
    const { err, token } = await loginFunction(login, password);
    if(err) return res.json({ err: true, msg: "Invalid login or password." });
    res.json({ err: false, token });
});

global.app.post("/getDbList", authMiddleware, async (req, res) => {
    const dbsKeys = Object.keys(global.dataCenter);
    const dbs = dbsKeys.map(dbName => ({ name: dbName, type: global.dataCenter[dbName].type }));
    res.json({ err: false, result: dbs });
});

if(process.env.gui){
    let path: string;
    if(global.__dirname){
        // @ts-ignore
        path = global.__dirname;
    }else{
        // @ts-ignore
        path = import.meta.dirname;
    }
    
    global.app.use("/gui", express.static(path + "/gui"));
}

global.app.listen(port, () => console.log(`Server started on port ${port}`));