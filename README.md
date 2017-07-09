# Wechat Payment  (Node.js)    
Wechat Payment API for Node.js

微信支付 API for Node.js

Please Reference Wechat payment docs carefully before using this package.
Wormhole：[wechat payment docs](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=1_1), [enterprice version (transfers、withdraw)](https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_1)

使用之前一定要读懂微信支付的文档, 传送门：[微信支付](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=1_1), [企业付款 (转账、提现)](https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_1)


包含以下API：  
* 创建统一支付订单
* 查询订单
* 关闭订单
* 申请退款
* 查询退款详情
* 企业付款，即转账到个人微信钱包
* 查询企业付款详情

##  Usage

### Initialize
配置，初始化; 在调用其他接口前必须先初始化！

```javascript
import WechatPayment from 'wechat-payment-node';
let options = {
  appid: 'your app id',
  mch_id: 'your merchant id',
  apiKey: 'your app key (partner key)', //微信商户平台API密钥
  notify_url: 'your notify url',
  trade_type: 'APP', //APP, JSAPI, NATIVE etc.
  pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
};
let wechatPaymentInstance = new WechatPayment(options);
```

### Create Unified Order
创建统一支付订单, [SPEC](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1)

```javascript
let orderData = {
  body: '支付测试', // 商品或支付单简要描述
  out_trade_no: 'order1', // 商户系统内部的订单号,32个字符内、可包含字母
  total_fee: 100,
  spbill_create_ip: '192.168.2.1',
  notify_url: 'http://wxpayment_notify_url',
  trade_type: 'JSAPI'
};

 wechatPaymentInstance.createUnifiedOrder(orderData)
 .then(result=>{
   console.log(result);
 })
 .catch(err=>{
   console.log(err);
 });
```

result 示例:
```javascript
{
  return_code: 'SUCCESS',
  return_msg: 'OK',
  appid: 'your app id',
  mch_id: 'your merchantt id',
  nonce_str: 'GPAwjlqZmkl04dCH',
  sign: 'E9970AC7C2F2890BD6CA5C36F78B6921',
  result_code: 'SUCCESS',
  prepay_id: 'wx20160701104002e0af0b0dbf0031984704',
  trade_type: 'JSAPI'
}
```


### WeChat Callbacks
接收微信的回调， 对应上面的`notify_url`

```javascript
// 支付结果异步通知
router.use('/wechat/payment/notify', wechatPaymentInstance.wxCallback(function(notification, req, res, next){
  // 处理商户业务逻辑

  // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
  res.success();
}));
```

### Query Order
查询订单， [SPEC](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_2)

```javascript
wechatPaymentInstance.queryOrder({
  out_trade_no: 'order1'
})
.then(result=>{
  console.log(result);
})
.catch(err=>{
  console.log(err);
})

```
or

```javascript
wechatPaymentInstance.queryOrder({
  transaction_id: '12222'
})
.then(result=>{
  console.log(result);
})
.catch(err=>{
  console.log(err);
})
```

`out_trade_no` 和 `transaction_id` 二选一


result 示例:
```javascript
{
  return_code: 'SUCCESS',
  return_msg: 'OK',
  appid: 'your app id',
  mch_id: 'your merchant id',
  nonce_str: 'P6IFNTlKWVKtlOH4',
  sign: 'B3348E5BCB4FC7C7C5D1D7445023A9A0',
  result_code: 'SUCCESS',
  out_trade_no: 'ordertest003',
  trade_state: 'NOTPAY',
  trade_state_desc: '订单未支付'
}
```


### Close Order
关闭订单， [SPEC](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_3)

```javascript
wechatPaymentInstance.closeOrder({
  out_trade_no: 'order1'
})
.then(result=>{
  console.log(result);
})
.catch(err=>{
  console.log(err);
})
```

result 示例:
```javascript
{
  return_code: 'SUCCESS',
  return_msg: 'OK',
  appid: 'your wechat id',
  mch_id: 'your merchant id',
  nonce_str: 'qlJrwWF8E0M5tHyh',
  sign: '5E44DB01443506897D8CC7AA1C67BB0F',
  result_code: 'SUCCESS'
}
```

### Refund
申请退款， [SPEC](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_4)

```javascript
let orderData = {
  out_trade_no: 'order1',
  out_refund_no: 'refund1',
  total_fee: 100,
  refund_fee: 100,
  op_user_id: '1234567890',
};
wechatPaymentInstance.refund({
  out_trade_no: 'order1'
})
.then(result=>{
  console.log(result);
})
.catch(err=>{
  console.log(err);
});
```
or

```javascript
let orderData = {
  transaction_id: '1',
  out_refund_no: 'refund1',
  total_fee: 100,
  refund_fee: 100,
  op_user_id: '1234567890',
};
wechatPaymentInstance.refund({
  out_trade_no: 'order1'
})
.then(result=>{
  console.log(result);
})
.catch(err=>{
  console.log(err);
});
```

`out_trade_no` 和 `transaction_id` 二选一

```javascript
{
  return_code: 'SUCCESS',
  return_msg: 'OK',
  appid: 'your app id',
  mch_id: 'your merchant id',
  nonce_str: 'DFYEiS63BBNbwr9Y',
  sign: '9826704D76452E728B19C26BB7A81666',
  result_code: 'SUCCESS',
  transaction_id: '4001812001201606288028146396',
  out_trade_no: '5772427d816dfa0055f5b7c9',
  out_refund_no: 'refund5772427d816dfa0055f5b7c9',
  refund_id: '2001812001201607010302081102',
  refund_channel: '',
  refund_fee: '1',
  coupon_refund_fee: '0',
  total_fee: '1',
  cash_fee: '1',
  coupon_refund_count: '0',
  cash_refund_fee: '1'
}
```


### Query Refund
查询退款详情， [SPEC](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_5)

```javascript
wechatPaymentInstance.queryRefund({
  out_trade_no: 'order1'
})
.then(result=>{
  console.log(result);
})
.catch(err=>{
  console.log(err);
});
```
`out_trade_no` 也可以使用以下代替： `transaction_id`, `out_refund_no`, `refund_id`

```javascript
{
  appid: 'your app id',
  cash_fee: '1',
  mch_id: '1329105201',
  nonce_str: '9cMaFrdWbYMaYyZi',
  out_refund_no_0: 'refund5772427d816dfa0055f5b7c9',
  out_trade_no: '5772427d816dfa0055f5b7c9',
  refund_channel_0: 'ORIGINAL',
  refund_count: '1',
  refund_fee: '1',
  refund_fee_0: '1',
  refund_id_0: '2001812001201607010302081102',
  refund_recv_accout_0: '支付用户的零钱',
  refund_status_0: 'SUCCESS',
  result_code: 'SUCCESS',
  return_code: 'SUCCESS',
  return_msg: 'OK',
  sign: 'A444F580BDD2D8306187D9AF14091B5C',
  total_fee: '1',
  transaction_id: '4001812001201606288028146396'
}
```


### Transfers
企业付款是基于微信支付商户平台的资金管理能力，为了协助商户方便地实现企业向个人付款，针对部分有开发能力的商户，提供通过API完成企业付款的功能。[SPEC](https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_2)

接口调用规则：            
◆ 给同一个实名用户付款，单笔单日限额2W/2W          
◆ 给同一个非实名用户付款，单笔单日限额2000/2000           
◆ 一个商户同一日付款总额限额100W           
◆ 单笔最小金额默认为1元            
◆ 每个用户每天最多可付款10次，可以在商户平台--API安全进行设置           
◆ 给同一个用户付款时间间隔不得低于15秒          


```javascript
let orderData = {
  partner_trade_no: 'transferOrder1', //商户订单号，需保持唯一性
  openid: 'open id',
  check_name: 'OPTION_CHECK',
  re_user_name: 'Mr Ma',
  amount: 100,
  desc: '红包',
  spbill_create_ip: '192.168.0.1'
}
wechatPaymentInstance.transfers(orderData)
.then(result=>{
  console.log(result);
})
.catch(err=>{
  console.log(err);
});
```

result 示例:
```javascript
{
  return_code: 'SUCCESS',
  return_msg: '',
  mch_appid: 'app id',
  mchid: 'merchant id',
  device_info: '',
  nonce_str: 'x5pzs6q95pkchaorbsn6o8ic',
  result_code: 'SUCCESS',
  partner_trade_no: 'testTransferOrder10',
  payment_no: '1000018301201607010763072544',
  payment_time: '2016-07-01 10:44:55'
}
```

### Query Transfer Info
查询付款详情， [SPEC](https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_3)

```javascript
wechatPaymentInstance.transfers({
	partner_trade_no: 'transferOrder1' //商户订单号，需保持唯一性
})
.then(result=>{
  console.log(result);
})
.catch(err=>{
  console.log(err);
});
```

result 示例:
```javascript
{
  return_code: 'SUCCESS',
  result_code: 'SUCCESS',
  partner_trade_no: 'testTransferOrder10',
  mch_id: 'merchant id',
  detail_id: '1000018301201607010763072544',
  status: 'SUCCESS',
  openid: 'open id',
  payment_amount: '100',
  transfer_time: '2016-07-01 10:44:55',
  desc: '红包',
  return_msg: '获取成功'
}
```

[更多问题请提交ISSUE](https://github.com/OtkurBiz/wechat-payment-node/issues)
