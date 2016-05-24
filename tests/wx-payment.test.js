var wxPayment = require('../lib/wx-payment');
var expect = require('chai').expect;
var fs = require('fs');

describe('Wechat payment 测试', function() {

    describe('wxPayment.init', function() {
        var options = {
            //appid: 'xxxxxxxx',
        	mch_id: '1234567890',
        	apiKey: 'xxxxxxxxxxxxxxxxx', //微信商户平台API密钥
        	//pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }

        it('should throw an error', function() {
            expect(wxPayment.init.bind(wxPayment, options)).to.throw("Not set appid, mech_id...");
        });

        it('should be ok', function() {
            options['appid'] = 'xxxxxxxx';
            expect(wxPayment.init(options)).to.be.empty;
            console.log(wxPayment.options);
            expect(wxPayment.options).to.not.be.empty;
        });
    });


    describe('wxPayment.createUnifiedOrder', function() {
        var options = {
            appid: 'xxxxxxxx',
        	mch_id: '1234567890',
        	apiKey: 'xxxxxxxxxxxxxxxxx', //微信商户平台API密钥
        	//pfx: fs.readFileSync('./cert/apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }
        wxPayment.init(options);

        it('should be ok', function() {
            wxPayment.createUnifiedOrder({
            	body: '支付测试',
            	out_trade_no: '20140703'+Math.random().toString().substr(2, 10),
            	total_fee: 1,
            	spbill_create_ip: '192.168.2.210',
            	notify_url: 'http://wxpay_notify_url',
            	trade_type: 'JSAPI',
            	product_id: '1234567890',
                openid: 'xxxxxxxxxxxxxxxxx'
            }, function(err, result){
                // please set the true appid, mch_id, apiKey and openid, then
                // expect(result.return_code).to.be.equal('SUCCESS');
                expect(result.return_code).to.be.equal('FAIL');
            });
        });
    });

});
