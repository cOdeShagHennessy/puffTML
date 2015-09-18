var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var puffapiDDL = use('apis/puffapi/ddl')();
//    
var storage = use('apis/puffapi/redisStore')();
//   

module.exports = {
    description: "Create a new puffapi",
    notes:       "Creates a new puffapi. Implementor add other details ...",
    tags:        ['api', 'puffapi'],
    validate:    {
        payload: {
//            sample: Joi.string().description("puffapi sample property"),
            sample:puffapiDDL.properties.sample
        }
    },
    plugins:     {
        'hapi-swagger': {
            responseMessages: [
                {code: 200, message: 'OK'},
                {code: 201, message: 'Created'},
                {code: 422, message: 'puffapi could not be created'},
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
                reply({uid: "no uid"}).code(422)
            }
            else if (data && data.exists) {
                Logger.debug("find returned %s", data);
                reply(request.payload).code(200);
            }
            else
                reply({uid:data.uid,sample:data.sample}).created("/" + data.uid);
        });
        
        },
        response: { schema: puffapiDDL.schema }
} ;
