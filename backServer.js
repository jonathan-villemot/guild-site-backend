'use strict';

var http = require('http'),
    app = require('express')(),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    routes = require('./app/routes'),
    properties = require('./config/properties_' + (process.env.NODE_ENV || 'dev'));

require('events').EventEmitter.prototype._maxListeners = 100;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(compression());

logger.setLevel('TRACE');

app.use(log4js.connectLogger(logger, {
    level: log4js.levels.DEBUG,
    format: ':method :url - :status - :response-time ms'
}));

routes.setup(app);

/**
 * Setting of firebase here.
 */

http.createServer(app).listen(properties.port.http);
logger.info('HTTP server is started on port ' + properties.port.http);
