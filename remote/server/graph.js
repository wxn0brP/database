import { Router } from "express";
import { isPathSafe } from "./pathUtils.js";
const router = Router();

router.use((req, res, next) => {
    if(req.dbType == "graph") return next();
    return res.status(400).json({ err: true, msg: "Invalid data center type." });
});

router.post("/add", async (req, res) => {
    const { collection, a, b } = req.body;
    if(!collection || !a || !b) return res.status(400).json({ err: true, msg: "collection & a & b is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    const db = req.dataCenter;
    try{
        const result = await db.add(collection, a, b);
        res.json({ err: false, result });
    }catch(err){
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/find", async (req, res) => {
    const { collection, node } = req.body;
    if(!collection || !node) return res.status(400).json({ err: true, msg: "collection & node is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    const db = req.dataCenter;
    try{
        const result = await db.find(collection, node);
        res.json({ err: false, result });
    }catch(err){
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/findOne", async (req, res) => {
    const { collection, nodeA, nodeB } = req.body;
    if(!collection || !nodeA || !nodeB) return res.status(400).json({ err: true, msg: "collection & nodeA & nodeB is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    const db = req.dataCenter;
    try{
        const result = await db.findOne(collection, nodeA, nodeB);
        res.json({ err: false, result });
    }catch(err){
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/getAll", async (req, res) => {
    const { collection } = req.body;
    if(!collection) return res.status(400).json({ err: true, msg: "collection is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    const db = req.dataCenter;
    try{
        const result = await db.getAll(collection);
        res.json({ err: false, result });
    }catch(err){
        res.status(500).json({ err: true, msg: err.message });
    }
});

router.post("/remove", async (req, res) => {
    const { collection, nodeA, nodeB } = req.body;
    if(!collection || !nodeA || !nodeB) return res.status(400).json({ err: true, msg: "collection & nodeA & nodeB is required" });
    if(!isPathSafe(baseDir, collection)) return res.status(400).json({ err: true, msg: "invalid collection" });

    const db = req.dataCenter;
    try{
        const result = await db.remove(collection, nodeA, nodeB);
        res.json({ err: false, result });
    }catch(err){
        res.status(500).json({ err: true, msg: err.message });
    }
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

export default router;