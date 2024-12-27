import { Router } from "express";
import deserializeFunctions from "./function.js";
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
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

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
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

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
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

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
    const { collection, search, context, options, findOpts, keys } = req.body;
    if(!collection || !search) return res.status(400).json({ err: true, msg: "collection & search is required" });
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });
    if(keys && !Array.isArray(keys)) return res.status(400).json({ err: true, msg: "keys must be an array" });

    try{
        const data = deserializeFunctions({ search, context, options, findOpts }, keys || []);
        const db = req.dataCenter;
        const result = await db.find(
            collection,
            data.search,
            data.context || {},
            data.options || {},
            data.findOpts || {}
        );
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/findOne", async (req, res) => {
    const { collection, search, context, findOpts, keys } = req.body;
    if(!collection || !search) return res.status(400).json({ err: true, msg: "collection & search is required" });
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });
    if(keys && !Array.isArray(keys)) return res.status(400).json({ err: true, msg: "keys must be an array" });

    try{
        const data = deserializeFunctions({ search, context, findOpts }, keys || []);
        const db = req.dataCenter;
        const result = await db.findOne(
            collection,
            data.search,
            data.context || {},
            data.findOpts || {}
        );
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/update", async (req, res) => {
    const { collection, search, arg, context, keys } = req.body;
    if(!collection || !search || !arg) return res.status(400).json({ err: true, msg: "collection & search & arg is required" });
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });
    if(keys && !Array.isArray(keys)) return res.status(400).json({ err: true, msg: "keys must be an array" });

    try{
        const data = deserializeFunctions({ search, arg, context }, keys || []);
        const db = req.dataCenter;
        const result = await db.update(
            collection,
            data.search,
            data.arg,
            data.context || {}
        )
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/updateOne", async (req, res) => {
    const { collection, search, arg, context, keys } = req.body;
    if(!collection || !search || !arg) return res.status(400).json({ err: true, msg: "collection & search & arg is required" });
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });
    if(keys && !Array.isArray(keys)) return res.status(400).json({ err: true, msg: "keys must be an array" });

    try{
        const data = deserializeFunctions({ search, arg, context }, keys || []);
        const db = req.dataCenter;
        const result = await db.updateOne(
            collection,
            data.search,
            data.arg,
            data.context || {}
        )
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/remove", async (req, res) => {
    const { collection, search, context, keys } = req.body;
    if(!collection || !search) return res.status(400).json({ err: true, msg: "collection & search is required" });
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });
    if(keys && !Array.isArray(keys)) return res.status(400).json({ err: true, msg: "keys must be an array" });

    try{
        const data = deserializeFunctions({ search, context }, keys || []);
        const db = req.dataCenter;
        const result = await db.remove(
            collection,
            data.search,
            data.context || {}
        )
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/removeOne", async (req, res) => {
    const { collection, search, context, keys } = req.body;
    if(!collection || !search) return res.status(400).json({ err: true, msg: "collection & search is required" });
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });
    if(keys && !Array.isArray(keys)) return res.status(400).json({ err: true, msg: "keys must be an array" });

    try{
        const data = deserializeFunctions({ search, context }, keys || []);
        const db = req.dataCenter;
        const result = await db.removeOne(
            collection,
            data.search,
            data.context || {}
        )
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/updateOneOrAdd", async (req, res) => {
    const { collection, search, arg, add_arg, context, id_gen, keys } = req.body;
    if(!collection || !search || !arg) return res.status(400).json({ err: true, msg: "collection & search & arg is required" });
    if(!isPathSafe(global.baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });
    if(keys && !Array.isArray(keys)) return res.status(400).json({ err: true, msg: "keys must be an array" });

    try{
        const data = deserializeFunctions({ search, arg, add_arg, context }, keys || []);
        const db = req.dataCenter;
        const result = await db.updateOneOrAdd(
            collection,
            data.search,
            data.arg,
            data.add_arg || {},
            data.context || {},
            id_gen || true
        );
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/removeCollection", async (req, res) => {
    const { name } = req.body;
    if(!name) return res.status(400).json({ err: true, msg: "name is required" });
    if(!isPathSafe(global.baseDir, name)) return res.status(400).json({ err: true, msg: "invalid name" });

    try{
        const db = req.dataCenter;
        const result = await db.removeCollection(name);
        res.json({ err: false, result });
    }catch(err){
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
    }
});

export default router;