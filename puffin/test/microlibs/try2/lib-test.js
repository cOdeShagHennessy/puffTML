var use = require('rekuire');
var BDD = use('test/bdd');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'test', process.env.LOG_STYLE || '');
//

BDD.describe('try2 microlib Test', function () {
    var Hapi = require('hapi');
    var server = new Hapi.Server();

    BDD.before(function (done) {

        server.connection({
            port: 3004
        });

        server.register({
            register: use('libs/try2')
        }, function (err) {
            BDD.expect(err).to.not.exist();
            BDD.expect(server.plugins["try2"]).to.exist();
            done();
        });
    });

    BDD.it('Test try2 plugin loads from the manifest', function (done) {
        BDD.expect(server.plugins["try2"]).to.exist();
        Logger.test("Assertions: %d", BDD.count());
        Logger.test("Incomplete assertions: %d", BDD.incomplete());
        done();
    });
    // 
    BDD.it("try2 calls likemenow", function (done) {
        var libData = {
            fan: true,  
        };
        server.plugins['try2'].likemenow(libData, function (reply, error) {
            Logger.test("try2.likemenow returned: ", reply);
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