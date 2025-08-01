const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });

const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Body: ${JSON.stringify(req.body)}\n`;
  logStream.write(log);
  next();
};

module.exports = logger;
