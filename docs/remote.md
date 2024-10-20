# Remote Database and Graph Database Client Documentation

## `remote` object structure.
- `name` (`string`): The name of the database.
- `url` (`string`): The URL of the remote database.
- `auth` (`string`): The authentication token for accessing the database.

## Class: `DataBaseRemote(remote)`
`DataBaseRemote` is an extended version of the `DataBase` class, designed to handle API requests. It provides the same functionalities as `DataBase`, but enables remote communication, allowing you to interact with databases through HTTP requests.

## Example Usage
```javascript
const remoteDB = new DataBaseRemote({
    name: 'myRemoteDB',
    url: 'https://example.com/db',
    auth: 'your-auth-token'
});
```

## Class: `GraphRemote(remote)`
`GraphRemote` is an extension of the `Graph` class, specifically designed for working with graph databases over HTTP. It supports querying and modifying graph data, providing methods tailored for graph operations such as adding nodes, edges, and executing graph queries.

## Example Usage
```javascript
const remoteGraph = new GraphRemote({
    name: 'myRemoteGraph',
    url: 'https://example.com/db',
    auth: 'your-auth-token'
});
```