/**
 * Predefined type for updating data.
 */

/** Arrays */
export type ArrayUpdater = {
    $push?: any,
    /** Pushes items into an array and removes duplicates */
    $pushset?: any,
    $pull?: any,
    $pullall?: any,
}

/** Objects */
export type ObjectUpdater = {
    $merge?: any,
}

/** Values */
export type ValueUpdater = {
    $set?: any,
    $inc?: any,
    $dec?: any,
    $unset?: any,
    $rename?: any,
}


export type UpdaterArg =
    ArrayUpdater &
    ObjectUpdater &
    ValueUpdater &
    { [key: string]: any };