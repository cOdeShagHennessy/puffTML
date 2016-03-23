var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var crudDDL = use('apis/crud/ddl')();
//
var storage = use('apis/crud/redisStore')();
//

module.exports = {
    description: "Retrieve all responsiblity crud",
    notes: "Returns all members from responsiblity crud key. Implementor add other details ...",
    tags: ['api', 'responsibility'],
    // validate: {
    //     params: {
    //         uid:responsibility.properties.uid
    //     }
    // },
    plugins: {
        'hapi-swagger': {
            responseMessages: [
                {code: 200, message: 'OK'},
                {code: 404, message: '[uid] is not associated with a responsibility '},
                {code: 500, message: 'system error'}
            ]
        }
    },
    handler: function (request, reply) {
        Logger.info("request %s %s", request.method, request.path, request.params, request.query);
        // Storage
        //
        var redisClient = request.server.plugins['hapi-redis'].client;
        redisClient.keys('responsibility_crud:*', function(err, data) {
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
                  var newAll = all.map(function(d) {
                    var dN = JSON.parse(d);
                    if (!dN.name) {
                      return
                    }
                    else {
                    return dN
                  }
                }).filter(function(n){ return n != undefined });
                  // var newArray = data.map(function(d) {
                  //   return {
                  //     uid: d.split(':')[1]
                  //   };
                  // });
                  reply(newAll);
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
