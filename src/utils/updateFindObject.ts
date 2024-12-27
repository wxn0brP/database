/**
 * Updates an object with new values from a findOpts object.
 * @function
 * @param {Object} obj - The object to update.
 * @param {Object} findOpts - An object containing options to update the target object.
 * @param {function} [findOpts.transform] - A function to transform the object before applying the other options.
 * @param {string[]} [findOpts.select] - An array of fields to select from the target object.
 * @param {string[]} [findOpts.exclude] - An array of fields to exclude from the target object.
 * @returns {Object} The updated object.
 */
export default function updateFindObject(obj, findOpts){
    const {
        transform,
        select,
        exclude,
    } = findOpts;

    if(typeof transform === "function") obj = transform(obj);
    
    if(Array.isArray(exclude)){
        exclude.forEach(field => {
            if(obj.hasOwnProperty(field)) delete obj[field];
        });
    }

    if(Array.isArray(select)){
        obj = select.reduce((acc, field) => {
            if(obj.hasOwnProperty(field)) acc[field] = obj[field];
            return acc;
        }, {});
    }

    return obj;
}