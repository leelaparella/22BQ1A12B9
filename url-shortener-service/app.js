const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files (fonts, CSS, images)
app.use(express.static('public'));

// Create log stream if folder exists
const logStreamPath = path.join(__dirname, 'logs', 'access.log');
fs.mkdirSync(path.dirname(logStreamPath), { recursive: true });
const accessLogStream = fs.createWriteStream(logStreamPath, { flags: 'a' });

// Logging middleware
app.use((req, res, next) => {
  accessLogStream.write(`${new Date().toISOString()} ${req.method} ${req.url}\n`);
  next();
});

// Set EJS as view engine
app.set('view engine', 'ejs');

// Root route
app.get('/', (req, res) => {
  res.render('index');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
