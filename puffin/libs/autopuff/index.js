/**
 * skircher generated on 9/9/2015, 8:55:42 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var optionsSchema = Joi.object({
    // autopuff%> Schema 
    created: Joi.date().required().description("created on date"),
    name: Joi.string().required().description("name of autopuff"),
    dirty: Joi.boolean().required().description("dirty flag for modified"),
}).meta({
    className: "optionSchema",
    description: "Tests puff tests"
});

var validateOptions = function (options) {
    Joi.validate(
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
    plugin.expose('auto', function (methodOpts, callback) {
        Logger.data("Called auto with %j", methodOpts)
        var err = validateOptions(methodOpts);
        if (err) {
            callback(err)
        } else if (callback) {
            callback()
        }
        else return;
    });
    next();
}

module.exports.register.attributes = {
    name:    'autopuff',
    version: '0.1.0'
};
