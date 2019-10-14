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
        } else if (Platform.OS === 'android') {

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

      }).catch((err) => {
        // console.log('err-index = ', err)
        reject(err)
      });
    })

  }
};