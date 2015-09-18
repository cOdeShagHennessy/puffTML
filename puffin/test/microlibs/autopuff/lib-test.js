var use = require('rekuire');
var BDD = use('test/bdd');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'test', process.env.LOG_STYLE || '');
//

BDD.describe('autopuff microlib Test', function () {
    var Hapi = require('hapi');
    var server = new Hapi.Server();

    BDD.before(function (done) {

        server.connection({
            port: 3004
        });

        server.register({
            register: use('libs/autopuff')
        }, function (err) {
            BDD.expect(err).to.not.exist();
            BDD.expect(server.plugins["autopuff"]).to.exist();
            done();
        });
    });

    BDD.it('Test autopuff plugin loads from the manifest', function (done) {
        BDD.expect(server.plugins["autopuff"]).to.exist();
        Logger.test("Assertions: %d", BDD.count());
        Logger.test("Incomplete assertions: %d", BDD.incomplete());
        done();
    });
    // 
    BDD.it("autopuff calls auto", function (done) {
        var libData = {
            created: Date.now(), 
            name: "automatica", 
            dirty: false,
        };
        server.plugins['autopuff'].auto(libData, function (data, error) {
            Logger.test("autopuff.auto returned: ", data);
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