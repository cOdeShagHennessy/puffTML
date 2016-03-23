var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var crudDDL = use('apis/crud/ddl')();
//
var storage = use('apis/crud/redisStore')();
//

module.exports = {
    description: "Delete crud",
    notes: "Delete crud. Implementor add other details ...",
    tags: ['api', 'crud'],
    validate: {
         params: {
            id:crudDDL.properties.id
         }
    },
    plugins: {
        'hapi-swagger': {
            responseMessages: [
                {code: 204, message: "Successfully deleted crud"},
                {code: 404, message: '[id] is not associated with a crud'},
                {code: 500, message: 'system error'}
            ]
        }
    },
    handler: function (request, reply) {
        Logger.info("deleting %j at %s", request.params);
        // Storage
        //
        var redisClient = request.server.plugins['hapi-redis'].client;
        storage.delete(redisClient, request.params, request.query, function(data, err){
            if(err) {
                Logger.error ("delete returned", err);
                reply().code(404)
            }
            else  {
                Logger.debug("deleted %s crud with id ", data, request.params.id);
                reply().code(204);
            }
        });
    }

};
