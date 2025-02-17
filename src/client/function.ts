function serializeFunctions(data: Object) {
    const functionKeys: string[] = [];

    function convertFunctionToString(fn: any) {
        return typeof fn === "function" ? fn.toString() : fn;
    }

    function traverseAndSerialize(obj: Object, path: string = "") {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            const fullPath = path ? `${path}.${key.replace(/\./g, "[dot]")}` : key;

            if (typeof value === "function") {
                functionKeys.push(fullPath);
                obj[key] = convertFunctionToString(value);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (typeof item === "function") {
                        functionKeys.push(`${fullPath}[${index}]`);
                        value[index] = convertFunctionToString(item);
                    }
                });
            } else if (typeof value === "object" && value !== null) {
                traverseAndSerialize(value, fullPath);
            }
        });
    }

    traverseAndSerialize(data);
    return { data, keys: functionKeys };
}

export default serializeFunctions;