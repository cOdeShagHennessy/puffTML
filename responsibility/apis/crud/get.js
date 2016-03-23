var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var crudDDL = use('apis/crud/ddl')();
//
var storage = use('apis/crud/redisStore')();
//

module.exports = {
    description: "Retrieve crud",
    notes: "Returns crud. Implementor add other details ...",
    tags: ['api', 'crud'],
    validate: {
        params: {
            id:crudDDL.properties.id
        }
    },
    plugins: {
        'hapi-swagger': {
            responseMessages: [
                {code: 200, message: 'OK'},
                {code: 404, message: '[id] is not associated with a crud'},
                {code: 500, message: 'system error'}
            ]
        }
    },
    handler: function (request, reply) {
        Logger.info("request %s %s", request.method, request.path, request.params, request.query);
        // Storage
        //
        var redisClient =request.server.plugins['hapi-redis'].client;
        storage.find(redisClient, request.params, request.query, function(data,err){
            if(err) {
                Logger.error ("storage error:", err);
                reply({id:"no id"}).code(404)
            }
            else if(data) {
                Logger.debug("find returned %s", data);
                reply(data);
            }
            else
                reply({id:request.params.id});
        });
    },
    response: {schema: crudDDL.schema}
};
