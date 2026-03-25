const express = require('express');
const add = require('./math');

const app = express();

// Root route
app.get('/', (req, res) => {
  const sum = add(2, 3);
  res.send(`Sum is: ${sum}`);
});

// App listens on port 8080
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
