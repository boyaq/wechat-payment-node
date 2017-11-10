import xml2js from 'xml2js';
import MD5 from 'md5';
import jsSHA from 'jssha';
import crypto from 'crypto';
import { Buffer } from 'safe-buffer';
import fs from 'fs';

export default class utils {
    static sign(object, key) {
        var querystring = utils.createQueryString(object);
        if (key) querystring += "&key=" + key;
        console.log(querystring, 'hahahahahahh');
        return MD5(querystring).toUpperCase();
    }


    static shaSign(object) {
        var querystring = utils.createQueryString(object);

        let shaObj = new jsSHA("SHA-1", 'TEXT');
        shaObj.update(querystring);
        return shaObj.getHash('HEX');
    }

    static createNonceStr(length) {
        length = length || 24;
        if (length > 32) length = 32;
        let randomStr = Math.random().toString(36);
        let randomStr2 = Math.random().toString(36);
        let nonceStr = (randomStr + randomStr2).substr(0, length);
        return nonceStr;
    }

    static createTimestamp() {
        return parseInt(new Date().getTime() / 1000) + '';
    }

    static createQueryString(options) {
        return Object.keys(options).filter(function (key) {
            return options[key] !== undefined && options[key] !== '' && ['pfx', 'apiKey', 'sign', 'key'].indexOf(key) < 0;
        }).sort().map(function (key) {
            return key + '=' + options[key];
        }).join("&");
    }

    static buildXML(json) {
        var builder = new xml2js.Builder();
        return builder.buildObject(json);
    }

    static parseXML(xml, fn) {
        return new Promise((resolve, reject) => {
            let parser = new xml2js.Parser({ trim: true, explicitArray: false, explicitRoot: false });
            parser.parseString(xml, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }

            });
        });


    }

    static parseRaw() {
        return function (req, res, next) {
            var buffer = [];
            req.on('data', function (trunk) {
                buffer.push(trunk);
            });
            req.on('end', function () {
                req.rawbody = Buffer.concat(buffer).toString('utf8');
                next();
            });
            req.on('error', function (err) {
                next(err);
            });
        }
    }

    static pipe(stream, fn) {
        var buffers = [];
        stream.on('data', function (trunk) {
            buffers.push(trunk);
        });
        stream.on('end', function () {
            fn(null, Buffer.concat(buffers));
        });
        stream.once('error', fn);
    }



    static buildQueryStringWithoutEncode(obj) {
        return obj ? Object.keys(obj).sort().map(function (key) {
            var val = obj[key];
            key = key.toLowerCase();
            if (Array.isArray(val)) {
                return val.sort().map(function (val2) {
                    return key + '=' + val2;
                }).join('&');
            }
            return key + '=' + val;
        }).join('&') : '';
    }

    static decryptByAes256Cbc(encryptdata, cryptkey) {
        encryptdata = new Buffer(encryptdata, 'base64').toString('hex');
        var dec, decipher;
        decipher = crypto.createDecipheriv('aes-256-ecb', MD5(cryptkey).toLowerCase(), '');
        dec = decipher.update(encryptdata, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }

}