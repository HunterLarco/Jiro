//
//  AppDelegate.m
//  Jiro
//
//  Created by James Harnett on 2/22/14.
//  Copyright (c) 2014 James Harnett. All rights reserved.
//

#import "AppDelegate.h"
#import "AFNetworking.h"
#import "ViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    int pin1 = arc4random() % 10;
    int pin2 = arc4random() % 10;
    int pin3 = arc4random() % 10;
    int pin4 = arc4random() % 10;
    
    NSString *pin = [NSString stringWithFormat:@"%d%d%d%d", pin1 , pin2, pin3, pin4];
    self.pinCode = pin;
    
    NSString *deviceName = [[UIDevice currentDevice] name];
    NSString *modelName = [[UIDevice currentDevice] model];
    
    NSLog(@"name: %@", deviceName);
    NSLog(@"model: %@", modelName);
    
    // send JSON package w/ deviceName && modelName && pin
    
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    NSDictionary *parameters = @{@"name": deviceName, @"model": modelName, @"pin": pin};
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    [manager.requestSerializer setValue:@"Content-Type" forHTTPHeaderField:@"application/json"];
    [manager POST:@"http://meetjiro.appspot.com/jirohandle/login/mobile" parameters:parameters
     
          success:^(AFHTTPRequestOperation *operation, id responseObject)
     {
         NSLog(@"%@", responseObject[@"identifier"]);
         self.identifierCode = responseObject[@"identifier"];
     }
     
          failure:^(AFHTTPRequestOperation *operation, NSError *error)
     {
         NSLog(@"Error: %@", error);
     }];
    
    return YES;
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    
    AppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    NSDictionary *parameters = @{@"identifier": delegate.identifierCode};
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    [manager.requestSerializer setValue:@"Content-Type" forHTTPHeaderField:@"application/json"];
    [manager POST:@"http://meetjiro.appspot.com/api/login/mobile" parameters:parameters
     
          success:^(AFHTTPRequestOperation *operation, id responseObject)
     {
         NSLog(@"hi");
     }
     
          failure:^(AFHTTPRequestOperation *operation, NSError *error)
     {
         NSLog(@"Error: %@", error);
     }];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground.
}

@end
