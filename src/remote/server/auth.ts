import jwt from "jwt-simple";
import NodeCache from "node-cache";
import getSecret from "./secret.js";
import crypto from "crypto";

const TOKEN_CACHE_TTL = parseInt(process.env.TOKEN_CACHE_TTL) || 900; // 15 minutes
const cache = new NodeCache({ stdTTL: TOKEN_CACHE_TTL, checkperiod: TOKEN_CACHE_TTL });
const secret = getSecret();

export async function authMiddleware(req, res, next){
    const token = req.headers["authorization"];
    if(!token){
        return res.status(401).json({ err: true, msg: "Access denied. No token provided." });
    }

    if(cache.has(token)){
        req.user = cache.get(token);
        return next();
    }

    try{
        const user = jwt.decode(token, secret);
        if(!user || !user._id){
            return res.status(401).json({ err: true, msg: "Invalid token." });
        }

        const tokenD = await global.db.findOne("token", { token });
        if(!tokenD){
            return res.status(401).json({ err: true, msg: "Invalid token." });
        }

        const userD = await global.db.findOne("user", { _id: user._id });
        if(!userD){
            return res.status(401).json({ err: true, msg: "Invalid token." });
        }
        
        req.user = user;
        cache.set(token, user);
        next();
    }catch(err){
        res.status(400).json({ err: true, msg: "An error occurred during authentication." });
    }
}

export async function loginFunction(login, password){
    const { err, user } = await checkUserAccess(login, password);
    if(err){
        return { err: true, msg: "Invalid login or password." };
    }

    const token = await generateToken({ _id: user._id });
    cache.set(token, user);
    return { err: false, token };
}

export async function generateToken(payload){
    const token = jwt.encode(payload, secret);
    await global.db.add("token", { token }, false);
    return token;
}

export async function removeToken(token){
    return await global.db.removeOne("token", { token });
}

export async function addUserAccess(login, password){
    if(!/^[a-zA-Z0-9]+$/.test(login)) return { err: true, msg: "Login can only contain letters and numbers." };
    if(login.length < 3 || login.length > 10) return { err: true, msg: "Login must be between 3 and 10 characters." };
    if(password.length < 8 || password.length > 300) return { err: true, msg: "Password must be between 8 and 300 characters." };

    const userExists = await global.db.findOne("user", { login });
    if(userExists) return { err: true, msg: "Login already exists." };

    password = generateHash(password);

    const user = await global.db.add("user", {
        login,
        password
    });
    return { err: false, user };
}

export async function checkUserAccess(login, password){
    const user = await global.db.findOne("user", { login });
    if(!user) return { err: true, msg: "Invalid login or password." };

    const hash = generateHash(password);
    if(hash !== user.password) return { err: true, msg: "Invalid login or password." };

    delete user.password;
    return { err: false, user };
}

export async function removeUser(idOrLogin){
    return await global.db.removeOne("user", { $or: [{ _id: idOrLogin }, { login: idOrLogin }] });
}

function generateHash(password){
    return crypto.createHash("sha256").update(password).digest("hex");
}