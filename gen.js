const usedIdsMap = new Map();

/**
 * Generates a unique identifier based on specified parts.
 * @function
 * @param {number|number[]} parts - The number of parts or an array of parts.
 * @param {number} [fill=1] - The fill value for each part (default: 1).
 * @returns {string} The generated unique identifier.
 */
export default function genId(parts, fill=1){
    parts = changeInputToPartsArray(parts, fill);
    const time = getTime();
    const id = getUniqueRandom(time, parts);
    return id;
}

/**
 * Generates a unique random identifier based on time and parts.
 * @private
 * @param {string} time - The current time in a base36 string format.
 * @param {number[]} parts - An array of parts to be used for generating the identifier.
 * @param {number} [s=0] - Recursion counter for handling collision (default: 0).
 * @returns {string} The unique random identifier.
 */
function getUniqueRandom(time, partsA, s=0){
    const parts = partsA.map(l => getRandom(l));
    const id = [time, ...parts].join("-");
    if(usedIdsMap.has(id)){
        s++;
        if(s < 25) return getUniqueRandom(time, partsA, s);
        partsA = addOneToPods(partsA);
        time = getTime();
        return getUniqueRandom(time, partsA);
    }
    usedIdsMap.set(id, Date.now() + 2000);

    usedIdsMap.forEach((value, key) => {
        if(value < Date.now()) usedIdsMap.delete(key);
    });

    return id;
}

/**
 * Generates a random string of base36 characters.
 * @private
 * @param {string} unix - The Unix timestamp used for generating the random string.
 * @returns {string} The random string.
 */
function getRandom(unix){
    return (Math.floor(Math.random() * Math.pow(36, unix))).toString(36);
}

/**
 * Gets the current time in a base36 string format.
 * @private
 * @returns {string} The current time in base36.
 */
function getTime(){
    return Math.floor(new Date().getTime() / 1000).toString(36);
}

/**
 * Adds one to each part of the input array.
 * @private
 * @param {number[]} array - The input array.
 * @returns {number[]} An array with one added to each element.
 */
function addOneToPods(array){
    const sum = array.reduce((acc, current) => acc + current, 0);
    const num = sum + 1;
    const len = array.length;

    const result = [];
    const quotient = Math.floor(num / len);
    const remainder = num % len;
  
    for(let i=0; i<len; i++){
        if(i < remainder) result.push(quotient + 1);
        else result.push(quotient);
    }
  
    return result;
}

/**
 * Converts input to an array of parts.
 * @private
 * @param {number|number[]} parts - The number of parts or an array of parts.
 * @param {number} [fill=1] - The fill value for each part (default: 1).
 * @returns {number[]} An array of parts.
 */
function changeInputToPartsArray(parts, fill=1){
    if(Array.isArray(parts)) return parts;
    if(typeof parts == "number") return Array(parts).fill(fill);
    return [1, 1];
}