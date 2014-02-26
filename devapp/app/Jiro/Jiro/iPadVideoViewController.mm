//
//  iPadVideoViewController.m
//  Jiro
//
//  Created by James Harnett on 2/22/14.
//  Copyright (c) 2014 James Harnett. All rights reserved.
//

#import "iPadVideoViewController.h"
#import "AFNetworking.h"
#import "AppDelegate.h"

@interface iPadVideoViewController ()

@end

@implementation iPadVideoViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.motionManager = [[CMMotionManager alloc] init];
    self.motionManager.gyroUpdateInterval = 0.1;
    
    [self.motionManager startGyroUpdatesToQueue:[NSOperationQueue currentQueue]
                                    withHandler:^(CMGyroData *gyroData, NSError *error)
     {
         self.xCoordinate += gyroData.rotationRate.x * 0.1;
         self.yCoordinate += gyroData.rotationRate.y * 0.1;
         self.zCoordinate += gyroData.rotationRate.z * 0.1;
         
         [self missionCompleteTimerRun];
     }];
}

- (void)missionCompleteTimerRun
{
    NSNumber *handXCoordinate = [NSNumber numberWithDouble:self.xCoordinate];
    NSNumber *handYCoordinate = [NSNumber numberWithDouble:self.yCoordinate];
    NSNumber *handZCoordinate = [NSNumber numberWithDouble:self.zCoordinate];
    
    NSString *handXCoordinateString = [NSString stringWithFormat:@"%f", self.xCoordinate];
    NSString *handYCoordinateString = [NSString stringWithFormat:@"%f", self.yCoordinate];
    NSString *handZCoordinateString = [NSString stringWithFormat:@"%f", self.zCoordinate];
    
    xCoordinateLabel.text = [NSString stringWithFormat:@"X: %@", handXCoordinateString];
    yCoordinateLabel.text = [NSString stringWithFormat:@"Y: %@", handYCoordinateString];
    zCoordinateLabel.text = [NSString stringWithFormat:@"Z: %@", handZCoordinateString];
    
    AppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    NSDictionary *data = @{@"x": handXCoordinate, @"y": handYCoordinate, @"z": handZCoordinate};
    NSDictionary *hand = @{@"identifier": delegate.identifierCode, @"data": data};
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    [manager.requestSerializer setValue:@"content-type" forHTTPHeaderField:@"application/json"];
    [manager POST:@"http://meetjiro.appspot.com/jirohandle/devices/senddata" parameters:hand success:^(AFHTTPRequestOperation *operation, id responseObject)
     {
//         NSLog(@"Sent Data Successfully");
     }
     
          failure:^(AFHTTPRequestOperation *operation, NSError *error)
     
     {
         NSLog(@"Error: %@", error);
     }];
}

// mission complete timer
- (void)missionCompleteSetTimer
{
    missionCompleteTimer = [NSTimer scheduledTimerWithTimeInterval:0.1 target:self selector:@selector(missionCompleteTimerRun) userInfo:nil repeats:YES];
}

@end
