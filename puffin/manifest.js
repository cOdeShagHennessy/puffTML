var use = require('rekuire');
var version = use('/package.json').version;

module.exports = function (Config) {
    var module = {};

    module.props = {
        server : {
            app: Config
        },
        connections: [{
            port: Config.get('port'),
            labels: ['environment']
        }],
        plugins: {
            'good': {
                reporters: [{
                    reporter: require('good-console'),
                    events: {
                        response: '*',
                        log: '*'
                    }
                }]
            },
            'hapi-swagger': {
                apiVersion: version,
                documentationPath: '/docs/ui',
                endpoint: '/docs.json',
                payloadType: 'json',
                produces: 'json',
                info: {
                    title: 'pufftml puffin API',
                    description: 'Container for microlib'
                }
            },
            './apis/puffapi': [{
				routes: {
					prefix: '/puffapi'
				}
			}],
			//<insert new microapi above this line>

            // microlibs
			'./libs/autopuff': [{
				//MicroLibrary for Tests puff tests
				//exposing method auto
				//sample call: request.server.plugins['autopuff'].auto({[object Object],[object Object],[object Object]}, function (error) { });
			}],
			'./libs/rethinkmqpublisher': [{
				//MicroLibrary for Pushlishes to rethink mq
				//exposing method publish
				//sample call: request.server.plugins['rethinkmqpublisher'].publish({...libData}, function (reply,error) { });
                options: {
                    exchangeName: Config.get("rethinkMQ").exchangeName,
                    exchangeType: Config.get("rethinkMQ").exchangeType,
                    mqHost:      Config.get("rethinkMQ").mqHost
                }
//                exchangeName: Config.get("rethinkMQ.exchangeName"),
//                exchangeType: Config.get("rethinkMQ.exchangeType"),
//                mqHost: Config.get("rethinkMQ.mqHost")
			}],
//			'./libs/testmqlib': [{
//                options: {
//                    exchangeName: Config.get("rethinkMQ").exchangeName,
//                    exchangeType: Config.get("rethinkMQ").exchangeType,
//                    mqHost:      Config.get("rethinkMQ").mqHost
//                }
//				//MicroLibrary for Tests lib scaffolding
//				//exposing method callme
//				//sample call: request.server.plugins['testmqlib'].callme({...libData}, function (reply,error) { });
//			}],
			'./libs/thisworks': [{
                options: {
                    exchangeName: Config.get("rethinkMQ").exchangeName,
                    exchangeType: Config.get("rethinkMQ").exchangeType,
                    mqHost:      Config.get("rethinkMQ").mqHost,
                    queueName:"rethink.q",
                    queueKey:"frotomq",
                    callback: function(message) {
                        console.log("received this: " +  JSON.stringify(message) );
                    }
                }
				//MicroLibrary for Works right away
				//exposing method iknewitwould
				//sample call: request.server.plugins['thisworks'].iknewitwould({...libData}, function (reply,error) { });
			}],
			//<insert new microlib above this line>
        }
    };

    return module;
};

