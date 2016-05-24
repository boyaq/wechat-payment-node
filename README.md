# Weixin Payment  (Node.js)    
微信支付 API for Node.js


##  Usage

### init
配置，初始化

```javascript
var wxPayment = require('wx-payment');
wxPayment.init({
	appid: 'xxxxxxxx',
	mch_id: '1234567890',
	apiKey: 'xxxxxxxxxxxxxxxxx', //微信商户平台API密钥
	pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
});
```

### Create Unified Order
创建统一支付订单

```javascript
wxPayment.createUnifiedOrder({
	body: '支付测试',
	out_trade_no: '20140703'+Math.random().toString().substr(2, 10),
	total_fee: 1,
	spbill_create_ip: '192.168.2.210',
	notify_url: 'http://wxpayment_notify_url',
	trade_type: 'JSAPI',
	product_id: '1234567890',
    openid: 'xxxxxxxx'
}, function(err, result){
	console.log(result);
});
```


### WeChat Callbacks
接收微信的回调

```javascript
// 支付结果异步通知
router.use('/wxpayment/notify', wxPayment.wxCallback(function(msg, req, res, next){
	// 处理商户业务逻辑

    // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    res.success();
}));
```
