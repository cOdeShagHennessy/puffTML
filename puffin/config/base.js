var use = require('rekuire');
var Confidence = require('confidence');
var Hoek = require('hoek');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');

module.exports = function (microstack) {
    var module = {};

    var microstack = use('microstack')([
        //{ name:'cache',path:'ns_cache'},
        {name:'rethinkMQ',path:'ns_rethinkmq'}
    ]);

    // Sample integration of microstack components
    // var cache = microstack.nanos('cache');
    var rethinkMQ = microstack.nanos('rethinkMQ');

    // enumerate the base configuration properties
    var baseConfig = {
        projectName: 'pufftml-puffin',
        port:        9080,
    
        // This setting assumes the use of docker to host a redis instance locally
        // This setting can be overridden with overrides or the
        // recommended approach is to replace this with a nanostack component, i.e. ns_Redis
        redisHost: '192.168.59.103' //cache.redisHost//
    };
    baseConfig.rethinkMQ = rethinkMQ;

    var overrides = use('config/overrides');
    Logger.debug("overrides = " + JSON.stringify(overrides, null, '\t'))
    var store = new Confidence.Store(overrides);

    var envConfig = store.get('/environment', {env: process.env.NODE_ENV});
    baseConfig.filter = process.env.NODE_ENV;

    var config = Hoek.applyToDefaults(baseConfig, envConfig);
    Logger.info("Config'd for " ,process.env.NODE_ENV);
    Logger.info("Config'd with ",  config);

    module.props = Object.keys(config);
    Logger.info("Config'd with ",  module.props);

    module.get = function (key) {
//        Logger.debug(config);
        if (config[key])
            return config[key];
    };

    return module;
};