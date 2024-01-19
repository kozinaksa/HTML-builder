const fs = require('fs');

const path = require('path');
const fileName = path.join(__dirname, 'text.txt');

const stream = new fs.createReadStream(fileName, 'utf-8');

stream.on('data', (chunk) => {
  console.log(chunk);
});
