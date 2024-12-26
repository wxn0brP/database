/**
 * Predefined Find Options Quick Reference (Post Data-Matching Processing)
 * 
 * This module defines the types and structures for post-processing options applied
 * after database objects are matched but before returning to the client.
 */

type TransformFunction = (doc: Record<string, any>) => Record<string, any>;

/** Find Options Structure */
export interface FindOptions {
    /**
     * `select`: Specifies the fields to include in the final object.
     * Example:
     * select: ["name", "email"]
     */
    select?: string[];

    /**
     * `exclude`: Specifies the fields to exclude from the final object.
     * Example:
     * exclude: ["password", "internalId"]
     */
    exclude?: string[];

    /**
     * `transform`: Custom transformation function to modify the object.
     * Example:
     * transform: (doc) => {
     *   doc.name = doc.name.toUpperCase();
     *   return doc;
     * }
     */
    transform?: TransformFunction;
}