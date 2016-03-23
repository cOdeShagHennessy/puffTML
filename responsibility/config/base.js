var use = require('rekuire');
var Confidence = require('confidence');
var Hoek = require('hoek');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');

module.exports = function (microstack) {
    var module = {};

    var microstack = use('microstack')([
        //{ name:'cache',path:'ns_cache'},
    ]);

    // Sample integration of microstack components
    // var cache = microstack.nanos('cache');

    // enumerate the base configuration properties
    var baseConfig = {
        projectName: 'pufftml-responsibility',
        port:        10001,

        // This setting assumes the use of docker to host a redis instance locally
        // This setting can be overridden with overrides or the
        // recommended approach is to replace this with a nanostack component, i.e. ns_Redis
        redisHost: '192.168.99.100' //cache.redisHost// 
    };

    var overrides = use('config/overrides');
    Logger.debug("overrides = " + JSON.stringify(overrides, null, '\t'))
    var store = new Confidence.Store(overrides);

    var envConfig = store.get('/environment', {env: process.env.NODE_ENV});
    baseConfig.filter = process.env.NODE_ENV;

    var config = Hoek.applyToDefaults(baseConfig, envConfig);
    Logger.info("Config'd for " + process.env.NODE_ENV);

    module.props = Object.keys(config);

    module.get = function (key) {
        //Logger.debug(config);
        if (config[key])
            return config[key];
    };

    return module;
};