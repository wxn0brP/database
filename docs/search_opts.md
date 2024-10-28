# Predefined Search Options Quick Reference

## Operators

### Logical Operators

#### $and
Checks if all conditions in an array are true.
```javascript
{
  $and: [
    { $gt: { age: 20 } },
    { $exists: { name: true } }
  ]
}
```

#### $or
Checks if at least one condition in an array is true.
```javascript
{
  $or: [
    { $lt: { age: 20 } },
    { $gt: { age: 60 } }
  ]
}
```

#### $not
Negates a condition.
```javascript
{
  $not: { $type: { age: "string" } }
}
```

### Comparison Operators

#### $gt
Greater than comparison.
```javascript
{ $gt: { age: 18 } }
```

#### $lt
Less than comparison.
```javascript
{ $lt: { score: 100 } }
```

#### $gte
Greater than or equal comparison.
```javascript
{ $gte: { price: 9.99 } }
```

#### $lte
Less than or equal comparison.
```javascript
{ $lte: { quantity: 50 } }
```

#### $in
Checks if value is in an array.
```javascript
{ $in: { status: ["active", "pending"] } }
```

#### $nin
Checks if value is not in an array.
```javascript
{ $nin: { category: ["archived", "deleted"] } }
```

#### $between
Checks if a number is between two values (inclusive).
```javascript
{ $between: { age: [18, 65] } }
```

### Type and Existence Operators

#### $exists
Checks if a field exists (or doesn't exist).
```javascript
{ $exists: { email: true, deletedAt: false } }
```

#### $type
Checks the type of a field.
```javascript
{ $type: { age: "number", name: "string" } }
```

### Array Operators

#### $arrinc
Checks if an array includes at least one of the specified values.
```javascript
{ $arrinc: { tags: ["developer", "designer"] } }
```

#### $arrincall
Checks if an array includes all of the specified values.
```javascript
{ $arrincall: { permissions: ["read", "write"] } }
```

#### $size
Checks the length of an array or string.
```javascript
{ $size: { tags: 3 } }
```

### String Operators

#### $regex
Tests a string against a regular expression.
```javascript
{ $regex: { email: /^[^@]+@[^@]+\.[^@]+$/ } }
```

#### $startsWith
Checks if a string starts with a specified value.
```javascript
{ $startsWith: { name: "Dr." } }
```

#### $endsWith
Checks if a string ends with a specified value.
```javascript
{ $endsWith: { email: "@example.com" } }
```

### Other Operators

#### $subset
Allows for skipping advanced validation for specific fields, applying only basic validation. This is useful when validation data may conflict with predefined functions (starting with $), while user data might also contain similar keys. Use this operator as a compromise.
```javascript
{ $subset: { $lt: "John Doe" } } // chcek if "$lt" is "John Doe"
```

## Examples

### Complex Validation

```javascript
const criteria = {
  $and: [
    {
      $or: [
        { $gt: { age: 18 } },
        { $exists: { guardianConsent: true } }
      ]
    },
    {
      $type: { email: "string" },
      $regex: { email: /^[^@]+@[^@]+\.[^@]+$/ }
    },
    {
      $arrincall: { roles: ["user"] },
      $not: { $in: { status: ["banned", "suspended"] } }
    }
  ]
};

const user = {
  age: 16,
  guardianConsent: true,
  email: "john@example.com",
  roles: ["user", "premium"],
  status: "active"
};

const isValid = hasFieldsAdvanced(user, criteria); // true
```

### Nested Conditions

```javascript
const criteria = {
  $and: [
    {
      $exists: { address: true },
      $type: { address: "object" }
    },
    {
      $or: [
        { $exists: { "address.zipCode": true } },
        {
          $and: [
            { $exists: { "address.city": true } },
            { $exists: { "address.country": true } }
          ]
        }
      ]
    }
  ]
};

const user = {
  address: {
    city: "New York",
    country: "USA"
  }
};

const isValid = hasFieldsAdvanced(user, criteria); // true
```

## Error Handling

The function will throw an error if:
- The `fields` parameter is not an object
- The `fields` parameter is null

Always wrap the function call in a try-catch block when using with untrusted input:

```javascript
try {
  const isValid = hasFieldsAdvanced(obj, criteria);
  // Handle result
} catch (error) {
  // Handle error
  console.error('Validation error:', error.message);
}
```