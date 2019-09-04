var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var routeImports = require('./api/routeImports');
var morgan = require('morgan');
var config = null;

/** setting environment variables */
if (!process.env['NODE ENV']) process.env['NODE ENV'] = 'dev';
if (process.env['NODE ENV'] == 'dev') {
  config = require('./config/env/dev');
} else if (process.env['NODE ENV'] == 'prod') {
  config = require('./config/env/prod');
}

/**export config to be used globally based on environment */
module.exports = config;

/**connecting to db */
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("connect to db successful ", config.dbUrl);
  })
  .catch((err) => {
    console.log("connect to db failed ", err);
  });



/*** bootstrap models */
fs.readdirSync(__dirname + '/models').forEach((file) => {
  if (~file.indexOf('.js')) {
    require(__dirname + '/models/' + file);
  }
});

require('./config/passport');
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use("/api", routeImports(router));
app.use(require('./auth'));

/**globally handle exception */
app.use((err, req, res, next) => {
  if (err == 'Unauthorised user') {
    return res.status(401).send('Unathorised access');
  }
  return res.status(401).send(err);
});

app.listen(config.port, () => {
  console.log("server listening already started ", config.port);
});