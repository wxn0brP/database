### Predefined Find Options Quick Reference (Post Data-Matching Processing)

## **Description**
These options are applied as part of a **post-processing step** after matching objects are found in the database (`find` stage) but before the data is returned to the client.  
This process is designed to:  
1. **Reduce data transfer size** by removing unnecessary fields or selecting only the required ones.  
2. **Customize results** by transforming objects to meet specific requirements.  

This optimization improves both performance and result usability, ensuring the client receives precisely the needed data in a compact form.

---

## **Execution Stack**
1. **`transform`**
2. **`exclude`**
3. **`select`**

---

## **Operators**

### **`select`**
Selects only specific fields to include in the final object.

```javascript
// Original Object
{
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    status: "active"
}

// Find Options
{
    select: ["name", "email"]
}

// Result
{
    name: "John Doe",
    email: "john@example.com"
}
```

---

### **`exclude`**
Excludes specific fields from the object, removing unwanted data.

```javascript
// Original Object
{
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    status: "active"
}

// Find Options
{
    exclude: ["name"]
}

// Result
{
    email: "john@example.com",
    age: 30,
    status: "active"
}
```

---

### **`transform`**
Applies a custom updater function to modify the object.

```javascript
// Original Object
{
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    status: "active"
}

// Find Options
{
    transform: (doc) => {
        doc.name = doc.name.toUpperCase();
        return doc;
    }
}

// Result
{
    name: "JOHN DOE",
    email: "john@example.com",
    age: 30,
    status: "active"
}
```

---

### **Combined Example**
Using all operators together to demonstrate the execution stack.

```javascript
// Original Object
{
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    status: "active"
}

// Find Options
{
    transform: (doc) => {
        doc.newField = "added";
        doc.status = "inactive";
        return doc;
    },
    exclude: ["email", "newField"],
    select: ["name", "status"]
}

// Execution Steps:
1. transform:
   {
       name: "John Doe",
       email: "john@example.com",
       age: 30,
       status: "inactive",
       newField: "added"
   }
2. exclude:
   {
       name: "John Doe",
       age: 30,
       status: "inactive"
   }
3. select:
   {
       name: "John Doe",
       status: "inactive"
   }

// Final Result:
{
    name: "John Doe",
    status: "inactive"
}
```

---

This structured flow ensures flexible and predictable results, making it a powerful tool for refining and manipulating data.