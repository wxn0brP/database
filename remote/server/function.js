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

function parseParam(param){
    if(typeof param === "string"){
        const userFunction = changeStringToFunction(param);
        if(typeof userFunction !== "function") throw new Error("Invalid function");
        return userFunction;
    }else{
        return param;
    }
}

export default parseParam;