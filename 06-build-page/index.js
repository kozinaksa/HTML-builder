const fs = require('fs');
const path = require('path');

const components = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const styles = path.join(__dirname, 'styles');
const template = path.join(__dirname, 'template.html');

const projectDist = path.join(__dirname, 'project-dist');
const assetsCopy = path.join(__dirname, 'project-dist', 'assets');
const index = path.join(__dirname, 'project-dist', 'index.html');
const style = path.join(__dirname, 'project-dist', 'style.css');

const content = '';
const clearDir = (dir) => {
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });
};

clearDir(projectDist);
clearDir(assetsCopy);

const clearFile = (file) => {
  fs.writeFile(file, content, (err) => {
    if (err) throw err;
  });
};

clearFile(index);
clearFile(style);

const bundleIndex = () => {
  let temp;
  let tagsText = {};
  const stream = fs.createReadStream(template, 'utf-8');
  stream.on('data', (chunk) => {
    temp = chunk.toString();
    const reg = /\{\{([^}]+)\}\}/g;
    let tags = temp.match(reg);
    tags.forEach((tag) => {
      const name = tag.replace('{{', '').replace('}}', '');
      const file = path.join(components, `${name}.html`);
      fs.stat(file, (err) => {
        if (err) {
          temp = temp.replace(tag, '');
          const writeTemplate = fs.createWriteStream(index);
          writeTemplate.write(temp);
          return err;
        }
        const readComp = fs.createReadStream(file);
        readComp.on('data', (data) => {
          tagsText[name] = `${data}`;
          temp = temp.replace(tag, tagsText[name]);
          const writeTemplate = fs.createWriteStream(index);
          writeTemplate.write(temp);
        });
      });
    });
  });
};

const bundleStyle = () => {
  fs.readdir(styles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const filePath = path.join(styles, file.name);
      if (file.isFile() && `${path.extname(filePath)}` === '.css') {
        const stream = fs.createReadStream(filePath, 'utf-8');
        stream.on('data', (chunk) => {
          fs.appendFile(style, chunk, (err) => {
            if (err) throw err;
          });
        });
      }
    });
  });
};

const copyAssets = (dir) => {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) return err;
    files.forEach((file) => {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        copyAssets(filePath);
      }
      const id = dir.lastIndexOf('assets') + 'assets'.length + 1;
      const subfolder = dir.slice(id, dir.length);
      const subfolderPath = path.join(assetsCopy, `${subfolder}`);
      const subfolderFilePath = path.join(subfolderPath, file.name);
      clearDir(subfolderPath);
      fs.copyFile(filePath, subfolderFilePath, (err) => {
        if (err) return err;
      });
    });
  });
};

const delExcesses = (dir) => {
  const add = dir.slice(-dir.length + dir.lastIndexOf(path.sep) + 1);
  let oldPath = assets;
  if (add !== 'assets') {
    oldPath = path.join(assets, add);
  }
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) return err;
    files.forEach((file) => {
      const oldFilePath = path.join(oldPath, file.name);
      fs.access(oldFilePath, (error) => {
        if (error) {
          const filePath = path.join(dir, file.name);
          if (file.isDirectory()) {
            fs.rm(
              filePath,
              {
                recursive: true,
              },
              (err) => {
                if (err) return err;
              },
            );
          } else {
            fs.unlink(filePath, (err) => {
              if (err) return err;
            });
          }
        }
        if (file.isDirectory()) {
          const filePath = path.join(dir, file.name);
          delExcesses(filePath);
        }
      });
    });
  });
};

bundleIndex();
bundleStyle();
copyAssets(assets);
delExcesses(assetsCopy);
