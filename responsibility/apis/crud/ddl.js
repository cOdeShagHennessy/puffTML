var Joi = require('joi');

module.exports = function () {
    var module = {};

    var properties = {
        id: Joi.string().required().description("Unique identifier for crud"),
        name:Joi.string().description("Describe this field")
    };

    module.properties = properties;

    module.schema= Joi.object({
        id: properties.id,
        name: properties.name
    }).meta({
        className: "crudSchema",
        description: "Crud responsibility"
    });

    return module
};
