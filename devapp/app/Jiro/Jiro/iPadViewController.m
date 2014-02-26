//
//  iPadViewController.m
//  Jiro
//
//  Created by James Harnett on 2/22/14.
//  Copyright (c) 2014 James Harnett. All rights reserved.
//

#import "iPadViewController.h"
#import "AFNetworking.h"
#import "AppDelegate.h"

@interface iPadViewController ()

@end

@implementation iPadViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    AppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    passwordLabel.text = delegate.pinCode;
}

- (IBAction)startButton
{
    // no code required..
    // sending the user to the iPadCalibrationViewController view
}

@end
