var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');

module.exports = function () {

    module = {};


    module.find = function (redisClient, params, query, callback) {
        if (params.id === "-999") {
            if (callback)
                callback({}, "Could not find");
        }
        else {
            redisClient.get(crudStoreKey(params.id), function(err, reply) {
                if (err) throw err
                // reply is null when the key is missing
                Logger.debug("redis found %s", reply);
                if (reply) {
                    if (callback) callback(JSON.parse(reply) || null);
                }
                else
                    if (callback) callback(null, "crud not found for " + params.id);
            });
        }
    };

    module.store = function (redisClient, params, payload, callback) {
        if (params.id === "-999" || payload.name=== "-999") {
            if (callback)
                callback({}, "Could not store");
        } else if (payload.name.indexOf("exists") === 0){
            if (callback)
                callback({id: "id exists", name: payload.name, exists:true});
        }
        else {
           if (!params.id) {
                redisClient.incr(crudSeqKey(), function (err, reply) {
                    Logger.debug("redis returned new id %s", reply);
                    payload.id = reply.toString();
                    redisClient.set(crudStoreKey(reply, payload), JSON.stringify(payload), function (err, res) {
                        if (err) throw err
                        Logger.debug("redis returned %s", res);
                        if (callback)
                            callback({id: reply.toString(), name: payload.name, exists: false});
                    })
                });
            } else {
                redisClient.set(crudStoreKey(params.id), JSON.stringify(payload), function (err, res) {
                    if (err) throw err
                    Logger.debug("redis returned %s", res);
                    if (callback)
                        callback({id: params.id, name: payload.name, exists: false});
                })
            }
        }
    };

    module.delete = function (redisClient, params, query, callback) {
        if (params.id === "-999") {
            if (callback)
                callback(0,"Could not delete");
        }
        else {
            redisClient.del(crudStoreKey(params.id), (function (err, data) {
                    if (err) throw err;
                    Logger.debug("redis removed %d", data);
                    if (callback)
                        callback(data);
                })
            );
        }
    };


    return module;
}

var crudSeqKey = function () {
    return 'responsibility_crud:seq';
};
var crudStoreKey = function (id){
    return 'responsibility_crud:' + id
};
