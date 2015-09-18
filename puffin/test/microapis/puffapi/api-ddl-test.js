var use = require('rekuire');
var Joi = require('joi');
var BDD = use('test/bdd');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'test', process.env.LOG_STYLE || '');

BDD.describe("puffapi DDL(Data Definition Language) Test", function () {
    var requestSchema = use('apis/puffapi/ddl')().schema

    BDD.it("validate puffapi DDL", function (done) {
        var puffapiDO = {
            uid:"AND019FID0123",
            sample: 'sample value'
        }

        Joi.validate(
            puffapiDO,
            requestSchema, {abortEarly: false, allowUnknown: true}, function (err) {
                if (err)
                    Logger.test('Error: invalidated %j %s', puffapiDO, err);
                BDD.expect(err).to.not.exist();
                Logger.test('validated %j', puffapiDO);
                done();
            });
        Logger.test("Assertions: %d", BDD.count());
        Logger.test("Incomplete assertions: %d", BDD.incomplete());
    });

    BDD.it("Invalidate puffapi DDL w/o required field", function (done) {
        var puffapiDO = {
            sample: 'sample value but no uid property'
        }
        Joi.validate(
            puffapiDO,
            requestSchema, {abortEarly: false, allowUnknown: true}, function (err) {
                BDD.expect(err).to.exist();
                Logger.test('invalidated %j', puffapiDO);
                done();
            });
        Logger.test("Assertions: %d", BDD.count());
        Logger.test("Incomplete assertions: %d", BDD.incomplete());
    });
});


