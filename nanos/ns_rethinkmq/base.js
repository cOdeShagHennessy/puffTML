/**
* skircher generated on 9/17/2015, 7:39:15 PM using slush-mChasm.
* Author:Shawn Kircher
* Email:codeshaghennessy@gmail.com
* Base topology configuration. Only need to supply overrides for values being changed for specific environments
* being supported.
*/
module.exports.Config = function (environment) {
    return {
        filter: environment,
        exchangeName: "rethink_changes.ex",
        exchangeType: "topic",
        mqHost: "192.168.99.100",
    }
};
