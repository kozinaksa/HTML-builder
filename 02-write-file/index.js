const fs = require('fs');
const readline = require('readline');

const path = require('path');
const fileName = path.join(__dirname, 'text.txt');

const rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('Please, input some text> ');
rl.prompt();

rl.on('line', function (answer) {
  if (answer.trim() === 'exit') rl.close();
  fs.appendFile(fileName, `${answer}\n`, function (error) {
    if (error) return console.log(error);
  });
  rl.prompt();
}).on('close', function () {
  console.log('Thanks. You are wonderful!');
  process.exit(0);
});
