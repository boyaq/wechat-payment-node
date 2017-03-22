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
			order.sign = utils.sign(order, this.options.apiKey);
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
	configForPayment(prepayId, nonceStr, timeStamp) {
		let configData = {
			appId: this.options.appid,
			nonceStr: nonceStr,
			package: "prepay_id=" + prepayId,
			signType: "MD5",
			timeStamp: timeStamp
		}
		configData.sign = utils.sign(configData, this.options.apiKey);
		return configData;
	}


	configSignature(url, nonceStr, jsApiTicket) {
        let configData = {
            jsapi_ticket: jsApiTicket,
            nonceStr: nonceStr,
            timestamp: parseInt(new Date().getTime() / 1000) + '',
            url: url
        }
        let string = utils.buildQueryStringWithoutEncode(configData);
        let shaObj = new jsSHA("SHA-1", 'TEXT');
        shaObj.update(string);

        return {
            signature: shaObj.getHash('HEX'),
            timestamp: configData.timestamp
        };

    }

}