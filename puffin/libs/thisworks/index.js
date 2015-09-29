/**
 * skircher generated on 9/19/2015, 4:25:11 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */
var rabbitMQ = require('amqp');
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
//
//Plugin option schema
var optionsSchema = Joi.object({
    // thisworks%> Schema 
    exchangeName: Joi.string().required().description("name of exchange"),
    exchangeType: Joi.string().required().description("exchangeType for publisher"),
    queueName: Joi.string().required().description("name of queue"),
    queueKey: Joi.string().required().description("queue key"),
    mqHost: Joi.string().required().description("host ip address"),
}).meta({
    className: "optionSchema",
    description: "Works right away"
});
//
//TODO: Add method options schema and validation
var methodOptionsSchema = Joi.object({
    // iknewitwould%> Schema 
    msg: Joi.string().required().description("message to show"),
}).meta({
    className: "methodOptionSchema",
    description: "iknewitwould"
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
    Logger.info("Registered thisworks with %j", options)
    var err = validateOptions(options);
    if (err) {
        callback(null, err)
    } else {
        var connection = rabbitMQ.createConnection({host: options.mqHost});
        var exchange;
        connection.on('ready', function () {
            plugin.log('info', 'log-receiver connected to rabbitmq', '');
            exchange = connection.exchange(options.exchangeName, {
                type: options.exchangeType,
                autoDelete: true,
                confirm:true
            }, function (exchange) {
                var queue = connection.queue(options.queueName, {autoDelete: 'true', exclusive: true}, function (queue) {
                    (plugin.log)
                    plugin.log('info', 'queue opened');

                    queue.bind(exchange, options.queueKey);
                    queue.subscribe(function (message, headers, deliveryInfo, messageObject) {
                        plugin.log('info', 'something was received ' + JSON.stringify(deliveryInfo)+'\n decoded data -'+JSON.stringify(message));
                        //Logs.push(message);
                        //plugin.log('info', 'log added ' + Logs);
                    });
                });
            })
        });
    }

    plugin.expose('iknewitwould', function (methodOpts, callback) {
        Logger.data("Called iknewitwould with %j", methodOpts)
        var err = validateMethodOptions(methodOpts);
        if (err) {
            //var exchange;
            callback(null, err)
        }
        else if (callback){
            callback(methodOpts)
        }
        else return methodOpts;

        });
    next();
}

module.exports.register.attributes = {
    name:    'thisworks',
    version: '0.1.0'
};
