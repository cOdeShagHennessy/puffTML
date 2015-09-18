var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var puffapiDDL = use('apis/puffapi/ddl')();
//    
var storage = use('apis/puffapi/redisStore')();
//   

module.exports = {
    description: "Modify(or add) puffapi",
    notes: "Modifies puffapi. Implementor add other details ...",
    tags: ['api', 'puffapi'],
    validate: {
        params: {
            uid:puffapiDDL.properties.uid
        },
        payload: puffapiDDL.schema
    },
    plugins: {
        'hapi-swagger': {
            responseMessages: [
                {code: 200, message: 'OK'},
                {code: 201, message: 'Created'},
//                {code: 304, message: '[uid] is not associated with a puffapi'},
                {code: 500, message: 'system error'}
            ]
        }
    },
    handler: function (request, reply) {
        Logger.info("storing %j", request.payload);
        // Storage
        //    
        var redisClient = request.server.plugins['hapi-redis'].client;
       storage.store(redisClient, request.params, request.payload, function(data,err){
           if(err) {
               Logger.error ("store returned", err);
               reply({uid:"no uid"}).code(404)
           }
           else if(data && data.exists) {
               Logger.debug("exists", data);
               reply(request.payload).code(200);
           }
           else
               reply(request.payload).code(201);
       });
    },
    response: {schema: puffapiDDL.schema}
};


