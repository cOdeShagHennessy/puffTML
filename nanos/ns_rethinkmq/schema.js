/**
* skircher generated on 9/17/2015, 7:39:15 PM using slush-mChasm.
* Author:Shawn Kircher
* Email:codeshaghennessy@gmail.com
*/
var Joi = require('joi');

module.exports = Joi.object().keys({
    // Nanostack Schema 
    exchangeName: Joi.string().required(),
    exchangeType: Joi.string().required(),
    mqHost: Joi.string().required(),
});