//
//  ViewController.m
//  Jiro
//
//  Created by James Harnett on 2/22/14.
//  Copyright (c) 2014 James Harnett. All rights reserved.
//

#import "ViewController.h"
#import "AFNetworking.h"
#import "AppDelegate.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    AppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    passwordLabel.text = delegate.pinCode;
}

- (IBAction)startButton
{
    // no code required..
    // sending the user to the CalibrationViewController view
}

@end
