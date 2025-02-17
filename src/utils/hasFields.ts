/**
 * Checks if an object matches the standard field comparison.
 * @param obj - The object to check.
 * @param fields - Criteria to compare.
 * @returns Whether the object matches the criteria.
 */
export default function hasFields(obj: Object, fields: Object): boolean {
    const keys = Object.keys(fields);
    return keys.every(key => {
        if (obj[key] !== undefined) {
            if (typeof fields[key] === "object" && fields[key] !== null) {
                return hasFields(obj[key], fields[key]);
            }
            return obj[key] === fields[key];
        }
        return false;
    });
}