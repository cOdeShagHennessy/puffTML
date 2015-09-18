/**
 * skircher generated on 9/8/2015, 8:54:08 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var optionsSchema = Joi.object({
    // puff2%> Schema 
    dest1: Joi.string().required().description("klasdjflasjdflf"),
}).meta({
    className: "optionSchema",
    description: "Laksdjfladf"
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
    plugin.expose('huff2', function (methodOpts, callback) {
        Logger.data("Called huff2 with %j", methodOpts)
        var err = validateOptions(methodOpts);
        if (err) {
            callback(err)
        }
        else if (callback) callback()
        else return;
    });
    next();
}

module.exports.register.attributes = {
    name:    'puff2',
    version: '0.1.0'
};
