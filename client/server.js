const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all routes to support React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Use the PORT environment variable provided by Render
const port = process.env.PORT || 10000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
