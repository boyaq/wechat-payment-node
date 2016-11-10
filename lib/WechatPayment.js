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

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _urls = require('../config/urls');

var _urls2 = _interopRequireDefault(_urls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WechatPayment = function () {
    function WechatPayment(options) {
        (0, _classCallCheck3.default)(this, WechatPayment);

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

    (0, _createClass3.default)(WechatPayment, [{
        key: 'createUnifiedOrder',
        value: function createUnifiedOrder(order) {
            var _this = this;

            return new _promise2.default(function (resolve, reject) {
                order.nonce_str = order.nonce_str || _utils2.default.createNonceStr();
                order.appid = _this.options.appid;
                order.mch_id = _this.options.mch_id;
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
         * query
         * 
         * 
         * spec: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_2
         */

    }, {
        key: 'queryOrder',
        value: function queryOrder(query) {
            var _this2 = this;

            return new _promise2.default(function (resolve, reject) {
                if (!(query.transaction_id || query.out_trade_no)) {
                    reject(new Error('缺少参数'));
                }

                query.nonce_str = query.nonce_str || _utils2.default.createNonceStr();
                query.appid = _this2.options.appid;
                query.mch_id = _this2.options.mch_id;
                query.sign = _utils2.default.sign(query, _this2.options.apiKey);

                (0, _request2.default)({
                    url: _urls2.default.ORDER_QUERY,
                    method: "POST",
                    body: _utils2.default.buildXML({ xml: query })
                }, function (err, res, body) {
                    _utils2.default.parseXML(body).then(function (result) {
                        resolve(result);
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            });
        }
    }, {
        key: 'closeOrder',
        value: function closeOrder(order) {
            return new _promise2.default(function (resolve, reject) {
                if (!order.out_trade_no) {
                    reject(new Error('缺少参数'));
                }

                order.nonce_str = order.nonce_str || _utils2.default.createNonceStr();
                order.appid = WechatPayment.options.appid;
                order.mch_id = WechatPayment.options.mch_id;
                order.sign = _utils2.default.sign(order, WechatPayment.options.apiKey);

                (0, _request2.default)({
                    url: _urls2.default.CLOSE_ORDER,
                    method: "POST",
                    body: _utils2.default.buildXML({ xml: order })
                }, function (err, res, body) {
                    _utils2.default.parseXML(body).then(function (result) {
                        resolve(result);
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            });
        }
    }, {
        key: 'refund',
        value: function refund(order) {
            return new _promise2.default(function (resolve, reject) {
                if (!order.transaction_id && !order.out_trade_no || !order.out_refund_no) {
                    reject(new Error('缺少参数'));
                }

                order.nonce_str = order.nonce_str || _utils2.default.createNonceStr();
                order.appid = WechatPayment.options.appid;
                order.mch_id = WechatPayment.options.mch_id;
                order.op_user_id = order.op_user_id || order.mch_id;
                order.sign = _utils2.default.sign(order, WechatPayment.options.apiKey);

                (0, _request2.default)({
                    url: _urls2.default.REFUND,
                    method: "POST",
                    body: _utils2.default.buildXML({ xml: order }),
                    agentOptions: {
                        pfx: WechatPayment.options.pfx,
                        passphrase: WechatPayment.options.mch_id
                    }
                }, function (err, response, body) {
                    _utils2.default.parseXML(body).then(function (result) {
                        resolve(result);
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            });
        }
    }, {
        key: 'queryRefund',
        value: function queryRefund(order) {
            return new _promise2.default(function (resolve, reject) {
                if (!(order.transaction_id || order.out_trade_no || order.out_refund_no || order.refund_id)) {
                    reject(new Error('缺少参数'));
                }

                order.nonce_str = order.nonce_str || _utils2.default.createNonceStr();
                order.appid = WechatPayment.options.appid;
                order.mch_id = WechatPayment.options.mch_id;
                order.sign = _utils2.default.sign(order, WechatPayment.options.apiKey);

                (0, _request2.default)({
                    url: _urls2.default.REFUND_QUERY,
                    method: "POST",
                    body: _utils2.default.buildXML({ xml: order })
                }, function (err, response, body) {
                    _utils2.default.parseXML(body).then(function (result) {
                        resolve(result);
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            });
        }
    }, {
        key: 'transfers',
        value: function transfers(order) {
            return new _promise2.default(function (resolve, reject) {
                if (!(order.partner_trade_no && order.openid && order.check_name && order.amount && order.desc && order.spbill_create_ip)) {
                    reject(new Error('缺少参数'));
                }

                order.nonce_str = order.nonce_str || _utils2.default.createNonceStr();
                order.mch_appid = WechatPayment.options.appid;
                order.mchid = WechatPayment.options.mch_id;
                order.sign = _utils2.default.sign(order, WechatPayment.options.apiKey);

                (0, _request2.default)({
                    url: _urls2.default.TRANSFERS,
                    method: "POST",
                    body: _utils2.default.buildXML(order),
                    agentOptions: {
                        pfx: WechatPayment.options.pfx,
                        passphrase: WechatPayment.options.mch_id
                    }
                }, function (err, response, body) {
                    _utils2.default.parseXML(body, fn);
                });
            });
        }
    }, {
        key: 'queryTransferInfo',
        value: function queryTransferInfo(order, fn) {
            return new _promise2.default(function (resolve, reject) {
                if (!order.partner_trade_no) {
                    reject(new Error('缺少参数'));
                }

                order.nonce_str = order.nonce_str || _utils2.default.createNonceStr();
                order.appid = WechatPayment.options.appid;
                order.mch_id = WechatPayment.options.mch_id;
                order.sign = _utils2.default.sign(order, WechatPayment.options.apiKey);

                (0, _request2.default)({
                    url: _urls2.default.TRNSFER_INFO,
                    method: "POST",
                    body: _utils2.default.buildXML({ xml: order }),
                    agentOptions: {
                        pfx: WechatPayment.options.pfx,
                        passphrase: WechatPayment.options.mch_id
                    }
                }, function (err, response, body) {
                    _utils2.default.parseXML(body, fn);
                });
            });
        }
    }]);
    return WechatPayment;
}();

exports.default = WechatPayment;