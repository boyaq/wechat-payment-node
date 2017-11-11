import WechatPayment from '../src/WechatPayment';
import { expect } from 'chai';
import fs from 'fs';

var wechatConfig = require('../config/realWechat.json');

describe('Wechat payment 测试', function () {

    describe('Wechat Payment 构造函数', function () {
        let options = {
            //appid: wechatConfig.appId,
            mch_id: wechatConfig.mchId,
            apiKey: wechatConfig.partnerKey, //微信商户平台API密钥
            //pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }
        it('应该返回没有app id错误', function () {
            var fcn = function () { new WechatPayment(options) };
            expect(fcn).to.throw("Seems that app id or merchant id is not set, please provide wechat app id and merchant id.");
        });

        it('成功构造wechat payment instance', function () {
            options['appid'] = wechatConfig.appId;
            let wechatPaymentInstance = new WechatPayment(options);
            expect(wechatPaymentInstance.options).to.not.be.empty;
        });
    });

    var myResult = '';

    describe('统一下单接口: wxPayment.createUnifiedOrder', function () {
        let options = {
            appid: wechatConfig.appId,
            mch_id: wechatConfig.mchId,
            apiKey: wechatConfig.partnerKey, //微信商户平台API密钥
            //pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }


        let wechatPaymentInstance = new WechatPayment(options);
        it('统一下单', function () {
            wechatPaymentInstance.createUnifiedOrder({
                body: '支付测试',
                out_trade_no: '20140703' + Math.random().toString().substr(2, 10),
                total_fee: 1,
                spbill_create_ip: '192.168.2.210',
                notify_url: wechatConfig.notifyUrl,
                trade_type: wechatConfig.tradeType,
            })
                .then(result => {
                    console.log(result, 'result');
                    myResult = result;
                    expect(result.return_code).to.be.equal('SUCCESS');

                })
                .catch(err => {
                    console.log(err);
                })
        });
    });

    describe('生成payment设置: wxPayment.configForPayment', function () {
        let options = {
            appid: wechatConfig.appId,
            mch_id: wechatConfig.mchId,
            apiKey: wechatConfig.partnerKey, //微信商户平台API密钥
            //pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }
        let wechatPaymentInstance = new WechatPayment(options);
        it('生成配置', function () {
            let prepayId = 'wx201612132002348597b1e4c50601226291';
            let config = wechatPaymentInstance.configForPayment(prepayId);
            console.log(config, 'payment config');
        });
    });

    describe('退款通知: wxPayment.checkNotification', function () {
        let xml = `<xml><return_code>SUCCESS</return_code><appid><![CDATA[wx38d2402f9979dc4d]]></appid><mch_id><![CDATA[1452255102]]></mch_id><nonce_str><![CDATA[c90d229bf6463ee14d5c46fe2c8a44dd]]></nonce_str><req_info><![CDATA[Kv22o0NO3GBHYCxDjIw42ROgFFtDu8d2obgNmQw5hrSbT0ImnqFVh7AcLiEmZMgsSLSqq8cisZqV6ut5OeyCJUXsoEI0IOrYfj4fTiaqLzr8HPtqbhdD/dtOaczVjku5X5qpVubIN46SEqFvnHdQTftyrJcRQbM22FMpco+kwf8kveTe6ajJKBfoPE7dvXjaGVpVAhUuDVHcdiYUEUDHvFNj0Jmv+yjRSQk83lDxh6azp5XbqYJ/AOSHaPVanqbuNW8Ejap9vPISqLSv3q9u40p+gGU/rVfPzc4m6qseW8APNapxwiTBe4c2q3tu7wwQ2DXl3GP3fjG/j4sfrBOHyjyCggkJhqWNvdVplawo0PQxVfSfJmYMUibcgMdk+iCVeNhXw+YS5v0X8OQv1313zkYeY3e7Inv0Nsi8yT4/ImGnyFue/ywQJD+lVSYXLkB5IAp1+zvsFMDBf+PcOiOP0HGlUpdIL12Pt+Q3lny9bm6THkBmejD50mFBBwKSjxC4yv+HmIVBOC0nbjquG4vC+Kixlm1WsNyfn3uFgX1ijPl8sIz8rufuJY8Ta64mHYGs2Py+skR2YPtGXOWdrvKefwZHyzenH1ykl+EWeDvg8oKO/L6TGnrjQ9rIOGlC5Jj865xSVLHl/rQfRU1ZY4C72JxgI/MnyEhChLLbA9G/CR30pISUbSTTVdTFgNubi9dRuo6R3t71TUrbEFtIB2SscoEfbpqyGX/zw/0WbUOoJoBrw3UkXKpFINJz20pHQDB2oThBrWZOoCvVUs7W9XRtN5/aSjrRnRx8D9uHxaKaNypD+YgM7x47RBtAJ0/4M5ofEhAvC2HMrpbxS0XUVX1SuZoPPBLcug4uc0S9HmdYkFQqey9mUECQ60/f/C9uXcO1XalbQ6bDvAyJ45eHNdJx2ZCqzyr1FLtsLl+mQynrd2kgQoeG2sulYd3B7VKiIPPARyb4+zKBDusq0m6Wrx8T3fNr6l+h4RfqoFqsxTDMIYGktTU+vSQwecIDMJqKXDQ/v2WWyhQVeQqejx/e4kSRCQ==]]></req_info></xml>`;
        it('解码成功', async function () {
            try {
                let res = await WechatPayment.checkNotification(xml, wechatConfig.partnerKey, 'refund');
                expect(res).to.be.an('object');
                expect(res).to.have.property('out_trade_no');

            } catch (error) {
                console.log(error);
            }
        });
    });


});
