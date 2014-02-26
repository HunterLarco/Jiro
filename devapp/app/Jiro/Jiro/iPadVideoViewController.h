//
//  iPadVideoViewController.h
//  Jiro
//
//  Created by James Harnett on 2/22/14.
//  Copyright (c) 2014 James Harnett. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreMotion/CoreMotion.h>

@interface iPadVideoViewController : UIViewController

{
    IBOutlet UILabel *xCoordinateLabel;
    IBOutlet UILabel *yCoordinateLabel;
    IBOutlet UILabel *zCoordinateLabel;
    
    NSTimer *missionCompleteTimer;
    int missionCompleteCount;
}

@property (strong, nonatomic) CMMotionManager *motionManager;
@property (assign, nonatomic) double xCoordinate;
@property (assign, nonatomic) double yCoordinate;
@property (assign, nonatomic) double zCoordinate;

@end
