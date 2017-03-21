import xml2js from 'xml2js';
import MD5 from 'md5';
import sha1 from 'sha1';

export default class utils {
    static sign(object, key) {
        var querystring = utils.createQueryString(object);
        if (key) querystring += "&key=" + key;
        console.log(querystring, 'hahahahahahh');
        return MD5(querystring).toUpperCase();
    }


    static shaSign(object){
         var querystring = utils.createQueryString(object);
         return sha1(querystring).toLowerCase();
    }

    static createNonceStr(length) {
        length = length || 24;
        if (length > 32) length = 32;

        return (Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)).substr(0, length);
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
}