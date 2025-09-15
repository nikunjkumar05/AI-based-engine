// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('resume_parser');

// Create a new document in the collection.
db.getCollection('resumes').insertOne({name="John Doe", age:30, skills:["JavaScript", "MongoDB", "Node.js"]
});
