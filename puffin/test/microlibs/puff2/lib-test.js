var use = require('rekuire');
var BDD = use('test/bdd');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'test', process.env.LOG_STYLE || '');
//

BDD.describe('puff2 microlib Test', function () {
    var Hapi = require('hapi');
    var server = new Hapi.Server();

    BDD.before(function (done) {

        server.connection({
            port: 3004
        });

        server.register({
            register: use('libs/puff2')
        }, function (err) {
            BDD.expect(err).to.not.exist();
            BDD.expect(server.plugins['puff2']).to.exist();
            done();
        });
    });

    BDD.it('Test puffapi plugin loads from the manifest', function (done) {
        BDD.expect(server.plugins['puff2']).to.exist();
        Logger.test("Assertions: %d", BDD.count());
        Logger.test("Incomplete assertions: %d", BDD.incomplete());
        done();
    });
    // 
    BDD.it(' puff2 calls huff2', function (done) {
        server.plugins['puff2'].huff2({dest1:"mydest"}, function (data, error) {
            Logger.test("puff2.huff2 returned: ", data);
            BDD.expect(error).to.not.exist();
            Logger.test("Assertions: %d", BDD.count());
            Logger.test("Incomplete assertions: %d", BDD.incomplete());
            done();
        });
    });//

    BDD.after(function (done) {
        //clean up
        done();
    });

});