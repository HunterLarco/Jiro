//
//  TPKeyboardAvoidingTableView.h
//
//  Created by Michael Tyson on 09/30/2013.
//  Copyright 2013 A Tasty Pixel. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UIScrollView+TPKeyboardAvoidingAdditions.h"

@interface TPKeyboardAvoidingTableView : UITableView <UITextFieldDelegate, UITextViewDelegate>

- (BOOL)focusNextTextField;
- (void)scrollToActiveTextField;

@end
