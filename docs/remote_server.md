# Installation

Clone the repository and install the necessary development dependencies:

```bash
git clone https://github.com/wxn0brP/database.git
cd db
npm install
```

# Usage

To start the server, run:

```bash
node remote/server/index.js
```

# Server Management

Manage the server using the following command:

```bash
node remote/serverMgmt/index.js
```

## Available Parameters:

- `help`: Display this help message
- `add-db <type> <name> <folder> <opts>`: Add a new database
- `rm-db <name>`: Remove an existing database
- `list-dbs`: List all databases
- `add-user <login> <password>`: Create a new user
- `rm-user <login>`: Delete a user
- `list-users`: Display all users