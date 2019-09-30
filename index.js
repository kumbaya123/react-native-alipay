import { NativeModules, Platform } from 'react-native';
// import { resolve } from 'dns';

const AlipayModul = NativeModules.AlipayModule;

export default class AlipayModule {
  static aliPayAction(payStr) {
    //payStr为从后台获取的支付字符串
    return new Promise((resolve, reject) => {
      AlipayModul.pay(payStr).then((data) => {
        let resultDic = {
          resultStatus: 0,
          content: null,
        };
        // console.log('data = ', data)
        /*笔者iOS端和安卓端返回的支付回调结果数据不一致，可能和支付宝sdk版本有关，
        读者可自行根据返回数据进行相关处理，iOS(RCTAlipay.m)和安卓(AlipayModule)
        可自行选择需要resolve回调判断处理的数据，如只返回resultStatus*/
        if (Platform.OS === 'ios') {
          resultDic.content = data[0];
        } else {
          let dataJson = JSON.parse(data)
          resultDic.resultStatus = dataJson.resultStatus
          resultDic.content = dataJson.result ? dataJson.result : dataJson.memo
        }
        
        resolve(resultDic)
        // if (resultDic.resultStatus == '9000') {
        //   //支付成功
        //   resolve(resultDic)
        // } else {
        //   //支付失败
        //   reject(resultDic)
        // }
      }).catch((err) => {
        // console.log('err-index = ', err)
        reject(err)
      });
    })

  }
};