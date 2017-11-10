import utils from '../src/utils';
import {expect} from 'chai';

describe('utils：工具方法测试', function() {

    describe('sign 函数测试', function() {
        var object1 = { key1: 'test', key2: 'test' };
        var object2 = { key2: 'test', key1: 'test' };
        var sign1 = utils.sign(object1);
        var sign2 = utils.sign(object2);

        it('sign 成功', function() {
            expect(sign1).to.be.equal(sign2);
        });
    });

    describe('createNonceStr 随机字符串', function() {
        it('createNonceStr 随机字符串生成成功', function() {
            expect(utils.createNonceStr(24).length).to.be.equal(24);
        });
    });
});
