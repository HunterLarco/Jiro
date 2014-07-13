from google.appengine.ext import db
from google.appengine.api import memcache
import time
from google.appengine.ext import deferred
from google.appengine.api import taskqueue



### PURPOSE
# Creates a counter that will not be affected by large scale use at the same time.
### PROCEDURE
# This increments a memcache entry containing the count, and then attempts to save that count in the datastore.
# If it is already being stored currently, it simply waits and then updates later with the next incrimentation.
# This is possible by the deferred module which acts as a threading module.
class Counter(db.Model):
  count = db.IntegerProperty(required=True, default=0)


  ### PURPOSE
  # returns the value of a counter by its name ('name')
  @classmethod
  def getValue(self, name):
    counter = self.get_by_key_name(name)
    count = counter.count if counter else 0
    memcache_value = memcache.get(name, self.kind())
    count += memcache_value if memcache_value else 0
    return count
  
  
  ### Purpose
  # increment the counter by name
  @classmethod
  def increment(self, name, interval=5, value=1):
    """Increments the named counter.

    Args:
      name: The name of the counter.
      interval: How frequently to flush the counter to disk.
      value: The value to increment by.
    """
    memcache.incr(name, value, self.kind(), 0)
    interval_num = int(time.getCurrentTime() / interval)# the amount of times that the interval has occured since the epoch
    task_name = '-'.join([self.kind(), name, str(interval), str(interval_num)])
    try:
      deferred.defer(self.flushMemcache, name, _name=task_name)
    except (taskqueue.TaskAlreadyExistsError, taskqueue.TombstonedTaskError):
      pass
  
  
  ### Purpose
  # flush the memcache and update the datastore
  @classmethod
  def flushMemcache(self, name):
    # get the counter based on the name, create a new one based on the name if it doesn't exist
    counter = self.get_or_insert(name)
    # Get the current value
    value = memcache.get(name, self.kind())
    # Store it to the counter
    counter.count += value if value else 0
    counter.put()
    # Subtract it from the memcached value
    if value:
      memcache.decr(name, value, self.kind())