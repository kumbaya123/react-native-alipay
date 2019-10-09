#import "AlipayModule.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTBridge.h>

static RCTPromiseResolveBlock _resolve;
static RCTPromiseRejectBlock _reject;

@implementation AlipayModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(sampleMethod:(NSString *)stringArgument numberParameter:(nonnull NSNumber *)numberArgument callback:(RCTResponseSenderBlock)callback)
{
    // TODO: Implement some actually useful functionality
	callback(@[[NSString stringWithFormat: @"numberArgument: %@ stringArgument: %@", numberArgument, stringArgument]]);
}

RCT_REMAP_METHOD(pay, payInfo:(NSString *)payInfo resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(returnPayResult:) name:@"alipayResult" object:nil];
    _resolve = resolve;
    _reject = reject;
    NSArray *urlTypes = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleURLTypes"];
    NSString *appScheme = @"";
    for (id type in urlTypes) {
        NSArray *urlSchemes = [type objectForKey:@"CFBundleURLSchemes"];
        for (id scheme in urlSchemes) {
            if ([scheme isKindOfClass:[NSString class]]) {
                NSString *value = (NSString *)scheme;
                if ([value hasPrefix:@"alipay"]) {
                    appScheme = value;
                    break;
                }
            }
        }
    }
    
    if ([appScheme isEqualToString:@""]) {
        NSString *error = @"scheme cannot be empty";
        reject(@"10000", error, [NSError errorWithDomain:error code:10000 userInfo:NULL]);
        return;
    }
    
//    NSString *appScheme = @"huadaAlipay";

    
    dispatch_sync(dispatch_get_main_queue(), ^{
        [[AlipaySDK defaultService] payOrder:payInfo fromScheme:appScheme callback:^(NSDictionary *resultDic) {
            [AlipayModule handleResult:resultDic];
        }];
    });

}

-(void) returnPayResult:(NSNotification *)noti{
    NSLog(@"%@", noti);
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"Alipay_Resp" body:noti.userInfo];
}

+(void) handleResult:(NSDictionary *)resultDic
{
    NSString *status = resultDic[@"resultStatus"];
    if ([status integerValue] >= 8000) {
        _resolve(@[resultDic]);
    } else {
        _reject(status, resultDic[@"memo"], [NSError errorWithDomain:resultDic[@"memo"] code:[status integerValue] userInfo:NULL]);
    }
}


@end
