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
    fs.copyFile(
      `${startPath}\\${file.name}`,
      `${endPath}\\${file.name}`,
      (err) => {
        if (err) throw err;
      },
    );
  });
});

fs.readdir(endPath, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    fs.access(`${startPath}\\${file}`, fs.constants.F_OK, (error) => {
      if (error) {
        fs.unlink(`${endPath}\\${file}`, (err) => {
          if (err) throw err;
        });
      }
    });
  });
});
