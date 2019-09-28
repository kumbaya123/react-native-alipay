# react-native-alipay

## Getting started

`$ npm install https://github.com/jinyaoye23/react-native-alipay.git --save`

### Mostly automatic installation

`$ react-native link react-native-alipay`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-alipay` and add `AlipayModule.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libAlipayModule.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

##### 自动集成支付宝SDK

`pod 'AlipaySDK-iOS'`

##### 配置返回 url 处理方法

AppDelegate.m 文件中，增加引用代码：

`import <AlipaySDK/AlipaySDK.h>`

将 `@implementation AppDelegate` 中实现处理代码：

```
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
    
    if ([url.host isEqualToString:@"safepay"]) {
        //跳转支付宝钱包进行支付，处理支付结果
        [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
            NSLog(@"result = %@",resultDic);
        }];
    }
    return YES;
}
// NOTE: 9.0以后使用新API接口
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options
{
    if ([url.host isEqualToString:@"safepay"]) {
        //跳转支付宝钱包进行支付，处理支付结果
        [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
            NSLog(@"result = %@",resultDic);
        }];
    }
    return YES;
}
```


支付信息请查看[支付宝iOS集成文档](https://docs.open.alipay.com/204/105295/)

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.reactlibrary.AlipayModulePackage;` to the imports at the top of the file
  - Add `new AlipayModulePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-alipay'
  	project(':react-native-alipay').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-alipay/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-alipay')
  	```


## Usage
```javascript
import AlipayModule from 'react-native-alipay';

// TODO: What to do with the module?
AlipayModule;
```
