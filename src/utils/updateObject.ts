import { UpdaterArg } from "../types/updater.js";

/**
 * Updates an object with new values.
 * @param obj - The object to update.
 * @param fields - An object containing new values to update in the target object.
 */
export default function updateObjectAdvanced(obj: any, fields: UpdaterArg | UpdaterArg[]) {
    if (typeof fields !== "object" || fields === null) {
        throw new Error("Fields must be an object or object array");
    }

    const fieldsArray = Array.isArray(fields) ? fields : [fields];

    for (const field of fieldsArray) {
        if (typeof field !== "object" || field === null) {
            throw new Error("Fields must be an object or object array");
        }

        updateAdvanced(obj, field);
        const fieldsSubset = removeAdvancedOperators({ ...field });
        updateObject(obj, fieldsSubset);
    }

    return obj;
}

function updateAdvanced(obj: any, fields: UpdaterArg) {
    updateArray(obj, fields);
    updateNested(obj, fields);
    updateIncrement(obj, fields);
    updateUnset(obj, fields);
    updateRename(obj, fields);
}

function removeAdvancedOperators(fields: any) {
    const advancedOperators = [
        "push", "pushset", "pull", "pullall",
        "inc", "dec",
        "unset",
        "merge",
        "rename"
    ].map(operator => "$" + operator);
    advancedOperators.forEach(operator => delete fields[operator]);
    return fields;
}

function updateArray(obj: any, fields: UpdaterArg) {
    if ("$push" in fields) {
        for (const [key, value] of Object.entries(fields["$push"])) {
            if (Array.isArray(obj[key])) {
                obj[key].push(value);
            } else {
                obj[key] = [value];
            }
        }
    }

    if ("$pushset" in fields) {
        for (const [key, value] of Object.entries(fields["$pushset"])) {
            if (Array.isArray(obj[key])) {
                obj[key].push(value);
            } else {
                obj[key] = [value];
            }
            obj[key] = [...new Set(obj[key])];
        }
    }

    if ("$pull" in fields) {
        for (const [key, value] of Object.entries(fields["$pull"])) {
            if (Array.isArray(obj[key])) {
                obj[key] = obj[key].filter(item => item !== value);
            }
        }
    }

    if ("$pullall" in fields) {
        for (const [key, values] of Object.entries(fields["$pullall"])) {
            if (Array.isArray(obj[key])) {
                obj[key] = obj[key].filter(item => !(values as string[]).includes(item));
            }
        }
    }
}

function updateNested(obj: any, fields: UpdaterArg) {
    if ("$merge" in fields) {
        for (const [key, value] of Object.entries(fields["$merge"])) {
            if (typeof obj[key] === "object" && typeof value === "object") {
                obj[key] = { ...obj[key], ...value };
            } else {
                obj[key] = value;
            }
        }
    }
}

function updateIncrement(obj: any, fields: UpdaterArg) {
    if ("$inc" in fields) {
        for (const [key, value] of Object.entries(fields["$inc"])) {
            if (typeof obj[key] === "number" && typeof value === "number") {
                obj[key] += value;
            } else if (!(key in obj)) {
                obj[key] = value;
            } else {
                throw new Error(`Cannot increment non-numeric value at key: ${key}`);
            }
        }
    }

    if ("$dec" in fields) {
        for (const [key, value] of Object.entries(fields["$dec"])) {
            if (typeof obj[key] === "number" && typeof value === "number") {
                obj[key] -= value;
            } else if (!(key in obj)) {
                obj[key] = value;
            } else {
                throw new Error(`Cannot decrement non-numeric value at key: ${key}`);
            }
        }
    }
}

function updateUnset(obj: any, fields: UpdaterArg) {
    if ("$unset" in fields) {
        for (const key of Object.keys(fields["$unset"])) {
            delete obj[key];
        }
    }
}

function updateRename(obj: any, fields: UpdaterArg) {
    if ("$rename" in fields) {
        for (const [oldKey, newKey] of Object.entries(fields["$rename"])) {
            if (oldKey in obj) {
                obj[newKey as string] = obj[oldKey];
                delete obj[oldKey];
            }
        }
    }
}

/**
 * Updates an object with new values.
 * @param obj - The object to update.
 * @param newVal - An object containing new values to update in the target object.
 */
function updateObject(obj: any, newVal: UpdaterArg) {
    for (let key in newVal) {
        if (newVal.hasOwnProperty(key)) {
            obj[key] = newVal[key];
        }
    }
    return obj;
}
