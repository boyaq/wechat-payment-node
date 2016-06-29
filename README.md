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
创建统一支付订单, SPEC: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1

```javascript
wxPayment.createUnifiedOrder({
  body: '支付测试', // 商品或支付单简要描述
  out_trade_no: 'order1', // 商户系统内部的订单号,32个字符内、可包含字母
  total_fee: 100,
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
接收微信的回调， 对应上面的`notify_url`

```javascript
// 支付结果异步通知
router.use('/wxpayment/notify', wxPayment.wxCallback(function(msg, req, res, next){
  // 处理商户业务逻辑

  // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
  res.success();
}));
```

### Query Order
查询订单， SPEC: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_2

```javascript
wxPayment.queryOrder({
  out_trade_no: 'order1'
}, function(err, result){
  console.log(result);
});
```
or

```javascript
wxPayment.queryOrder({
  transaction_id: '12222'
}, function(err, result){
  console.log(result);
});
```

`out_trade_no` 和 `transaction_id` 二选一


### Close Order
关闭订单， SPEC: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_3

```javascript
wxPayment.closeOrder({
	out_trade_no: 'order1'
}, function(err, result){
	console.log(result);
});
```

### Refund
申请退款， SPEC: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_4

```javascript
wxPayment.refund({
  out_trade_no: 'order1',
  out_refund_no: 'refund1',
  total_fee: 100,
  refund_fee: 100,
  op_user_id: '1234567890',
}, function(err, result){
  console.log(result);
});
```
or

```javascript
wxPayment.refund({
  transaction_id: '1',
  out_refund_no: 'refund1',
  total_fee: 100,
  refund_fee: 100,
  op_user_id: '1234567890',
}, function(err, result){
  console.log(result);
});
```

`out_trade_no` 和 `transaction_id` 二选一


### Query Refund
申请退款， SPEC: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_5

```javascript
wxPayment.queryRefund({
	out_trade_no: 'order1',
}, function(err, result){
	console.log(result);
});
```
`out_trade_no` 也可以使用以下代替： `transaction_id`, `out_refund_no`, `refund_id`


### Transfers
企业付款是基于微信支付商户平台的资金管理能力，为了协助商户方便地实现企业向个人付款，针对部分有开发能力的商户，提供通过API完成企业付款的功能。
SPEC: https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_2

接口调用规则：            
◆ 给同一个实名用户付款，单笔单日限额2W/2W          
◆ 给同一个非实名用户付款，单笔单日限额2000/2000           
◆ 一个商户同一日付款总额限额100W           
◆ 单笔最小金额默认为1元            
◆ 每个用户每天最多可付款10次，可以在商户平台--API安全进行设置           
◆ 给同一个用户付款时间间隔不得低于15秒          


```javascript
wxPayment.transfers({
  partner_trade_no: 'transferOrder1', //商户订单号，需保持唯一性
  openid: 'xxxxxxxx',
  check_name: 'OPTION_CHECK',
  re_user_name: '马化腾',
  amount: 100,
  desc: '红包',
  spbill_create_ip: '192.168.0.1'
}, function(err, result){
  console.log(result);
});
```


### Query Transfer Info
查询付款信息， SPEC: https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_3

```javascript
wxPayment.queryTransferInfo({
	partner_trade_no: 'transferOrder1' //商户订单号，需保持唯一性
}, function(err, result){
	console.log(result);
});
```
