var use = require('rekuire');
var Joi = require('joi');
var BDD = use('test/bdd');
var Logger = use('twiglet')(process.env.DEBUG_LEVEL || 'test', process.env.LOG_STYLE || '');

BDD.describe("crud DDL(Data Definition Language) Test", function () {
    var requestSchema = use('apis/crud/ddl')().schema

    BDD.it("validate crud DDL", function (done) {
        var crudDO = {
            uid:"AND019FID0123",
            sample: 'sample value'
        }

        Joi.validate(
            crudDO,
            requestSchema, {abortEarly: false, allowUnknown: true}, function (err) {
                if (err)
                    Logger.test('Error: invalidated %j %s', crudDO, err);
                BDD.expect(err).to.not.exist();
                Logger.test('validated %j', crudDO);
                done();
            });
        Logger.test("Assertions: %d", BDD.count());
        Logger.test("Incomplete assertions: %d", BDD.incomplete());
    });

    BDD.it("Invalidate crud DDL w/o required field", function (done) {
        var crudDO = {
            sample: 'sample value but no uid property'
        }
        Joi.validate(
            crudDO,
            requestSchema, {abortEarly: false, allowUnknown: true}, function (err) {
                BDD.expect(err).to.exist();
                Logger.test('invalidated %j', crudDO);
                done();
            });
        Logger.test("Assertions: %d", BDD.count());
        Logger.test("Incomplete assertions: %d", BDD.incomplete());
    });
});


