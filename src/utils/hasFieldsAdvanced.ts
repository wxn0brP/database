import { Arg } from "../types/arg";
import hasFields from "./hasFields.js";

/**
 * Checks if an object meets the criteria specified in the fields with operators.
 */
export default function hasFieldsAdvanced(obj: Object, fields: Arg){
    if(typeof fields !== "object" || fields === null){
        throw new Error("Fields must be an object");
    }

    if("$and" in fields){
        return fields["$and"].every(subFields => hasFieldsAdvanced(obj, subFields));
    }

    if("$or" in fields){
        return fields["$or"].some(subFields => hasFieldsAdvanced(obj, subFields));
    }

    // Check various conditions
    if(!checkConditions(obj, fields)) return false;
    const fieldsSubset = removeAdvancedOperators({ ...fields });
    return hasFields(obj, fieldsSubset);
}

function removeAdvancedOperators(fields: Object){
    const advancedOperators = [
        "and", "or",
        "gt", "lt", "gte", "lte", "in", "nin",
        "exists",
        "type",
        "regex",
        "arrinc", "arrincall", "size",
        "startsWith", "endsWith",
        "between",
        "not",
        "subset"
    ].map(operator => "$"+operator);
    advancedOperators.forEach(operator => delete fields[operator]);
    return fields;
}

function checkConditions(obj: Object, fields: Object){
    return (
        checkComparison(obj, fields) &&
        checkExistence(obj, fields) &&
        checkType(obj, fields) &&
        checkRegex(obj, fields) &&
        checkArrayConditions(obj, fields) &&
        checkStringConditions(obj, fields) &&
        checkBetween(obj, fields) &&
        checkNot(obj, fields) &&
        checkSubset(obj, fields)
    );
}

function checkComparison(obj: Object, fields: Object){
    const comparisonOperators = ["$gt", "$lt", "$gte", "$lte", "$in", "$nin"];
    for(const operator of comparisonOperators){
        if(operator in fields){
            for(const entries of Object.entries(fields[operator])){
                const [key, value]: [string, any] = entries;
                switch (operator){
                    case "$gt":
                        if(!(obj[key] > value)) return false;
                        break;
                    case "$lt":
                        if(!(obj[key] < value)) return false;
                        break;
                    case "$gte":
                        if(!(obj[key] >= value)) return false;
                        break;
                    case "$lte":
                        if(!(obj[key] <= value)) return false;
                        break;
                    case "$in":
                        if(!value.includes(obj[key])) return false;
                        break;
                    case "$nin":
                        if(value.includes(obj[key])) return false;
                        break;
                }
            }
        }
    }
    return true;
}

function checkExistence(obj: Object, fields: Object){
    if("$exists" in fields){
        for(const [key, shouldExist] of Object.entries(fields["$exists"])){
            if(shouldExist && !(key in obj)) return false;
            if(!shouldExist && (key in obj)) return false;
        }
    }
    return true;
}

function checkType(obj: Object, fields: Object){
    if("$type" in fields){
        for(const [key, type] of Object.entries(fields["$type"])){
            if(typeof obj[key] !== type) return false;
        }
    }
    return true;
}

function checkRegex(obj: Object, fields: Object){
    if("$regex" in fields){
        for(const [key, regex] of Object.entries(fields["$regex"])){
            if(!regex.test(obj[key])) return false;
        }
    }
    return true;
}

function checkArrayConditions(obj: Object, fields: Object){
    if("$arrinc" in fields){
        for(const [key, values] of Object.entries(fields["$arrinc"])){
            if(!Array.isArray(obj[key]) || !values.some(val => obj[key].includes(val))) return false;
        }
    }

    if("$arrincall" in fields){
        for(const [key, values] of Object.entries(fields["$arrincall"])){
            if(!Array.isArray(obj[key]) || !values.every(val => obj[key].includes(val))) return false;
        }
    }

    if("$size" in fields){
        for(const [key, size] of Object.entries(fields["$size"])){
            if(Array.isArray(obj[key]) || typeof obj[key] === "string"){
                if(obj[key].length !== size) return false;
            }else{
                return false;
            }
        }
    }

    return true;
}

function checkStringConditions(obj: Object, fields: Object){
    if("$startsWith" in fields){
        for(const [key, value] of Object.entries(fields["$startsWith"])){
            if(typeof obj[key] !== "string" || !obj[key].startsWith(value)) return false;
        }
    }

    if("$endsWith" in fields){
        for(const [key, value] of Object.entries(fields["$endsWith"])){
            if(typeof obj[key] !== "string" || !obj[key].endsWith(value)) return false;
        }
    }

    return true;
}

function checkBetween(obj: Object, fields: Object){
    if("$between" in fields){
        for(const [key, [min, max]] of Object.entries(fields["$between"])){
            if(typeof obj[key] !== "number" || obj[key] < min || obj[key] > max) return false;
        }
    }
    return true;
}

function checkNot(obj: Object, fields: Object){
    if("$not" in fields){
        return !hasFieldsAdvanced(obj, fields["$not"]);
    }
    return true;
}

function checkSubset(obj: Object, fields: Object){
    if("$subset" in fields){
        const setFields = fields["$subset"];
        return hasFields(obj, setFields);
    }
    return true;
}
