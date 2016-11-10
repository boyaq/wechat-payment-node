import utils from './utils';
import request from 'request';

import urls from '../config/urls';


export default class WechatPayment {

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
     * query
     * 
     * 
     * spec: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_2
     */
    queryOrder(query) {
        return new Promise((resolve, reject) => {
            if (!(query.transaction_id || query.out_trade_no)) {
                reject(new Error('缺少参数'));
            }

            query.nonce_str = query.nonce_str || utils.createNonceStr();
            query.appid = this.options.appid;
            query.mch_id = this.options.mch_id;
            query.sign = utils.sign(query, this.options.apiKey);

            request({
                url: urls.ORDER_QUERY,
                method: "POST",
                body: utils.buildXML({ xml: query })
            }, function (err, res, body) {
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

    closeOrder(order) {
        return new Promise((resolve, reject) => {
            if (!order.out_trade_no) {
                reject(new Error('缺少参数'));
            }

            order.nonce_str = order.nonce_str || utils.createNonceStr();
            order.appid = WechatPayment.options.appid;
            order.mch_id = WechatPayment.options.mch_id;
            order.sign = utils.sign(order, WechatPayment.options.apiKey);

            request({
                url: urls.CLOSE_ORDER,
                method: "POST",
                body: utils.buildXML({ xml: order })
            }, function (err, res, body) {
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

    refund(order) {
        return new Promise((resolve, reject) => {
            if (!order.transaction_id && !order.out_trade_no || !order.out_refund_no) {
                reject(new Error('缺少参数'));
            }

            order.nonce_str = order.nonce_str || utils.createNonceStr();
            order.appid = WechatPayment.options.appid;
            order.mch_id = WechatPayment.options.mch_id;
            order.op_user_id = order.op_user_id || order.mch_id;
            order.sign = utils.sign(order, WechatPayment.options.apiKey);

            request({
                url: urls.REFUND,
                method: "POST",
                body: utils.buildXML({ xml: order }),
                agentOptions: {
                    pfx: WechatPayment.options.pfx,
                    passphrase: WechatPayment.options.mch_id
                }
            }, function (err, response, body) {
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

    queryRefund(order) {
        return new Promise((resolve, reject) => {
            if (!(order.transaction_id || order.out_trade_no || order.out_refund_no || order.refund_id)) {
                reject(new Error('缺少参数'));
            }

            order.nonce_str = order.nonce_str || utils.createNonceStr();
            order.appid = WechatPayment.options.appid;
            order.mch_id = WechatPayment.options.mch_id;
            order.sign = utils.sign(order, WechatPayment.options.apiKey);

            request({
                url: urls.REFUND_QUERY,
                method: "POST",
                body: utils.buildXML({ xml: order })
            }, function (err, response, body) {
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


    transfers(order) {
        return new Promise((resolve, reject) => {
            if (!(order.partner_trade_no && order.openid && order.check_name && order.amount && order.desc && order.spbill_create_ip)) {
                reject(new Error('缺少参数'));
            }

            order.nonce_str = order.nonce_str || utils.createNonceStr();
            order.mch_appid = WechatPayment.options.appid;
            order.mchid = WechatPayment.options.mch_id;
            order.sign = utils.sign(order, WechatPayment.options.apiKey);

            request({
                url: urls.TRANSFERS,
                method: "POST",
                body: utils.buildXML(order),
                agentOptions: {
                    pfx: WechatPayment.options.pfx,
                    passphrase: WechatPayment.options.mch_id
                }
            }, function (err, response, body) {
                utils.parseXML(body, fn);
            });
        });
    }


    queryTransferInfo(order, fn) {
        return new Promise((resolve, reject) => {
            if (!order.partner_trade_no) {
                reject(new Error('缺少参数'));
            }

            order.nonce_str = order.nonce_str || utils.createNonceStr();
            order.appid = WechatPayment.options.appid;
            order.mch_id = WechatPayment.options.mch_id;
            order.sign = utils.sign(order, WechatPayment.options.apiKey);

            request({
                url: urls.TRNSFER_INFO,
                method: "POST",
                body: utils.buildXML({ xml: order }),
                agentOptions: {
                    pfx: WechatPayment.options.pfx,
                    passphrase: WechatPayment.options.mch_id
                }
            }, function (err, response, body) {
                utils.parseXML(body, fn);
            });
        });
    }




}