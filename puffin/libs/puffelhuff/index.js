/**
 * skircher generated on 9/8/2015, 8:47:36 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var optionsSchema = Joi.object({
    // puffelhuff%> Schema 
    huffid: Joi.string().required().description("unique huff"),
    huffName: Joi.string().required().description("name of the huff"),
}).meta({
    className: "optionSchema",
    description: "Huffs and puffs"
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
    plugin.expose('huff', function (methodOpts, callback) {
        var err = validateOptions(methodOpts);
        if (err) {
            callback(err)
        }

        Logger.data("Called huff with %j", methodOpts)
    });
    next();
}

module.exports.register.attributes = {
    name:    'puffelhuff',
    version: '0.1.0'
};
