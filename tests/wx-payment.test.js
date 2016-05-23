var wxPayment = require('../lib/wx-payment');
var expect = require('chai').expect;

describe('Wechat payment 测试', function() {

    describe('wxPayment.init', function() {
        var options = {
            //appid: 'xxxxxxxx',
        	mch_id: '1234567890',
        	partner_key: 'xxxxxxxxxxxxxxxxx', //微信商户平台API密钥
        	//pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }

        it('should throw an error', function() {
            expect(wxPayment.init.bind(wxPayment, options)).to.throw("Not set appid, mech_id...");
        });

        it('should be ok', function() {
            options['appid'] = 'xxxxxxxx';
            expect(wxPayment.init(options)).to.be.empty;
        });
    });


    describe('wxPayment.createUnifiedOrder', function() {
        var options = {
            appid: 'xxxxxxxx',
        	mch_id: '1234567890',
        	partner_key: 'xxxxxxxxxxxxxxxxx', //微信商户平台API密钥
        	//pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
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
            	product_id: '1234567890'
            }, function(err, result){
            	console.log(result);
                expect(result.return_code).to.be.equal('FAIL');
            });
        });
    });

});
