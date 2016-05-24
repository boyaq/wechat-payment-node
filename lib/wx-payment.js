
var utils = require('./utils');
var request = require('request');

var WechatPayment = {
    init: function(options) {
        if (!options.appid || !options.mch_id) {
            throw new Error("Not set appid, mech_id...");
    	}
        WechatPayment.options = options;
    },

    createUnifiedOrder: function(order, fn) {
        order.nonce_str = order.nonce_str || utils.createNonceStr();
        order.appid = WechatPayment.options.appid;
        order.mch_id = WechatPayment.options.mch_id;
    	order.sign = utils.sign(order, WechatPayment.options.apiKey);

    	request({
    		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
    		method: 'POST',
    		body: utils.buildXML(order)
    	}, function(err, response, body){
    		utils.parseXML(body, fn);
    	});
    },


    queryOrder: function(query, fn) {
    	if (!(query.transaction_id || query.out_trade_no)) {
    		fn(null, { return_code: 'FAIL', return_msg:'缺少参数' });
    	}

    	query.nonce_str = query.nonce_str ||  utils.createNonceStr();
        query.appid = WechatPayment.options.appid;
        query.mch_id = WechatPayment.options.mch_id;
    	query.sign = utils.sign(query, WechatPayment.options.apiKey);

    	request({
    		url: "https://api.mch.weixin.qq.com/pay/orderquery",
    		method: "POST",
    		body: util.buildXML({xml: query})
    	}, function(err, res, body){
    		util.parseXML(body, fn);
    	});
    },


    closeOrder: function(order, fn) {
    	if (!order.out_trade_no) {
    		fn(null, { return_code:"FAIL", return_msg:"缺少参数" });
    	}

    	order.nonce_str = order.nonce_str || utils.createNonceStr();
        order.appid = WechatPayment.options.appid;
        order.mch_id = WechatPayment.options.mch_id;
    	order.sign = utils.sign(order, WechatPayment.options.apiKey);

    	request({
    		url: "https://api.mch.weixin.qq.com/pay/closeorder",
    		method: "POST",
    		body: util.buildXML({xml: order})
    	}, function(err, res, body){
    		util.parseXML(body, fn);
    	});
    },


    refund: function(order, fn){
    	if (!(order.transaction_id || order.out_refund_no)) {
    		fn(null, { return_code: 'FAIL', return_msg:'缺少参数' });
    	}

    	order.nonce_str = order.nonce_str || utils.createNonceStr();
        order.appid = WechatPayment.options.appid;
        order.mch_id = WechatPayment.options.mch_id;
        order.sign = utils.sign(order, WechatPayment.options.apiKey);

    	request({
    		url: "https://api.mch.weixin.qq.com/secapi/pay/refund",
    		method: "POST",
    		body: util.buildXML({xml: order}),
    		agentOptions: {
    			pfx: WechatPayment.options.pfx,
    			passphrase: WechatPayment.options.mch_id
    		}
    	}, function(err, response, body){
    		util.parseXML(body, fn);
    	});
    },

    getBrandWCPayRequestParams: function(order, fn) {
    	order.trade_type = "JSAPI";
    	WechatPayment.createUnifiedOrder(order, function(err, data){
    		var reqparam = {
    			appId: WechatPayment.options.appid,
    			timeStamp: utils.createTimestamp(),
    			nonceStr: data.nonce_str,
    			package: "prepay_id=" + data.prepay_id,
    			signType: "MD5"
    		};
    		reqparam.paySign = utils.sign(reqparam, WechatPayment.options.apiKey);
    		fn(err, reqparam);
    	});
    },

    createMerchantPrepayUrl: function(param) {
    	param.time_stamp = param.time_stamp || utils.createTimestamp();
    	param.nonce_str = param.nonce_str || utils.createNonceStr();
        param.appid = WechatPayment.options.appid;
        param.mch_id = WechatPayment.options.mch_id;
    	param.sign = utils.sign(param, WechatPayment.options.apiKey);

    	var query = Object.keys(param).filter(function(key){
    		return ['sign', 'mch_id', 'product_id', 'appid', 'time_stamp', 'nonce_str'].indexOf(key)>=0;
    	}).map(function(key){
    		return key + "=" + encodeURIComponent(param[key]);
    	}).join('&');

    	return "weixin://wxpay/bizpayurl?" + query;
    },

    wxCallback: function(fn) {
    	return function(req, res, next){
    		var _this = this;
    		res.success = function(){ res.end(utils.buildXML({ xml: { return_code:'SUCCESS' } })); };
    		res.fail = function(){ res.end(utils.buildXML({ xml: { return_code:'FAIL' } })); };

    		utils.pipe(req, function(err, data){
    			var xml = data.toString('utf8');
    			utils.parseXML(xml, function(err, msg){
    				req.wxmessage = msg;
    				fn.apply(_this, [msg, req, res, next]);
    			});
    		});
    	}
    }

}

module.exports = WechatPayment;
