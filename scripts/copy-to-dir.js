const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');

const buildOutputPath = `${path.resolve(path.join(__dirname, '..'))}/build`;

console.log(chalk.red.bold.underline('Copying built files'));
console.log('argv', process.argv);
const destDir = _.last(process.argv);
if (destDir) {
  fs.copySync(buildOutputPath, destDir, {
    filter: file => !/(\.hot-update\.(js|json))$/.test(file)
  });
  console.log(chalk.green.bold.underline('Copied built files 👌'));
} else {
  console.log(chalk.green.bold.underline('Destination directory not set'));
}