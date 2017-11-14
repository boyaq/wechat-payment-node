import utils from './utils';
import urls from './urls';
import request from 'request';

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
     * config for payment 
     * 
     * @param prepayId from prepay id
     */

    configForPayment(prepayId) {
        let configData = {
            appid: this.options.appid,
            partnerid: this.options.mch_id,
            prepayid: prepayId,
            package: 'Sign=WXPay',
            noncestr: utils.createNonceStr(),
            timestamp: parseInt(new Date().getTime() / 1000)
        }
        configData.sign = utils.sign(configData, this.options.apiKey);
        return configData;
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
            order.appid = this.options.appid;
            order.mch_id = this.options.mch_id;
            order.sign = utils.sign(order, this.options.apiKey);

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
            order.appid = this.options.appid;
            order.mch_id = this.options.mch_id;
            order.op_user_id = order.op_user_id || order.mch_id;
            order.sign = utils.sign(order, this.options.apiKey);

            request({
                url: urls.REFUND,
                method: "POST",
                body: utils.buildXML({ xml: order }),
                agentOptions: {
                    pfx: this.options.pfx,
                    passphrase: this.options.mch_id
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
            order.appid = this.options.appid;
            order.mch_id = this.options.mch_id;
            order.sign = utils.sign(order, this.options.apiKey);

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
            order.mch_appid = this.options.appid;
            order.mchid = this.options.mch_id;
            order.sign = utils.sign(order, this.options.apiKey);

            request({
                url: urls.TRANSFERS,
                method: "POST",
                body: utils.buildXML(order),
                agentOptions: {
                    pfx: this.options.pfx,
                    passphrase: this.options.mch_id
                }
            }, function (err, response, body) {
                if ( err ) return reject(err);
                utils.parseXML.parseXML(body).then(function (result) {
                  if ( !result || result.result_code === 'FAIL' ) reject(result);
                  else resolve(result);
                }).catch(reject);
            });
        });
    }


    queryTransferInfo(order, fn) {
        return new Promise((resolve, reject) => {
            if (!order.partner_trade_no) {
                reject(new Error('缺少参数'));
            }

            order.nonce_str = order.nonce_str || utils.createNonceStr();
            order.appid = this.options.appid;
            order.mch_id = this.options.mch_id;
            order.sign = utils.sign(order, this.options.apiKey);

            request({
                url: urls.TRNSFER_INFO,
                method: "POST",
                body: utils.buildXML({ xml: order }),
                agentOptions: {
                    pfx: this.options.pfx,
                    passphrase: this.options.mch_id
                }
            }, function (err, response, body) {
                utils.parseXML(body, fn);
            });
        });
    }


    getBrandWCPayRequestParams(order) {
        return new Promise((resolve, reject) => {
            order.trade_type = "JSAPI";
            this.createUnifiedOrder(order)
                .then(data => {
                    let reqparam = {
                        appId: this.options.appid,
                        timeStamp: utils.createTimestamp(),
                        nonceStr: data.nonce_str,
                        package: "prepay_id=" + data.prepay_id,
                        signType: "MD5"
                    };
                    reqparam.paySign = utils.sign(reqparam, this.options.apiKey);
                    resolve(reqparam);
                }).catch(err => {
                    reject(err);
                });
        });


    }

    createMerchantPrepayUrl(param) {
        param.time_stamp = param.time_stamp || utils.createTimestamp();
        param.nonce_str = param.nonce_str || utils.createNonceStr();
        param.appid = this.options.appid;
        param.mch_id = this.options.mch_id;
        param.sign = utils.sign(param, this.options.apiKey);

        var query = Object.keys(param).filter(function (key) {
            return ['sign', 'mch_id', 'product_id', 'appid', 'time_stamp', 'nonce_str'].indexOf(key) >= 0;
        }).map(function (key) {
            return key + "=" + encodeURIComponent(param[key]);
        }).join('&');

        return "weixin://wxpay/bizpayurl?" + query;
    }


    static async checkNotification(xml, apiKey, type = 'payment') {
        try {
            if (type == 'payment') {
                let notification =  await utils.parseXML(xml);
                let dataForSign = Object.assign({}, notification);
                delete dataForSign.sign;
                let signValue = utils.sign(dataForSign, apiKey);
                if (signValue != notification.sign) {
                    return null;
                } else {
                    req.wxmessage = notification;
                    return notification;
                }
            } else {
                let notification = await utils.parseXML(xml);
                let decryptedData = utils.decryptByAes256Cbc(notification.req_info, apiKey);
                let finalData = await utils.parseXML(decryptedData);
                return finalData;
            }
        } catch (error) {
            return error;
        }
        // fn.apply(_this, [notification, req, res, next]);
    }


    static wxCallback(fn, apiKey, type = 'payment') {
        return (req, res, next) => {
            var _this = this;
            res.success = function () { res.end(utils.buildXML({ xml: { return_code: 'SUCCESS' } })); };
            res.fail = function () { res.end(utils.buildXML({ xml: { return_code: 'FAIL' } })); };
            utils.pipe(req, function (err, data) {
                var xml = data.toString('utf8');
                let notification = WechatPayment.checkNotification(notification, apiKey, type);
                 fn.apply(_this, [notification, req, res, next]);
            });
        }
    }



}
