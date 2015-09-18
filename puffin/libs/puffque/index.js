/**
 * skircher generated on 9/7/2015, 9:21:40 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var optionsSchema = Joi.object({
    // puffque%> Schema 
    essence: Joi.string().required().description("the heart of the matter"),
}).meta({
    className: "optionSchema",
    description: "It does alot"
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
    plugin.expose('questly', function (methodOpts, callback) {
        var err = validateOptions(methodOpts);
        if (err) {
            callback(err)
        }

        Logger.data("Called questly with %j", methodOpts)
    });
    next();
}

module.exports.register.attributes = {
    name:    'puffque',
    version: '0.1.0'
};
