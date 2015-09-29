/**
* skircher generated on 9/17/2015, 7:39:15 PM using slush-mChasm.
* Author:Shawn Kircher
* Email:codeshaghennessy@gmail.com
* Overrides to topology configuration for each process-env.NODE_ENV supported
*/
module.exports.Config = function (environment) {
    var _config = {
        projectName: "ns_rethinkmq",
        filter: environment,
        environment: {
            $filter: 'env',
            // NODE_ENV=development
            development: {
                nanostack: {
                    exchangeName: "rethink_changes.ex",//TODO:Override me!    
                }
            },// NODE_ENV=local_docker
            local_docker: {
                nanostack: {
                    exchangeName: "rethink_changes.ex",//TODO:Override me!    
                }
            },// NODE_ENV=test
            test: {
                nanostack: {
                    exchangeName: "rethink_changes.ex",//TODO:Override me!    
                }
            },// 
            $default: {
                nanostack: { // this accepts the base configuration
                }
            }
        }
    }
    return _config;
};
