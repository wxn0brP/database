# DataBase Class Documentation

This documentation provides a detailed overview of the `DataBase` class, designed for performing CRUD operations on database collections. The class uses the `dbActionC` module for file-based operations and `executorC` for managing execution tasks.

## Class: `DataBase`

### Constructor: `DataBase(folder, options={})`
Creates a new instance of the `DataBase` class.

- **Parameters:**
  - `folder` (`string`): The folder path where the database files are stored.
  - `options` (`object`): Optional configuration options.
    - `cacheThreshold` (`number`, default: 3): The threshold for caching entries.
    - `cacheTTL` (`number`, default: 300000): Time-to-live for cache entries in milliseconds (default: 5 minutes).

### Method: `c(collection)`
Creates a new instance of the `CollectionManager` class for the specified collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
- **Returns:**
  - `CollectionManager`: A new instance of `CollectionManager`.

### Method: `async getCollections()`
Gets the names of all available collections in the database.

- **Returns:**
  - `Promise<string[]>`: A promise that resolves with an array of collection names.

### Method: `async checkCollection(collection)`
Checks and creates the specified collection if it doesn't exist.

- **Parameters:**
  - `collection` (`string`): The name of the collection to check.

### Method: `async issetCollection(collection)`
Checks if a collection exists.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
- **Returns:**
  - `Promise<boolean>`: A promise that resolves to `true` if the collection exists, otherwise `false`.

### Method: `async add(collection, data, id_gen=true)`
Adds data to a specified collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `data` (`Object`): The data to add.
  - `id_gen` (`boolean`, default: true): Whether to generate an ID for the entry.
- **Returns:**
  - `Promise<Object>`: A promise that resolves with the added data.

### Method: `async find(collection, search, context={}, options={}, findOpts={})`
Finds data in a collection based on a query.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `search` (`function|Object`): The search query.
  - `context` (`Object`): The context object (for functions).
  - `options` (`Object`): Search options.
    - `max` (`number`, default: -1): Maximum number of entries to return.
    - `reverse` (`boolean`, default: false): Whether to reverse the search results.
  - `findOpts` (`Object`): Options for updating the search result.
- **Returns:**
  - `Promise<Array<Object>>`: A promise that resolves with the matching data.

### Method: `async findOne(collection, search, context={}, findOpts={})`
Finds one matching entry in a collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `search` (`function|Object`): The search query.
  - `context` (`Object`): The context object (for functions).
  - `findOpts` (`Object`): Options for updating the search result.
- **Returns:**
  - `Promise<Object|null>`: A promise that resolves with the found entry, or `null` if no match is found.

### Method: `async update(collection, search, arg, context={})`
Updates data in a collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `search` (`function|Object`): The search query.
  - `arg` (`function|Object`): Update arguments.
  - `context` (`Object`): The context object (for functions).
- **Returns:**
  - `Promise<boolean>`: A promise that resolves when the data is updated.

### Method: `async updateOne(collection, search, arg, context={})`
Updates one entry in a collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `search` (`function|Object`): The search query.
  - `arg` (`function|Object`): Update arguments.
  - `context` (`Object`): The context object (for functions).
- **Returns:**
  - `Promise<boolean>`: A promise that resolves when the data is updated.

### Method: `async updateOneOrAdd(collection, search, arg, add_arg={}, context={}, id_gen=true)`
Updates one entry or adds a new one if it doesn't exist.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `search` (`function|Object`): The search query.
  - `arg` (`function|Object`): Update arguments.
  - `add_arg` (`function|Object`): Data to add if no match is found.
  - `context` (`Object`): The context object (for functions).
  - `id_gen` (`boolean`, default: true): Whether to generate an ID for the new entry.
- **Returns:**
  - `Promise<boolean>`: A promise that resolves to `true` if the entry was updated, otherwise `false`.

### Method: `async remove(collection, search, context={})`
Removes data from a collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `search` (`function|Object`): The search query.
  - `context` (`Object`): The context object (for functions).
- **Returns:**
  - `Promise<boolean>`: A promise that resolves when the data is removed.

### Method: `async removeOne(collection, search, context={})`
Removes one entry from a collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `search` (`function|Object`): The search query.
  - `context` (`Object`): The context object (for functions).
- **Returns:**
  - `Promise<boolean>`: A promise that resolves when the entry is removed.

### Method: `removeDb(collection)`
Removes the specified collection from the database file system.

- **Parameters:**
  - `collection` (`string`): The name of the collection to remove.
- **Returns:**
  - `void`
