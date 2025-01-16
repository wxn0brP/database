# Predefined Update Options Quick Reference

## Arrays

### `$push`

Adds an element to the end of an array.

```javascript
{
    $push: { tags: "designer" }
}
```

**Input:**

```javascript
{
    tags: ["developer"]
}
```

**Output:**

```javascript
{
    tags: ["developer", "designer"]
}
```

### `$pushset`

Adds an element to the end of an array and removes duplicates.

```javascript
{
    $pushset: { tags: "designer" }
}
```

**Input:**

```javascript
{
    tags: ["developer", "designer", "developer"]
}
```

**Output:**

```javascript
{
    tags: ["developer", "designer"]
}
```

### `$pull`

Removes a specific element from an array.

```javascript
{
    $pull: { tags: "developer" }
}
```

**Input:**

```javascript
{
    tags: ["developer", "designer"]
}
```

**Output:**

```javascript
{
    tags: ["designer"]
}
```

### `$pullall`

Removes all occurrences of specified elements from an array.

```javascript
{
    $pullall: { tags: ["developer", "designer"] }
}
```

**Input:**

```javascript
{
    tags: ["developer", "designer", "manager"]
}
```

**Output:**

```javascript
{
    tags: ["manager"]
}
```

## Numbers

### `$inc`

Increments a numeric value by a given amount.

```javascript
{
    $inc: { counter: 1 }
}
```

**Input:**

```javascript
{
    counter: 5
}
```

**Output:**

```javascript
{
    counter: 6
}
```

### `$dec`

Decrements a numeric value by a given amount.

```javascript
{
    $dec: { counter: 1 }
}
```

**Input:**

```javascript
{
    counter: 5
}
```

**Output:**

```javascript
{
    counter: 4
}
```

## Objects

### `$merge`

Merges a nested object, adding or updating properties.

```javascript
{
    $merge: { settings: { theme: "dark" } }
}
```

**Input:**

```javascript
{
    settings: { theme: "light", language: "en" }
}
```

**Output:**

```javascript
{
    settings: { theme: "dark", language: "en" }
}
```

## Others

### `$unset`

Removes a specified key from an object.

```javascript
{
    $unset: { age: true }
}
```

**Input:**

```javascript
{
    name: "John",
    age: 30
}
```

**Output:**

```javascript
{
    name: "John"
}
```

### `$rename`

Renames a key in an object.

```javascript
{
    $rename: { firstName: "name" }
}
```

**Input:**

```javascript
{
    firstName: "John",
    lastName: "Doe"
}
```

**Output:**

```javascript
{
    name: "John",
    lastName: "Doe"
}
```