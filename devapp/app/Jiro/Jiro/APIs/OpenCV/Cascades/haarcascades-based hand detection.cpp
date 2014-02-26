//#import <opencv2/cv.h>
//#import <opencv2/highgui/highgui.hpp>
//#include <iostream>
//#include <stdio.h>
//#include <math.h>
//#include <string.h>
//#include <conio.h>
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
//CvCapture *capture;
//IplImage *frame;
//
//char *filename = "1256617233-1-haarcascade-hand.xml";
//cascade = ( CvHaarClassifierCascade* )cvLoad( "1256617233-2-haarcascade-hand.xml", 0, 0, 0 );
//
//hstorage = cvCreateMemStorage( 0 );
//cstorage = cvCreateMemStorage( 0 );
//
//capture = cvCaptureFromCAM( 0 );
//
//cvNamedWindow( "camerawin", 1 );
//
//while(key!='q') {
//    frame = cvQueryFrame( capture );
//    if( !frame ) break;
//
//    detectObjects (frame );
//
//    key = cvWaitKey( 10 );
//}
//
//cvReleaseCapture( &capture );
//cvDestroyAllWindows();
//cvReleaseHaarClassifierCascade( &cascade );
//cvReleaseMemStorage( &cstorage );
//cvReleaseMemStorage( &hstorage );
//
//return 0;
//}
//
//void detectObjects( IplImage *img )
//{
//int px;
//int py;
//int edge_thresh = 1;
//IplImage *gray = cvCreateImage( cvSize(img->width,img->height), 8, 1);
//IplImage *edge = cvCreateImage( cvSize(img->width,img->height), 8, 1);
//
//cvCvtColor(img,gray,CV_BGR2GRAY);                       
//
//gray->origin=1;                         
//
//cvThreshold(gray,gray,100,255,CV_THRESH_BINARY);    
//
//cvSmooth(gray, gray, CV_GAUSSIAN, 11, 11);
//
//cvCanny(gray, edge, (float)edge_thresh, (float)edge_thresh*3, 5); 
//
//CvSeq *hand = cvHaarDetectObjects(img, cascade, hstorage, 1.2, 2, CV_HAAR_DO_CANNY_PRUNING, cvSize(100, 100));
//    
//CvRect *r = ( CvRect* )cvGetSeqElem( hand, 0 );
//cvRectangle( img,
//    cvPoint( r->x, r->y ),
//    cvPoint( r->x + r->width, r->y + r->height ),
//    CV_RGB( 255, 0, 0 ), 1, 8, 0 );
//
//cvShowImage("camerawin",img);
//}
