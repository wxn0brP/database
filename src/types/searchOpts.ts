/**
 * Predefined Search Options Quick Reference
 * 
 * This module defines the types and structures for search operators used
 * to validate and query data objects.
 */

/** Logical Operators */
export type LogicalOperators = {
    /**
     * Recursively applies multiple conditions, all of which must evaluate to true.
     * Can include other operators such as $gt, $exists, or nested $and/$or conditions.
     */
    $and?: Array<PredefinedSearchOperators>;

    /**
     * Recursively applies multiple conditions, at least one of which must evaluate to true.
     * Can include other operators such as $lt, $type, or nested $and/$or conditions.
     */
    $or?: Array<PredefinedSearchOperators>;

    /**
     * Negates a single condition.
     * Can include any other operator as its value.
     */
    $not?: PredefinedSearchOperators;
};

/** Comparison Operators */
export type ComparisonOperators = {
    $gt?: Record<string, number>;
    $lt?: Record<string, number>;
    $gte?: Record<string, number>;
    $lte?: Record<string, number>;
    $in?: Record<string, any[]>;
    $nin?: Record<string, any[]>;
    $between?: Record<string, [number, number]>;
};

/** Type and Existence Operators */
export type TypeAndExistenceOperators = {
    $exists?: Record<string, boolean>;
    $type?: Record<string, string>;
};

/** Array Operators */
export type ArrayOperators = {
    $arrinc?: Record<string, any[]>;
    $arrincall?: Record<string, any[]>;
    $size?: Record<string, number>;
};

/** String Operators */
export type StringOperators = {
    $regex?: Record<string, RegExp>;
    $startsWith?: Record<string, string>;
    $endsWith?: Record<string, string>;
};

/** Other Operators */
export type OtherOperators = {
    $subset?: Record<string, any>;
};

/** Predefined Search Operators */
export type PredefinedSearchOperators = LogicalOperators &
    ComparisonOperators &
    TypeAndExistenceOperators &
    ArrayOperators &
    StringOperators &
    OtherOperators;

/**
 * SearchOptions can be either a function or an object with predefined operators.
 */
export type SearchOptions = PredefinedSearchOperators | ((doc: { [key: string]: any }) => boolean);