### Purpose
# gets current system time in seconds since the epoch
def getCurrentTime():# returns an int instance
  import datetime
  currentTime = int(datetime.datetime.now().strftime("%s"))
  return currentTime


### Purpose
# gets the time difference from one time to now (seconds). Used to detect if accesskeys have expired, etc.
def getAge(synctime):# synctime is an int instance
  return getCurrentTime()-synctime


### Purpose
# Simple library of times in seconds that are commonly used
class Seconds:
  minute = 60
  hour = minute*60
  day = hour*24
  week = day*7
  month = day*30
  year = month*12