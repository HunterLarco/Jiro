//
//  iPadCalibrationViewController.m
//  Jiro
//
//  Created by James Harnett on 2/22/14.
//  Copyright (c) 2014 James Harnett. All rights reserved.
//

#import "iPadCalibrationViewController.h"

@interface iPadCalibrationViewController ()

@end

@implementation iPadCalibrationViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // set to NO after calibration code is setup..
    [ready setEnabled:YES];
    
    self.view.backgroundColor = [UIColor redColor];
    self.view.backgroundColor = [UIColor yellowColor];
    self.view.backgroundColor = [UIColor greenColor];
}

- (IBAction)readyButton
{
    // no code required..
    // sending the user to the iPadVideoViewController view
}

@end
