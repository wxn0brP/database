# DataBase Class

The `DataBase` class simplifies managing data with a file-based database, providing an easy way to perform CRUD operations, caching, and custom queries.

## Installation

Ensure you have Node.js installed. To install the `DataBase` package, run:

```bash
npm install @wxn0brp/database
```

## Usage Example

```javascript
import DataBase from '@wxn0brp/database/database.js';

async function main(){
    // Initialize the database with a folder path and optional cache settings
    const db = new DataBase('./data');

    // Create or check a collection
    await db.checkCollection('users');

    // Add a new user to the collection
    await db.add('users', { name: 'Alice', age: 30 });

    // Find users based on search criteria
    const users = await db.find('users', { age: 30 });
    console.log(users);

    // Update a user's data
    await db.update('users', { name: 'Alice' }, { age: 31 });

    // Remove a user
    await db.remove('users', { name: 'Alice' });
}

main().catch(console.error);

```

## Methods Overview

| Method Name | Description | Parameters | Returns |
| ----------- | ----------- | ---------- | ------- | 
| `getCollections` | Retrieves the names of all available collections. | None | `string[]` |
| `checkCollection` | Ensures that a collection exists, creating it if necessary. | `collection` (string): Name of the collection | `Promise<void>` |
| `issetCollection` | Checks if a collection exists. | `collection` (string): Name of the collection | `Promise<boolean>` |
| `add` | Adds data to a collection, optionally generating an ID. | `collection` (string), `data` (Object), `id_gen` (boolean) | `Promise<Object>` |
| `find` | Finds data entries matching a query. | `collection` (string), `search` (function/Object), `context` (Object), `options` (Object) - { max, reverse } | `Promise<Array<Object>>` |
| `findOne` | Finds the first data entry matching a query. | `collection` (string), `search` (function/Object), `context` (Object) | `Promise<Object\|null>` |
| `update` | Updates data entries matching a query. | `collection` (string), `search` (function/Object), `arg` (function/Object), `context` (Object) | `Promise<boolean>` |
| `updateOne` | Updates the first data entry matching a query. | `collection` (string), `search` (function/Object), `arg` (function/Object), `context` (Object) | `Promise<boolean>` |
| `remove` | Removes data entries matching a query. | `collection` (string), `search` (function/Object), `context` (Object) | `Promise<boolean>` |
| `removeOne` | Removes the first data entry matching a query. | `collection` (string), `search` (function/Object), `context` (Object) | `Promise<boolean>` |
| `updateOneOrAdd` | Updates one entry or adds a new one if no match is found. | `collection` (string), `search` (function/Object), `arg` (function/Object), `add_arg` (function/Object), `context` (Object), `id_gen` (boolean) | `Promise<boolean>` |
| `removeDb` | Removes an entire database collection from the file system. | `collection` (string)  | `void` |

---

### Querying Data

The `DataBase` class offers flexibility for querying collections using either an object or a function as the `search` parameter in methods like `find`, `findOne`, `update`, and `remove`.

#### Object-Based Queries

You can use the following operators to build your queries:

- **`$or`**: Matches if at least one condition is true.

  ```javascript
  const result = await db.find('users', {
      $or: [{ status: 'active' }, { role: 'admin' }]
  });
  ```

- **`$not`**: Matches if the condition is false.

  ```javascript
  const result = await db.find('users', {
      $not: { status: 'inactive' }
  });
  ```

- **`$and`**: Combines multiple conditions, all of which must be true. Useful for complex queries involving other operators.

  ```javascript
  const result = await db.find('users', {
      $and: [
        { age: 25 },
        { $or: [{ status: 'active' }, { status: 'away' }] }
      ]
  });
  ```

- **`$set`**: Ensures that specified fields are present in the document.

  ```javascript
  const result = await db.find('users', {
      $set: { name: true }
  });
  ```

#### Search as a Function

Alternatively, you can use a function for more dynamic queries. The function receives each document as an argument and should return `true` for documents that match the criteria.

```javascript
const results = await db.find('users', obj => obj.age > 30);
```

This approach is powerful for cases where the query logic is too complex to be represented as an object.

### Update Argument

When updating data, the `update` argument can also be either an object or a function.

#### Update as an Object

If you pass an object as the `update` argument, it will directly set the new values for the specified fields.

##### Example: Update with Object

```javascript
// Updates the age of all users named 'Alice' to 31
await db.update('users', { name: 'Alice' }, { age: 31 });
```

#### Update as a Function

If you pass a function, it receives the current object as an argument and should return the updated object. This allows for dynamic updates based on the current state of the object.

##### Example: Update with Function

```javascript
// Increments the age of all users named 'Alice' by 1
await db.update('users', { name: 'Alice' }, obj => {
    obj.age++;
    return obj;
});
```

This method is useful when you need to compute new values based on existing ones.

## Other Features

### Graph.js

The `Graph` class extends the functionality of the `DataBase` class to handle graph-like structures, where relationships (edges) between nodes (vertices) are stored in collections.

#### Methods

- **`add(collection, a, b)`**: Adds an edge between `a` and `b` in the specified collection. The nodes are sorted to ensure consistency in the storage format.

    ```javascript
    // Adds a friendship between Alice and Bob
    await graph.add('friends', 'Alice', 'Bob');
    ```

- **`remove(collection, a, b)`**: Removes the edge between `a` and `b`.

    ```javascript
    // Removes the friendship between Alice and Bob
    await graph.remove('friends', 'Alice', 'Bob');
    ```

- **`find(collection, d)`**: Finds all edges where `d` is one of the nodes.

    ```javascript
    // Returns all friends of Alice
    const friends = await graph.find('friends', 'Alice');
    ```

- **`findOne(collection, d, e)`**: Finds the edge between `d` and `e`.

    ```javascript
    // Returns the friendship between Alice and Bob, if it exists
    const relation = await graph.findOne('friends', 'Alice', 'Bob');
    ```

### Gen.js

The `gen.js` file contains a utility function `genId`, which generates a unique identifier.

#### Example: Generating an ID

```javascript
const id = genId();
```

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the [LICENSE](./LICENSE) file for details.