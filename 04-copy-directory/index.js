const fs = require('fs');

const path = require('path');

const startPath = path.join(__dirname, 'files');
const endPath = path.join(__dirname, 'files-copy');

fs.mkdir(endPath, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(startPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const startFile = path.join(startPath, file.name);
    const endFile = path.join(endPath, file.name);
    fs.copyFile(startFile, endFile, (err) => {
      if (err) throw err;
    });
  });
});

fs.readdir(endPath, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const startFile = path.join(startPath, file);
    const endFile = path.join(endPath, file);
    fs.access(startFile, fs.constants.F_OK, (error) => {
      if (error) {
        fs.unlink(endFile, (err) => {
          if (err) throw err;
        });
      }
    });
  });
});
