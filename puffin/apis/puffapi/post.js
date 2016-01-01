var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');
var puffapiDDL = use('apis/puffapi/ddl')();
//    
var storage = use('apis/puffapi/redisStore')();
//   

module.exports = {
    description: "Create a new puffapi",
    notes:       "Creates a new puffapi. Implementor add other details ...",
    tags:        ['api', 'puffapi'],
    validate:    {
        payload: {
//            sample: Joi.string().description("puffapi sample property"),
            sample:puffapiDDL.properties.sample
        }
    },
    plugins:     {
        'hapi-swagger': {
            responseMessages: [
                {code: 200, message: 'OK'},
                {code: 201, message: 'Created'},
                {code: 422, message: 'puffapi could not be created'},
                {code: 500, message: 'system error'}
            ]
        }
    },
    handler:     function (request, reply) {
        Logger.info("storing %j at %s", request.payload);
        //var r = request.server.plugins['hapi-rethinkdb'].library;

        //var conn = request.server.plugins['hapi-rethinkdb'].connection;
//        r.db('rethinkdb_ex').table('todos').insert(request.payload).run(conn, function (err, cursor) {
////                cursor.each(console.log);
//            if (err) throw err;
//            console.log("post'd to rethink \n"+ JSON.stringify(cursor, null, 2));
////            cursor.toArray(function(err, result) {
////                if (err) throw err;
////                console.log("post'd to rethink \n"+ JSON.stringify(result, null, 2));
////
////            });
//        });
//        r.db('rethinkdb_ex').table('todos').insert(request.payload, {returnChanges: true}).run(conn, function(error, result) {
//            if (error) {
//                handleError(res, error)
//            }
//            else if (result.inserted !== 1) {
//                handleError(res, new Error("Document was not inserted."))
//            }
//            else {
//                console.log("post'd to rethink \n"+ JSON.stringify(result.changes[0].new_val, null, 2));
//                //res.send(JSON.stringify(result.changes[0].new_val));
//            }
////            next();
//        });

//        request.server.plugins['rethinkmqpublisher'].publish({key:"frotomq",message:request.payload}, function () {
//            console.log("called back")
//        });
        // Storage
        //    
        var redisClient = request.server.plugins['hapi-redis'].client;
        storage.store(redisClient, request.params, request.payload, function (data, err) {
            if (err) {
                Logger.error("store returned", err);
                reply({uid: "no uid"}).code(422)
            }
            else if (data && data.exists) {
                Logger.debug("find returned %s", data);
                reply(request.payload).code(200);
            }
            else
                reply({uid:data.uid,sample:data.sample}).created("/" + data.uid);
        });
        
        },
        response: { schema: puffapiDDL.schema }
} ;
