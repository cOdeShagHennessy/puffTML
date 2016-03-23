var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var crudDDL = use('apis/crud/ddl')();
//
var storage = use('apis/crud/redisStore')();
//

module.exports = {
    description: "Modify(or add) crud",
    notes: "Modifies crud. Implementor add other details ...",
    tags: ['api', 'crud'],
    validate: {
        params: {
            id:crudDDL.properties.id
        },
        payload: crudDDL.schema
    },
    plugins: {
        'hapi-swagger': {
            responseMessages: [
                {code: 200, message: 'OK'},
                {code: 201, message: 'Created'},
//                {code: 304, message: '[id] is not associated with a crud'},
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
               reply({id:"no id"}).code(404)
           }
           else if(data && data.exists) {
               Logger.debug("exists", data);
               reply(request.payload).code(200);
           }
           else
               reply(request.payload).code(201);
       });
    },
    response: {schema: crudDDL.schema}
};
