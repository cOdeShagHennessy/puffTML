/**
 * skircher generated on 9/19/2015, 2:16:06 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */

var rabbitMQ = require('amqp');
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
//
//Plugin option schema
var optionsSchema = Joi.object({
    // testmqlib%> Schema 
    exchangeName: Joi.string().required().description("name of exchange"),
    mqHost: Joi.string().required().description("host ip address"),
}).meta({
    className: "optionSchema",
    description: "Tests lib scaffolding"
});
//
//TODO: Add method options schema and validation
var methodOptionsSchema = Joi.object({
    // callme%> Schema 
    key: Joi.string().required().description("key for sending message"),
    message: Joi.object().required().description("data for sending message"),
}).meta({
    className: "methodOptionSchema",
    description: "callme"
});

var validateOptions = function (options) {
    return Joi.validate(
        options,
        optionsSchema, {abortEarly: false, allowUnknown: true}, function (err) {
            if (err) {
                Logger.error('Error: invalidated %j %s', options, err);
                return err;
            }
            Logger.trace('validated %j', options);
        });
};

var validateMethodOptions = function (methodOptions) {
    return Joi.validate(
        methodOptions,
        methodOptionsSchema, {abortEarly: false, allowUnknown: true}, function (err) {
            if (err) {
                Logger.error('Error: invalidated %j %s', methodOptions, err);
                return err;
            }
            Logger.trace('validated %j', methodOptions);
        });
};

module.exports.register = function (plugin, options, next) {
    Logger.info("Registered testmqlib with %j", options)
    var err = validateOptions(options);
    if (err) {
        callback(null,err)
    }
    var connection = rabbitMQ.createConnection({host: options.mqHost});
    var exchange;

    connection.on('ready', function () {
        plugin.log('info', 'log-exchanger connected to rabbitmq');
        exchange = connection.exchange(options.exchangeName, {
            type: options.exchangeType,
            autoDelete: true
        }, function (exchange) {
            plugin.log('debug','Exchange connected  ' + JSON.stringify(options))
        });
    });

    plugin.expose('callme', function (methodOpts, callback) {
        Logger.data("Called callme with %j", methodOpts)
        var err = validateMethodOptions(methodOpts);
        if (err) {
            callback(null,err)
        }
        else {
            Logger.info("Called testmqlib.callme with %j", methodOpts)
            //validate methodOpts

            if (exchange) {
                exchange.publish(methodOpts.key, {data: [methodOpts.message]}, {}, function (error, message) {
                    //Callback is never made unless Acks are set up.
                    if (error) {
                        plugin.log('error',"logs error: " + error);
                    } else {
                        plugin.log('debug', "success: " + message);
                    }
                    if (callback)
                        callback();
                });
            } else {
                if (callback){
                    callback("Exchange was not available")
                }
                else return "Exchange was not available" ;
            }
        }


    });
    next();
}

module.exports.register.attributes = {
    name:    'testmqlib',
    version: '0.1.0'
};
