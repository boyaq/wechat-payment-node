
var xml2js = require('xml2js');
var crypto = require('crypto');

var utils = {
    md5: function(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    },

    sign: function(object, key) {
        var querystring = utils.createQueryString(object);
        if(key) querystring += "&key=" + key;

        return utils.md5(querystring).toUpperCase();
    },

    createNonceStr: function() {
        return Math.random().toString(36).substr(2, 15);
    },

    createTimestamp: function() {
        return parseInt(new Date().getTime() / 1000) + '';
    },

    createQueryString: function(options) {
        return Object.keys(options).filter(function(key){
            return options[key] !== undefined && options[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key) < 0;
        }).sort().map(function(key){
            return key + '=' + options[key];
        }).join("&");
    },

    buildXML: function(json) {
    	var builder = new xml2js.Builder();
    	return builder.buildObject(json);
    },

    parseXML: function(xml, fn) {
    	var parser = new xml2js.Parser({ trim: true, explicitArray: false, explicitRoot: false });
    	parser.parseString(xml, fn || function(err, result){});
    },

    parseRaw: function() {
    	return function(req, res, next){
    		var buffer = [];
    		req.on('data', function(trunk){
    			buffer.push(trunk);
    		});
    		req.on('end', function(){
    			req.rawbody = Buffer.concat(buffer).toString('utf8');
    			next();
    		});
    		req.on('error', function(err){
    			next(err);
    		});
    	}
    },

    pipe: function(stream, fn){
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

module.exports = utils;
