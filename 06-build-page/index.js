const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const index = path.join(__dirname, 'project-dist/index.html');

fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) throw err;
});

const content = '';

fs.writeFile(index, content, (err) => {
  if (err) throw err;
});

const bundleIndex = async () => {
  let temp;
  let tagsText = {};
  const stream = fs.createReadStream(template, 'utf-8');
  stream.on('data', (chunk) => {
    temp = chunk.toString();
    const reg = /\{\{([^}]+)\}\}/g;
    let tags = temp.match(reg);
    tags.forEach((tag) => {
      const name = tag.replace('{{', '').replace('}}', '');
      const file = `${components}\\${name}.html`;
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

bundleIndex();
