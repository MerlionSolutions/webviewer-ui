const fs = require('fs-extra');
const path = require('path');

console.log('%cCopying built files', 'color: red');
fs.copySync(`${path.resolve(path.join(__dirname, '..'))}/build`, '/home/jchoi/Documents/merlion-solutions/enotarylog/enotarylog-fe/client/public/lib/ui');
