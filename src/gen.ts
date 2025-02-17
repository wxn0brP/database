import Id from "./types/Id";

const usedIdsMap = new Map();

/**
 * Generates a unique identifier based on specified parts.
 */
export default function genId(parts: number | number[] = null, fill: number = 1) {
    parts = changeInputToPartsArray(parts, fill);
    const time = getTime();
    const id = getUniqueRandom(time, parts);
    return id as Id;
}

/**
 * Generates a unique random identifier based on time and parts.
 * @param time - The current time in a base36 string format.
 * @param parts - An array of parts to be used for generating the identifier.
 * @param s - Recursion counter for handling collision (default: 0).
 * @returns The unique random identifier.
 */
function getUniqueRandom(time: string, partsA: number[], s: number = 0): string {
    const parts = partsA.map(l => getRandom(l));
    const id = [time, ...parts].join("-");
    if (usedIdsMap.has(id)) {
        s++;
        if (s < 25) return getUniqueRandom(time, partsA, s);
        partsA = addOneToPods(partsA);
        time = getTime();
        return getUniqueRandom(time, partsA);
    }
    usedIdsMap.set(id, Date.now() + 2000);

    usedIdsMap.forEach((value, key) => {
        if (value < Date.now()) usedIdsMap.delete(key);
    });

    return id;
}

/**
 * Generates a random string of base36 characters.
 */
function getRandom(unix: number) {
    return (Math.floor(Math.random() * Math.pow(36, unix))).toString(36);
}

/**
 * Gets the current time in a base36 string format.
 */
function getTime() {
    return Math.floor(new Date().getTime() / 1000).toString(36);
}

/**
 * Adds one to each part of the input array.
 */
function addOneToPods(array: number[]) {
    const sum = array.reduce((acc, current) => acc + current, 0);
    const num = sum + 1;
    const len = array.length;

    const result = [];
    const quotient = Math.floor(num / len);
    const remainder = num % len;

    for (let i = 0; i < len; i++) {
        if (i < remainder) result.push(quotient + 1);
        else result.push(quotient);
    }

    return result;
}

/**
 * Converts input to an array of parts.
 */
function changeInputToPartsArray(parts: number | number[] = null, fill: number = 1) {
    if (Array.isArray(parts)) return parts;
    if (typeof parts == "number") return Array(parts).fill(fill);
    return [1, 1];
}