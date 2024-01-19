const fs = require('fs');

const path = require('path');

const startPath = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist/bundle.css');

const content = '';

fs.writeFile(bundle, content, (err) => {
  if (err) throw err;
});

fs.readdir(startPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const filePath = `${startPath}\\${file.name}`;
    if (file.isFile() && `${path.extname(filePath)}` === '.css') {
      const stream = fs.createReadStream(filePath, 'utf-8');
      stream.on('data', (chunk) => {
        fs.appendFile(bundle, chunk, (err) => {
          if (err) throw err;
        });
      });
    }
  });
});
