/**
 * Updates an object with new values.
 * @function
 * @param {Object} obj - The object to update.
 * @param {Object} newVal - An object containing new values to update in the target object.
 * @returns {Object} The updated object.
 */
export default function updateObject(obj, newVal){
    for(let key in newVal){
        if(newVal.hasOwnProperty(key)){
            obj[key] = newVal[key];
        }
    }
    return obj;
}