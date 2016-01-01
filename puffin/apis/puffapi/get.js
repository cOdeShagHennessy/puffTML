var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var puffapiDDL = use('apis/puffapi/ddl')();
//    
var storage = use('apis/puffapi/redisStore')();
//   

module.exports = {
    description: "Retrieve puffapi",
    notes: "Returns puffapi. Implementor add other details ...",
    tags: ['api', 'puffapi'],
    validate: {
        params: {
            uid:puffapiDDL.properties.uid
        }
    },
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
        //
//        var r = request.server.plugins['hapi-rethinkdb'].library;
        // r === this.rethinkdb;

//        var conn = request.server.plugins['hapi-rethinkdb'].connection;
        // conn === this.rethinkdbConn;

//        r.db('rethinkdb_ex').table('todos').filter(function(doc){
//            return doc('title').match("^T|t")
//        }).pluck('title').run(conn, function (err, cursor) {
////                cursor.each(console.log);
//            if (err) throw err;
//            cursor.toArray(function(err, result) {
//                if (err) throw err;
//                console.log(JSON.stringify(result, null, 2));
//            });
//        });

//        r.db('rethinkdb_ex').table('todos').pluck('sample').run(conn, function (err, cursor) {
////                cursor.each(console.log);
//            if (err) throw err;
//            cursor.toArray(function(err, result) {
//                if (err) throw err;
//                console.log("got from rethink \n"+ JSON.stringify(result, null, 2));
//
//            });
//        });


//        var libData = {
//            created: Date.now(),
//            name: "automatica",
//            dirty: false,
//        };
//        request.server.plugins['autopuff'].auto(libData, function (error) { });
//
//        request.server.plugins['rethinkmqpublisher'].publish({key:"frotomq",message:libData}, function () {
//            console.log("called back")
//        });
//        libData.name = "nottomatica"
//        request.server.plugins['testmqlib'].callme({key:"tootomq", message:libData}, function () {
//            console.log("called back")
//        });
        // Storage
        //    
        var redisClient =request.server.plugins['hapi-redis'].client;
        storage.find(redisClient, request.params, request.query, function(data,err){
            if(err) {
                Logger.error ("storage error:", err);
                reply({uid:"no uid"}).code(404)
            }
            else if(data) {
                Logger.debug("find returned %s", data);
                reply(data);
            }
            else
                reply({uid:request.params.uid});
        });
    },
    response: {schema: puffapiDDL.schema}
};

