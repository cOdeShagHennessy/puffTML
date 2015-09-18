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
			'./libs/puffque': [{
				//MicroLibrary for It does alot
				//exposing method questly
			}],
			'./libs/pufferye': [{
				//MicroLibrary for Puffs up about nada
				//exposing method buff
				//sample call: request.server.plugins['pufferye'].buff({[object Object],[object Object]'}, function (error) { });
			}],
			'./libs/puffelhuff': [{
				//MicroLibrary for Huffs and puffs
				//exposing method huff
				//sample call: request.server.plugins['puffelhuff'].huff({[{"name":"huffid","type":"string","description":"unique huff","defValue":"00000000000"},{"name":"huffName","type":"string","description":"name of the huff","defValue":"hamply"}]'}, function (error) { });
            }],
			'./libs/puff2': [{
				//MicroLibrary for Laksdjfladf
				//exposing method huff2
				//sample call: request.server.plugins['puff2'].huff2({[object Object]}, function (error) { });
			}],
			'./libs/autopuff': [{
				//MicroLibrary for Tests puff tests
				//exposing method auto
				//sample call: request.server.plugins['autopuff'].auto({[object Object],[object Object],[object Object]}, function (error) { });
			}],
			'./libs/try1': [{
				//MicroLibrary for It does alot
				//exposing method doittomeonemoretime
				//sample call: request.server.plugins['try1'].doittomeonemoretime({...libData}, function (error) { });
			}],
			'./libs/try2': [{
				//MicroLibrary for Try this again
				//exposing method likemenow
				//sample call: request.server.plugins['try2'].likemenow({...libData}, function (reply,error) { });
			}],
			//<insert new microlib above this line>
        }
    };

    return module;
};

