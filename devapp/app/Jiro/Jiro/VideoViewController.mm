//
//  VideoViewController.m
//  Jiro
//
//  Created by James Harnett on 2/22/14.
//  Copyright (c) 2014 James Harnett. All rights reserved.
//

#import "VideoViewController.h"
#import "AFNetworking.h"
#import "AppDelegate.h"

// START OF C++ CODE

#import <opencv2/opencv.hpp>
#include <iostream>
#include <stdio.h>
#include <math.h>
#include <string.h>
//#include <conio.h>

// END OF C++ CODE
//
//// START OF C++ CODE
//
//using namespace std;
//
//IplImage* img = 0;
//
//CvHaarClassifierCascade *cascade;
//CvMemStorage *cstorage;
//CvMemStorage *hstorage;
//
//void detectObjects( IplImage *img );
//int key;
//
//int create( int argc, char** argv )
//{
//    CvCapture *capture;
//    IplImage *frame;
//    
//    char *filename = "1256617233-1-haarcascade-hand.xml";
//    cascade = ( CvHaarClassifierCascade* )cvLoad( "1256617233-2-haarcascade-hand.xml", 0, 0, 0 );
//    
//    hstorage = cvCreateMemStorage( 0 );
//    cstorage = cvCreateMemStorage( 0 );
//    
//    capture = cvCaptureFromCAM( 0 );
//    
//    cvNamedWindow( "camerawin", 1 );
//    
//    while(key!='q') {
//        frame = cvQueryFrame( capture );
//        if( !frame ) break;
//        
//        detectObjects (frame );
//        
//        key = cvWaitKey( 10 );
//    }
//    
//    cvReleaseCapture( &capture );
//    cvDestroyAllWindows();
//    cvReleaseHaarClassifierCascade( &cascade );
//    cvReleaseMemStorage( &cstorage );
//    cvReleaseMemStorage( &hstorage );
//    
//    return 0;
//}
//
//void detectObjects( IplImage *img )
//{
//    int px;
//    int py;
//    int edge_thresh = 1;
//    IplImage *gray = cvCreateImage( cvSize(img->width,img->height), 8, 1);
//    IplImage *edge = cvCreateImage( cvSize(img->width,img->height), 8, 1);
//    
//    cvCvtColor(img,gray,CV_BGR2GRAY);
//    
//    gray->origin=1;
//    
//    cvThreshold(gray,gray,100,255,CV_THRESH_BINARY);
//    
//    cvSmooth(gray, gray, CV_GAUSSIAN, 11, 11);
//    
//    cvCanny(gray, edge, (float)edge_thresh, (float)edge_thresh*3, 5);
//    
//    CvSeq *hand = cvHaarDetectObjects(img, cascade, hstorage, 1.2, 2, CV_HAAR_DO_CANNY_PRUNING, cvSize(100, 100));
//    
//    CvRect *r = ( CvRect* )cvGetSeqElem( hand, 0 );
//    cvRectangle( img,
//                cvPoint( r->x, r->y ),
//                cvPoint( r->x + r->width, r->y + r->height ),
//                CV_RGB( 255, 0, 0 ), 1, 8, 0 );
//    
//    cvShowImage("camerawin",img);
//}
//
//// END OF C++ CODE

@interface VideoViewController ()

@end

@implementation VideoViewController

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
