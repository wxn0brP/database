import { Router } from "express";
import parseParam from "./function.js";
import { isPathSafe } from "./pathUtils.js";
const router = Router();

router.use((req, res, next) => {
    if(req.dbType == "database") return next();
    return res.status(400).json({ err: true, msg: "Invalid data center type." });
});

router.post("/getCollections", async (req, res) => {
    try{
        const db = req.dataCenter;
        const result = await db.getCollections();
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/checkCollection", async (req, res) => {
    const { collection } = req.body;
    if(!collection) return res.status(400).json({ err: true, msg: "collection is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const db = req.dataCenter;
        await db.checkCollection(collection);
        res.json({ err: false, result: true });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/issetCollection", async (req, res) => {
    const { collection } = req.body;
    if(!collection) return res.status(400).json({ err: true, msg: "collection is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const db = req.dataCenter;
        const result = await db.issetCollection(collection);
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/add", async (req, res) => {
    const { collection, data } = req.body;
    if(!collection || !data) return res.status(400).json({ err: true, msg: "collection & data is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const db = req.dataCenter;
        const result = await db.add(collection, data, req.body.id_gen || true);
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/find", async (req, res) => {
    const { collection, search, context, options, findOpts } = req.body;
    if(!collection || !search) return res.status(400).json({ err: true, msg: "collection & search is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const parsedSearch = parseParam(search);
        const db = req.dataCenter;
        const result = await db.find(collection, parsedSearch, context || {}, options || {}, findOpts || {});
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/findOne", async (req, res) => {
    const { collection, search, context, findOpts } = req.body;
    if(!collection || !search) return res.status(400).json({ err: true, msg: "collection & search is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const parsedSearch = parseParam(search);
        const db = req.dataCenter;
        const result = await db.findOne(collection, parsedSearch, context || {}, findOpts || {});
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/update", async (req, res) => {
    const { collection, search, arg, context } = req.body;
    if(!collection || !search || !arg) return res.status(400).json({ err: true, msg: "collection & search & arg is required" });

    try{
        const parsedSearch = parseParam(search);
        const parsedArg = parseParam(arg);
        const db = req.dataCenter;
        const result = await db.update(collection, parsedSearch, parsedArg, context || {});
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/updateOne", async (req, res) => {
    const { collection, search, arg, context } = req.body;
    if(!collection || !search || !arg) return res.status(400).json({ err: true, msg: "collection & search & arg is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const parsedSearch = parseParam(search);
        const parsedArg = parseParam(arg);
        const db = req.dataCenter;
        const result = await db.updateOne(collection, parsedSearch, parsedArg, context || {});
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/remove", async (req, res) => {
    const { collection, search, context } = req.body;
    if(!collection || !search) return res.status(400).json({ err: true, msg: "collection & search is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const parsedSearch = parseParam(search);
        const db = req.dataCenter;
        const result = await db.remove(collection, parsedSearch, context || {});
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/removeOne", async (req, res) => {
    const { collection, search, context } = req.body;
    if(!collection || !search) return res.status(400).json({ err: true, msg: "collection & search is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const parsedSearch = parseParam(search);
        const db = req.dataCenter;
        const result = await db.removeOne(collection, parsedSearch, context || {});
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/updateOneOrAdd", async (req, res) => {
    const { collection, search, arg, add_arg, context, id_gen } = req.body;
    if(!collection || !search || !arg) return res.status(400).json({ err: true, msg: "collection & search & arg is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    try{
        const parsedSearch = parseParam(search);
        const parsedArg = parseParam(arg);
        const parsedAddArg = parseParam(add_arg);
        const db = req.dataCenter;
        const result = await db.updateOneOrAdd(collection, parsedSearch, parsedArg, parsedAddArg || {}, context || {}, id_gen || true);
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/removeDb", async (req, res) => {
    const { name } = req.body;
    if(!name) return res.status(400).json({ err: true, msg: "name is required" });
    if(!isPathSafe(baseDir, name)) return res.status(400).json({ err: true, msg: "invalid name" });

    try{
        const db = req.dataCenter;
        const result = await db.removeDb(name);
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

export default router;