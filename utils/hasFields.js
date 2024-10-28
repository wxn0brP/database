/**
 * Checks if an object matches the standard field comparison.
 * @function
 * @param {Object} obj - The object to check.
 * @param {Object} fields - Criteria to compare.
 * @returns {boolean} - Whether the object matches the criteria.
 */
export default function hasFields(obj, fields){
    const keys = Object.keys(fields);
    return keys.every(key => {
        if(obj[key]){
            if(typeof fields[key] === "object" && fields[key] !== null){
                return hasFields(obj[key], fields[key]);
            }
            return obj[key] === fields[key];
        }
        return false;
    });
}