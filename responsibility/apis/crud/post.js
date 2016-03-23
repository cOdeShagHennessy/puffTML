var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var crudDDL = use('apis/crud/ddl')();
//
var storage = use('apis/crud/redisStore')();
//

module.exports = {
    description: "Create a new crud",
    notes:       "Creates a new crud. Implementor add other details ...",
    tags:        ['api', 'crud'],
    validate:    {
        payload: {
//            sample: Joi.string().description("crud sample property"),
            name:crudDDL.properties.name
        }
    },
    plugins:     {
        'hapi-swagger': {
            responseMessages: [
                {code: 200, message: 'OK'},
                {code: 201, message: 'Created'},
                {code: 422, message: 'crud could not be created'},
                {code: 500, message: 'system error'}
            ]
        }
    },
    handler:     function (request, reply) {
        Logger.info("storing %j at %s", request.payload);
        // Storage
        //
        var redisClient = request.server.plugins['hapi-redis'].client;
        storage.store(redisClient, request.params, request.payload, function (data, err) {
            if (err) {
                Logger.error("store returned", err);
                reply({id: "no id"}).code(422)
            }
            else if (data && data.exists) {
                Logger.debug("find returned %s", data);
                reply(request.payload).code(200);
            }
            else
                reply({id:data.id,name:data.name}).created("/" + data.id);
        });

        },
        response: { schema: crudDDL.schema }
} ;
