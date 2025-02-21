import Id from "./types/Id";

const usedIdsMap = new Map();
let lastId: Id;
const recentIdsTimestamps: number[] = [];
let startIndex = 0;
let lastGeneratedMs = 0;
let lastRandomValue = 0;

/**
 * Generates a unique random identifier based on time and parts.
 *
 * @param {number[]} [parts] - an array of lengths of parts of the identifier
 * @returns {Id} - a new unique identifier
 */
export default function genId(parts: number[] = null): Id {
    if (parts === null) parts = [1, 1];

    const time = getTime();
    const id = getUniqueRandom({
        time,
        partsSchema: parts,
        s: 0,
    });
    return id;
}

interface GetUniqueRandomOpts {
    time: string,
    partsSchema: number[],
    s: number
}

/**
 * Generates a unique random identifier based on time and parts.
 */
function getUniqueRandom(opts: GetUniqueRandomOpts): string {
    while (true) {
        let minValue = 0;
        if (lastId) {
            const parts = lastId.split("-");
            const lastTime = parts.shift();
            if (lastTime === opts.time) {
                const int36 = parts.join("");
                minValue = parseInt(int36, 36) + 1;
            }
        }

        const partsLengthSum = opts.partsSchema.reduce((acc, num) => acc + num, 0);
        const partsData = generateBase36InRange(minValue, partsLengthSum);
        const parts = splitStringByArray(opts.partsSchema, partsData);

        const id = [opts.time, ...parts].join("-");

        if (!usedIdsMap.has(id)) {
            usedIdsMap.set(id, true);
            setTimeout(() => usedIdsMap.delete(id), 1000);
            lastId = id;
            return id;
        }
        opts.s++;
        if (opts.s >= partsLengthSum) {
            opts.time = getTime();
            opts.s = 0;
        }
    }
}

/**
 * Tracks the current load of the application by counting the number of ids that have been generated in the last second.
 * @returns The number of ids that have been generated in the last second.
 */
function trackLoad() {
    const now = Date.now();
    recentIdsTimestamps.push(now);

    while (startIndex < recentIdsTimestamps.length && recentIdsTimestamps[startIndex] < now - 1) {
        startIndex++;
    }

    return recentIdsTimestamps.length - startIndex;
}

/**
 * Generates a base-36 encoded string with a specified length based on a random value within a range.
 * 
 * The function calculates a random value within the base-36 range determined by the provided
 * `minValue` and `length`. It uses a bias mechanism to adjust the randomness based on the
 * current load, ensuring unique generation over short periods. If the system load is low or
 * the current millisecond has changed, a new random value is generated. Otherwise, the random
 * value is incremented by a small amount with certain probabilities.
 *
 * @param minValue - The minimum value for the base-36 encoded number.
 * @param length - The length of the resulting base-36 string.
 * @returns A base-36 encoded string representation of the random value, padded to the specified length.
 */

function generateBase36InRange(minValue: number, length: number): string {
    const maxValue = Math.pow(36, length) - 1;
    const load = trackLoad();
    const currentMs = Date.now();

    if (load < 3 || currentMs !== lastGeneratedMs) {
        lastRandomValue = biasedRandomInRange(minValue, maxValue);
        lastGeneratedMs = currentMs;
    } else {
        const rand = Math.random();
        if (rand < 0.6) {
            lastRandomValue += 1;
        } else if (rand < 0.9) {
            lastRandomValue += 2;
        } else {
            lastRandomValue = biasedRandomInRange(lastRandomValue, maxValue);
        }
    }

    return lastRandomValue.toString(36).padStart(length, "0");
}

/**
 * Generates a random number between the specified range, but with a bias towards the lower
 * end of the range. The bias is calculated as the cube root of the random value, which
 * will make the random value more likely to be closer to the minimum value.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A random number between the specified range, with a bias towards the lower end.
 */
function biasedRandomInRange(min: number, max: number): number {
    let randomValue = min;
    const bias = Math.pow(Math.random(), 3);
    randomValue = Math.floor(min + (max - min) * bias);
    return Math.min(randomValue, max);
}

/**
 * Splits a string into an array of substrings, where each substring is determined by
 * the values in the provided array.
 *
 * @param arr - An array of numbers, where each number represents the length of a substring.
 * @param str - The string to split.
 * @returns An array of substrings, where each element is a substring of the original string,
 *          determined by the corresponding element in the provided array.
 */
function splitStringByArray(arr: number[], str: string) {
    let start = 0;
    return arr.map(length => str.slice(start, start += length));
}

/**
 * Gets the current time in a base36 string format.
 */
function getTime() {
    return new Date().getTime().toString(36);
}