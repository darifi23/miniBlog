import fs from 'fs';
const filePath = './server.js';
const content = fs.readFileSync(filePath, 'utf8');
const search = "console.log(`MongoDB Connected successfully: ${conn.connection.host}`);";
const replace = "console.log(`MongoDB Connected successfully: ${conn.connection.host}`);\n        console.log(`MongoDB Database: ${conn.connection.db.databaseName}`);";
if (!content.includes(search)) {
  console.error('Search string not found');
  process.exit(1);
}
fs.writeFileSync(filePath, content.replace(search, replace), 'utf8');
console.log('Patched server.js');
