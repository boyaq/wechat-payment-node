import utils from './utils';
import urls from './urls';

import request from 'request';


export default class WechatPaymentForWeb {

	constructor(options) {
		if (!options.appid || !options.mch_id) {
			throw new Error("Seems that app id or merchant id is not set, please provide wechat app id and merchant id.");
			//throw new Error('haha');
		}
		this.options = options;
		console.log(options, 'options');
	}

    /**
     * create wechat unified order
     * @params order object
     * 
     * spec: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1
     */

	createUnifiedOrder(order) {
		return new Promise((resolve, reject) => {
			order.nonce_str = order.nonce_str || utils.createNonceStr();
			order.appid = this.options.appid;
			order.mch_id = this.options.mch_id;
			order.openid = this.options.openid;
			console.log(order, 'order for web here');
			order.sign = utils.sign(order, this.options.apiKey);
			console.log(order.sign, 'sign info');
			let requestParam = {
				url: urls.UNIFIED_ORDER,
				method: 'POST',
				body: utils.buildXML(order)
			};
			request(requestParam, (err, response, body) => {
				if (err) {
					reject(err);
				}
				utils.parseXML(body)
					.then(result => {
						resolve(result);
					})
					.catch(err => {
						reject(err);
					});
			});
		});
	}

    /**
     * config for payment 
     * 
     * @param prepayId from prepay id
     */

	configForPayment(prepayId) {
		let configData = {
			appid: this.options.appid,
			timestamp: parseInt(new Date().getTime() / 1000),
			noncestr: utils.createNonceStr(),
			package: "prepay_id=" + prepayId,
			signType: "MD5",
		}
		configData.sign = utils.sign(configData, this.options.apiKey);
		return configData;
	}

}