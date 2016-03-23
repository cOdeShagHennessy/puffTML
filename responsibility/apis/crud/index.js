module.exports.register = function (plugin, options, next) {
//    plugin.auth.scheme('custom', function (server, options) {
//        console.log('server.auth.scheme(): custom:');
//        return {
//            authenticate: function (request, reply) {
//                console.log('authenticate():');
//                reply('not authorized', reply.response).code(400)
//                reply.continue({ credentials: {} });
//            }
//        };
//    });
//    plugin.auth.strategy('test', 'custom', true);

    /*
     * crud Endpoints
     */
    /**
     * Index route needed to be recognized by swagger
     */

    plugin.route({
        method: 'GET',
        path:   '/ping',
        config: {
            //auth:'test',
            description: "Returns ping response for crud",
            notes:       "Returns a ping response",
            tags:        ['api', 'ping', 'logs'],
            handler:     function (request, reply) {
                reply('PONG').code(200);
            },
            plugins:     {
                'hapi-swagger': {
                    responseMessages: [
                        {code: 200, message: 'PONG'}
                    ]
                }
            }
        }
    });

    plugin.route({
        method: 'PUT',
        path:   '/{id}',
        config: require('./put')
    });

    plugin.route({
        method: 'POST',
        path:   '/',
        config: require('./post')
    });

    plugin.route({
        method: 'GET',
        path:   '/{id}',
        config: require('./get')
    });

    plugin.route({
        method: 'DELETE',
        path:   '/{id}',
        config: require('./delete')
    });
    plugin.route({
        method: 'GET',
        path:   '/all',
        config: require('./search')
    });
    // Return flow control from plugin
    next();
 };

 module.exports.register.attributes = {
    pkg: require('./package.json')
 }
