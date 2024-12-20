import { createContext, runInContext } from "node:vm";

const sandbox = {
    console: {
        log: console.log,
    },
    Math,
    Date,
    setTimeout: undefined,
    setInterval: undefined,
    setImmediate: undefined,
    clearTimeout: undefined,
    clearInterval: undefined,
    clearImmediate: undefined,
    require: undefined,
    module: undefined,
    exports: undefined,
    process: undefined,
    Buffer: undefined,
};

const context = createContext(sandbox);

function changeStringToFunction(func){
    try{
        const userFunction = runInContext(`(${func})`, context);
        return userFunction;
    }catch(e){
        throw new Error("Invalid function");
    }
}

function deserializeFunctions(data, keys){
    const setAtPath = (obj, path, value) => {
        const segments = path.split(".").map(segment => segment.replace(/\[dot\]/g, "."));
        let currentLevel = obj;

        for(let i = 0; i < segments.length - 1; i++){
            const segment = segments[i];
            if(Array.isArray(currentLevel)){
                const index = parseInt(segment, 10);
                if(!currentLevel[index]) currentLevel[index] = {};
                currentLevel = currentLevel[index];
            }else if(!currentLevel[segment]){
                currentLevel[segment] = {};
                currentLevel = currentLevel[segment];
            }else{
                currentLevel = currentLevel[segment];
            }
        }

        currentLevel[segments[segments.length - 1]] = value;
    };

    const getAtPath = (obj, path) => {
        const segments = path.split(".").map(key => key.replace(/\[dot\]/g, "."));
        return segments.reduce((acc, key) => {
            if(Array.isArray(acc)){
                const index = parseInt(key, 10);
                return acc[index];
            }
            return acc && acc[key];
        }, obj);
    };

    keys.forEach((keyPath) => {
        const value = getAtPath(data, keyPath);

        if(typeof value === "string"){
            const fn = changeStringToFunction(value);
            setAtPath(data, keyPath, fn);
        }else if(typeof value === "object" && value !== null){
            if(Array.isArray(value)){
                value.forEach((item, index) => {
                    if(typeof item === "string"){
                        value[index] = changeStringToFunction(item);
                    }
                });
            }else{
                Object.keys(value).forEach((key) => {
                    if(typeof value[key] === "string"){
                        value[key] = changeStringToFunction(value[key]);
                    }
                });
            }
        }
    });

    return data;
}

export default deserializeFunctions;