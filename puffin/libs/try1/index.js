/**
 * skircher generated on 9/9/2015, 9:18:05 PM using slush-mChasm.
 * Author:Shawn Kircher
 * Email:codeshaghennessy@gmail.com
 */
var Joi = require('joi');
var Logger = require('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var optionsSchema = Joi.object({
    // try1%> Schema 
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
            Logger.trace('validated %j', options);
        });
};

module.exports.register = function (plugin, options, next) {
    plugin.expose('doittomeonemoretime', function (methodOpts, callback) {
        Logger.data("Called doittomeonemoretime with %j", methodOpts)
        var err = validateOptions(methodOpts);
        if (err) {
            callback(null,err)
        }
        else if (callback){
            callback(methodOpts)
        }
        else return methodOpts;

    });
    next();
}

module.exports.register.attributes = {
    name:    'try1',
    version: '0.1.0'
};
