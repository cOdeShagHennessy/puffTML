/**
 * skircher generated on 9/17/2015, 10:07:37 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */
var rabbitMQ = require('amqp');
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var optionsSchema = Joi.object({
    // rethinkmqpublisher%> Schema 
    exchangeName: Joi.string().required().description("exchangeName for publisher"),
    exchangeType: Joi.string().required().description("exchangeType for publisher"),
    mqHost: Joi.string().required().description("mqHost for publisher")
}).meta({
    className: "optionSchema",
    description: "Pushlishes to rethink mq"
}).required();

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

module.exports.register = function (plugin, options, next) {
    console.log("rethinkmqpublisher plugin registered with option = " + JSON.stringify(options))

    plugin.log('debug',"rethinkmqpublish plugin registered with option = " + JSON.stringify(options))
    var defaultConnectionOptions = {
        exchangeType: 'fanout'
    };

    Logger.info("Called register with %j", options)
    var err = validateOptions(options);
    if (err) {
        callback(null,err)
    }
//    else if (callback){
//        callback(options)
//    }
//    else return options;

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

    plugin.expose('publish', function (methodOpts, callback) {
        Logger.info("Called publish with %j", methodOpts)
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
            callback("Exchange was not available")
        }
    });
    next();
}

module.exports.register.attributes = {
    name:    'rethinkmqpublisher',
    version: '0.1.0'
};
