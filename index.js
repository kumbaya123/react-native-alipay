import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import { EventEmitter } from 'events';

const AlipayModul = NativeModules.AlipayModule;

const emitter = new EventEmitter();
DeviceEventEmitter.addListener('Alipay_Resp', resp => {
  emitter.emit('Alipay.Resp', resp);
});

export default class AlipayModule {
  static aliPayAction(payStr) {
    //payStr为从后台获取的支付字符串
    return new Promise((resolve, reject) => {
      AlipayModul.pay(payStr).then((data) => {
        let resultDic = {
          resultStatus: 0,
          content: null,
        };
        if (Platform.OS === 'ios') {
          reject(resultDic)
        } else {
          let dataJson = JSON.parse(data)
          let resultStatus = dataJson.resultStatus
          let content = ''

          if (resultStatus === '9000') {
            content = JSON.stringify(dataJson.result)
          } else if (resultStatus === '8000' || resultStatus === '6004') {
            content = '支付处理中，支付结果以支付宝是否扣费成功为准';
          } else if (resultStatus === '4000') {
            content = '订单支付失败';
          } else if (resultStatus === '5000') {
            content = '重复请求';
          } else if (resultStatus === '6001') {
            content = '用户取消';
          } else if (resultStatus === '6002') {
            content = '网络连接出错';
          } else {
            content = '其它支付错误';
          }
          resultDic.content = content

          resolve({ resultStatus, content, data: resultDic })
        }
        // resolve(resultDic)
      }).catch((err) => {
        // console.log('err-index = ', err)
        reject(err)
      });
      if (Platform.OS === 'ios')
        // iOS 监听支付返回结果
        emitter.once('Alipay.Resp', resp => {
          let resultDic = {
            resultStatus: 0,
            content: null,
          };
          let resultStatus = resp.resultStatus
          let content = ''
          if (resultStatus === '9000') {
            content = resp.result
          } else if (resultStatus === '8000' || resultStatus === '6004') {
            content = '支付处理中，支付结果以支付宝是否扣费成功为准';
          } else if (resultStatus === '4000') {
            content = '订单支付失败';
          } else if (resultStatus === '5000') {
            content = '重复请求';
          } else if (resultStatus === '6001') {
            content = '用户取消';
          } else if (resultStatus === '6002') {
            content = '网络连接出错';
          } else {
            content = '其它支付错误';
          }
          resultDic.resultStatus = resp.resultStatus
          resultDic.content = content
          resolve({ resultStatus, content, data: resultDic })
        });
    })
  }
};
