/**
 * skircher generated on 9/8/2015, 8:44:25 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var optionsSchema = Joi.object({
    // pufferye%> Schema 
    buffid: Joi.string().required().description("id in the buff"),
    buffdate: Joi.date().required().description("date of being buff"),
}).meta({
    className: "optionSchema",
    description: "Puffs up about nada"
});

var validateOptions = function (options) {
    Joi.validate(
        options,
        optionsSchema, {abortEarly: false, allowUnknown: true}, function (err) {
            if (err) {
                Logger.error('Error: invalidated %j %s', options, err);
                return err;
            }
            Logger.verbose('validated %j', options);
        });
};

module.exports.register = function (plugin, options, next) {
    plugin.expose('buff', function (methodOpts, callback) {
        var err = validateOptions(methodOpts);
        if (err) {
            callback(err)
        }

        Logger.data("Called buff with %j", methodOpts)
    });
    next();
}

module.exports.register.attributes = {
    name:    'pufferye',
    version: '0.1.0'
};
