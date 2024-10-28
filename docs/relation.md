# Relation Class Documentation

This documentation provides an overview of the `Relation` class, which is designed to manage and resolve relations between database collections.

## Class: `Relation`

### Constructor: `Relation(databases)`
Creates a new instance of the `Relation` class.

- **Parameters:**
  - `databases` (`Record<string, Database>`): An object containing database instances, where keys are database names.

### Method: `async find(path: string, search: object | Function, relations?: Record<string, any>, options?: object)`
Finds items with relations based on the provided path and search criteria.

- **Parameters:**
  - `path` (`string`): Path in format 'dbName.collectionName'.
  - `search` (`object | Function`): The search query or function to execute.
  - `relations` (`Record<string, any>`, optional): Relations configuration for resolving related data.
  - `options` (`object`, optional): Additional search options.
- **Returns:**
  - `Promise<Array<object>>`: A promise that resolves with an array of items, each containing resolved relations.

### Method: `async findOne(path: string, search: object | Function, relations?: Record<string, any>)`
Finds one item with relations based on the provided path and search criteria.

- **Parameters:**
  - `path` (`string`): Path in format 'dbName.collectionName'.
  - `search` (`object | Function`): The search query or function to execute.
  - `relations` (`Record<string, any>`, optional): Relations configuration for resolving related data.
- **Returns:**
  - `Promise<object | null>`: A promise that resolves with the found item containing resolved relations or `null` if no match is found.

### Method: `private _processItemRelations(item: object, relations: Record<string, any>)`
Processes relations for a single item.

- **Parameters:**
  - `item` (`object`): The item to process relations for.
  - `relations` (`Record<string, any>`): Relations configuration.
- **Returns:**
  - `Promise<object>`: A promise that resolves with the processed item containing resolved relations.

### Private Method: `_resolvePath(path: string)`
Resolves the relation path in the format 'dbName.collectionName'.

- **Parameters:**
  - `path` (`string`): The path to resolve, supporting escaped dots (`\.`).
- **Returns:**
  - `{ db: Database; collection: string }`: An object containing the resolved database and collection names.
- **Throws:**
  - `Error`: If the database does not exist or if the path format is invalid.
