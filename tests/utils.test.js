var utils = require('../lib/utils');
var expect = require('chai').expect;

describe('utils：工具方法测试', function() {

    describe('utils.sign', function() {
        var object1 = { key1: 'test', key2: 'test' };
        var object2 = { key2: 'test', key1: 'test' };
        var sign1 = utils.sign(object1);
        var sign2 = utils.sign(object2);

        it('sign successed', function() {
            expect(sign1).to.be.equal(sign2);
        });
    });

    describe('utils.createNonceStr', function() {
        it('createNonceStr successed', function() {
            expect(utils.createNonceStr(24).length).to.be.equal(24);
        });
    });
});
