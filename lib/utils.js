
var xml2js = require('xml2js');
var MD5 = require('md5');

var utils = {
    sign: function(object, key) {
        var querystring = utils.createQueryString(object);
        if(key) querystring += "&key=" + key;

        return MD5(querystring).toUpperCase();
    },

    createNonceStr: function(length) {
        length = length || 24;
        if(length > 32) length = 32;

        return (Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)).substr(0, length);
    },

    createTimestamp: function() {
        return parseInt(new Date().getTime() / 1000) + '';
    },

    createQueryString: function(options) {
        return Object.keys(options).filter(function(key){
            return options[key] !== undefined && options[key] !== '' && ['pfx', 'apiKey', 'sign', 'key'].indexOf(key) < 0;
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
