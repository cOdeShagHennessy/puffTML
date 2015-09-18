var Joi = require('joi');
var use = require('rekuire');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'info', process.env.LOG_STYLE || '');

module.exports = function () {

    module = {};

    
    module.find = function (redisClient, params, query, callback) {
        if (params.uid === "-999") {
            if (callback)
                callback({}, "Could not find");
        }
        else {
            redisClient.get(puffapiStoreKey(params.uid), function(err, reply) {
                if (err) throw err
                // reply is null when the key is missing
                Logger.debug("redis found %s", reply);
                if (reply) {
                    if (callback) callback(JSON.parse(reply) || null);
                }
                else
                    if (callback) callback(null, "puffapi not found for " + params.uid);
            });
        }
    };

    module.store = function (redisClient, params, payload, callback) {
        if (params.uid === "-999" || payload.sample === "-999") {
            if (callback)
                callback({}, "Could not store");
        } else if (payload.sample.indexOf("exists") === 0){
            if (callback)
                callback({uid: "uid exists", sample: payload.sample, exists:true});
        }
        else {
           if (!params.uid) {
                redisClient.incr(puffapiSeqKey(), function (err, reply) {
                    Logger.debug("redis returned new uid %s", reply);
                    payload.uid = reply.toString();
                    redisClient.set(puffapiStoreKey(reply, payload), JSON.stringify(payload), function (err, res) {
                        if (err) throw err
                        Logger.debug("redis returned %s", res);
                        if (callback)
                            callback({uid: reply.toString(), sample: payload.sample, exists: false});
                    })
                });
            } else {
                redisClient.set(puffapiStoreKey(params.uid), JSON.stringify(payload), function (err, res) {
                    if (err) throw err
                    Logger.debug("redis returned %s", res);
                    if (callback)
                        callback({uid: params.uid, sample: payload.sample, exists: false});
                })
            }
        }
    };


    return module;
}

var puffapiSeqKey = function () {
    return 'puffapi:seq';
};
var puffapiStoreKey = function (uid){
    return 'puffapi:' + uid
};
