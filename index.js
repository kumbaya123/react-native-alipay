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
          resultDic.resultStatus = dataJson.resultStatus
          resultDic.content = dataJson.result ? JSON.stringify(dataJson.result) : dataJson.memo
          resolve(resultDic)
        }
        // resolve(resultDic)
      }).catch((err) => {
        // console.log('err-index = ', err)
        reject(err)
      });
      // iOS 监听支付返回结果
      emitter.once('Alipay.Resp', resp => {
        let resultDic = {
          resultStatus: 0,
          content: null,
        };
        resultDic.resultStatus = resp.resultStatus
        resultDic.content = resp.result ? resp.result : resp.memo
        resolve(resultDic)
      });
    })
  }
};