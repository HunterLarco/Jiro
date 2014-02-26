//
//  TPKeyboardAvoidingCollectionView.h
//
//  Created by Michael Tyson on 09/30/2013.
//  Copyright 2013 A Tasty Pixel & The CocoaBots. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UIScrollView+TPKeyboardAvoidingAdditions.h"

@interface TPKeyboardAvoidingCollectionView : UICollectionView <UITextFieldDelegate, UITextViewDelegate>

- (BOOL)focusNextTextField;
- (void)scrollToActiveTextField;

@end
