#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import <AlipaySDK/AlipaySDK.h>

@interface AlipayModule : NSObject <RCTBridgeModule>

+(void) handleCallback:(NSURL *)url;

@end
