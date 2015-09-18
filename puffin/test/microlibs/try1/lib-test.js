var use = require('rekuire');
var BDD = use('test/bdd');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'test', process.env.LOG_STYLE || '');
//

BDD.describe('try1 microlib Test', function () {
    var Hapi = require('hapi');
    var server = new Hapi.Server();

    BDD.before(function (done) {

        server.connection({
            port: 3004
        });

        server.register({
            register: use('libs/try1')
        }, function (err) {
            BDD.expect(err).to.not.exist();
            BDD.expect(server.plugins["try1"]).to.exist();
            done();
        });
    });

    BDD.it('Test try1 plugin loads from the manifest', function (done) {
        BDD.expect(server.plugins["try1"]).to.exist();
        Logger.test("Assertions: %d", BDD.count());
        Logger.test("Incomplete assertions: %d", BDD.incomplete());
        done();
    });
    // 
    BDD.it("try1 calls doittomeonemoretime", function (done) {
        var libData = {
        };
        server.plugins['try1'].doittomeonemoretime(libData, function (data, error) {
            Logger.test("try1.doittomeonemoretime returned: ", data);
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