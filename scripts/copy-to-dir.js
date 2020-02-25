const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');

const buildOutputPath = `${path.resolve(path.join(__dirname, '..'))}/build`;

console.log(chalk.red.bold.underline('Copying built files'));
fs.copySync(buildOutputPath, '/home/jchoi/Documents/merlion-solutions/enotarylog/enotarylog-fe/client/public/lib/ui', {
  filter: file => !/(\.hot-update\.(js|json))$/.test(file)
});
console.log(chalk.green.bold.underline('Copied built files 👌'));
