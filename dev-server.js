const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const ip = require('ip');
const opn = require('opn');
const config = require('./webpack.config.dev');

const app = express();
const compiler = webpack(config);

app.use(
  devMiddleware(compiler, {
    logLevel: 'warn',
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
    },
  }),
);
app.use(hotMiddleware(compiler));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/i18n', express.static(path.resolve(__dirname, 'i18n')));
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/core', express.static(path.resolve(__dirname, 'lib/core')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src/index.html'));
});

app.get('/sample-url', (req, res) => {
  res.redirect(
    `/#d=https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf&a=1`,
  );
});

const port = process.env.PORT || 4444;
app.listen(port, '0.0.0.0', err => {
  if (err) {
    console.error(err);
  } else {
    // eslint-disable-next-line
    console.info(`Listening at localhost:${port} (http://${ip.address()}:${port})`);
    console.info(
      `goto: http://localhost:${port}/#d=https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf&a=1`
    );
  }
});
