//
//  iPadViewController.h
//  Jiro
//
//  Created by James Harnett on 2/22/14.
//  Copyright (c) 2014 James Harnett. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface iPadViewController : UIViewController

{
    IBOutlet UILabel *passwordLabel;
    
    IBOutlet UIBarButtonItem *start;
    IBOutlet UIToolbar *toolbar;
}

- (IBAction)startButton;

@end
