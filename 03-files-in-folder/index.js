const fs = require('fs');

const path = require('path');
let secretPath = path.join(__dirname + '/secret-folder');

fs.readdir(secretPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = secretPath + '/' + file.name;
      fs.stat(filePath, (err, stats) => {
        if (err) console.log(err);
        console.log(
          `${path.basename(filePath, path.extname(filePath))} - ${path
            .extname(filePath)
            .slice(1)} - ${stats.size} bytes`,
        );
      });
    }
  });
});
