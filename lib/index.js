'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WechatPaymentForWeb = undefined;

var _WechatPayment = require('./WechatPayment');

var _WechatPayment2 = _interopRequireDefault(_WechatPayment);

var _WechatPaymentForWeb = require('./WechatPaymentForWeb');

var _WechatPaymentForWeb2 = _interopRequireDefault(_WechatPaymentForWeb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * wechat payment node for app and jsapi payment
 * Copyright(c) 2013-2017 Alim Boyaq <boyaq@otkur.biz>
 * MIT Licensed
 */

exports.WechatPaymentForWeb = _WechatPaymentForWeb2.default;
exports.default = _WechatPayment2.default;