# Graph Database Documentation

This documentation provides an overview of the `Graph` class, which represents a graph database built on top of a custom `DataBase` module. The `Graph` class allows for managing graph structures by adding, removing, and querying edges between nodes in the database.

## Class: `Graph`

### Constructor: `Graph(databaseFolder)`
Initializes the graph database.

- **Parameters:**
  - `databaseFolder` (`string`): The folder where the database is stored.

### Method: `async add(collection, nodeA, nodeB)`
Adds an edge between two nodes in the specified collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `nodeA` (`string`): The first node.
  - `nodeB` (`string`): The second node.
- **Returns:**
  - `Promise<Object>`: A promise that resolves with the added edge.

### Method: `async remove(collection, nodeA, nodeB)`
Removes an edge between two nodes in the specified collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `nodeA` (`string`): The first node.
  - `nodeB` (`string`): The second node.
- **Returns:**
  - `Promise<boolean>`: A promise that resolves to `true` if the edge is removed, otherwise `false`.

### Method: `async find(collection, node)`
Finds all edges with either node equal to the specified `node`.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `node` (`string`): The node to search for.
- **Returns:**
  - `Promise<Object[]>`: A promise that resolves with an array of edges.

### Method: `async findOne(collection, nodeA, nodeB)`
Finds one edge with either `nodeA` or `nodeB` as nodes.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
  - `nodeA` (`string`): The first node.
  - `nodeB` (`string`): The second node.
- **Returns:**
  - `Promise<Object|null>`: A promise that resolves with the found edge or `null` if no edge is found.

### Method: `async getAll(collection)`
Gets all edges in the specified collection.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
- **Returns:**
  - `Promise<Object[]>`: A promise that resolves with all edges in the collection.

### Method: `async getCollections()`
Returns the names of all available collections in the database.

- **Returns:**
  - `Promise<string[]>`: A promise that resolves with an array of collection names.

### Method: `async checkCollection(collection)`
Checks and creates the specified collection if it doesn't exist.

- **Parameters:**
  - `collection` (`string`): The name of the collection.

### Method: `async issetCollection(collection)`
Checks if the specified collection exists.

- **Parameters:**
  - `collection` (`string`): The name of the collection.
- **Returns:**
  - `Promise<boolean>`: A promise that resolves to `true` if the collection exists, otherwise `false`.

### Method: `removeCollection(collection)`
Removes the specified collection from the database file system.

- **Parameters:**
  - `collection` (`string`): The name of the collection to remove.
- **Returns:**
  - `void`