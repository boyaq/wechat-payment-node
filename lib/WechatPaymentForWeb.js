'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _urls = require('./urls');

var _urls2 = _interopRequireDefault(_urls);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _jssha = require('jssha');

var _jssha2 = _interopRequireDefault(_jssha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WechatPaymentForWeb = function () {
	function WechatPaymentForWeb(options) {
		(0, _classCallCheck3.default)(this, WechatPaymentForWeb);

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

	(0, _createClass3.default)(WechatPaymentForWeb, [{
		key: 'createUnifiedOrder',
		value: function createUnifiedOrder(order) {
			var _this = this;

			return new _promise2.default(function (resolve, reject) {
				order.nonce_str = order.nonce_str || _utils2.default.createNonceStr();
				order.appid = _this.options.appid;
				order.mch_id = _this.options.mch_id;
				order.openid = _this.options.openid;
				order.sign = _utils2.default.sign(order, _this.options.apiKey);
				var requestParam = {
					url: _urls2.default.UNIFIED_ORDER,
					method: 'POST',
					body: _utils2.default.buildXML(order)
				};
				(0, _request2.default)(requestParam, function (err, response, body) {
					if (err) {
						reject(err);
					}
					_utils2.default.parseXML(body).then(function (result) {
						resolve(result);
					}).catch(function (err) {
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

	}, {
		key: 'configForPayment',
		value: function configForPayment(prepayId, nonceStr, timeStamp) {
			var configData = {
				appId: this.options.appid,
				nonceStr: nonceStr,
				package: "prepay_id=" + prepayId,
				signType: "MD5",
				timeStamp: timeStamp
			};
			configData.paySign = _utils2.default.sign(configData, this.options.apiKey);
			return configData;
		}
	}, {
		key: 'configSignature',
		value: function configSignature(url, nonceStr, jsApiTicket) {
			var configData = {
				jsapi_ticket: jsApiTicket,
				nonceStr: nonceStr,
				timestamp: parseInt(new Date().getTime() / 1000) + '',
				url: url
			};
			var string = _utils2.default.buildQueryStringWithoutEncode(configData);
			var shaObj = new _jssha2.default("SHA-1", 'TEXT');
			shaObj.update(string);

			return {
				signature: shaObj.getHash('HEX'),
				timestamp: configData.timestamp
			};
		}
	}]);
	return WechatPaymentForWeb;
}();

exports.default = WechatPaymentForWeb;