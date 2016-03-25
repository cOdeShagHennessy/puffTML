var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var puffapiDDL = use('apis/puffapi/ddl')();
//
var storage = use('apis/puffapi/redisStore')();
//

module.exports = {
    description: "Retrieve all puffapi",
    notes: "Returns all members from puffapi key. Implementor add other details ...",
    tags: ['api', 'puffapi'],
    // validate: {
    //     params: {
    //         uid:puffapiDDL.properties.uid
    //     }
    // },
    plugins: {
        'hapi-swagger': {
            responseMessages: [
                {code: 200, message: 'OK'},
                {code: 404, message: '[uid] is not associated with a puffapi'},
                {code: 500, message: 'system error'}
            ]
        }
    },
    handler: function (request, reply) {
        Logger.info("request %s %s", request.method, request.path, request.params, request.query);
        // Storage
        //
        var redisClient = request.server.plugins['hapi-redis'].client;
        redisClient.keys('puffapi:*', function(err, data) {
          if(err) {
              Logger.error ("storage error:", err);
              reply({uid:"no uid"}).code(404)
          }
          else if(data) {
              Logger.debug("find returned %s", data);
              redisClient.mget(data, function(err, all) {
                if(err) {
                    Logger.error ("storage error:", err);
                    reply({uid:"no uid"}).code(404)
                }
                else if(all) {
                  Logger.debug("converstion returned ", all);
                  // var newArray = data.map(function(d) {
                  //   return {
                  //     uid: d.split(':')[1]
                  //   };
                  // });
                  reply(all);
                }
                else {
                  reply().code(404)
                }
              });
              // Logger.debug("converstion returned %s", JSON.stringify(newArray));
          }
          else
              reply().code(404);
              // reply({uid:request.params.uid});
        });

    },
    // response: {schema: puffapiDDL.schema}
};
