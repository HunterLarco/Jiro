from google.appengine.ext import db
from ..API import response
import functools
import Hash
import LatLon
import channel
from ShardCounter import Counter
from google.appengine.api import memcache
from google.appengine.api import taskqueue
import time
from google.appengine.ext import deferred



class Host:
  @classmethod
  def create(self):
    Counter.increment('hostcounter')
    identifier = Hash.sha256(str(Counter.getValue('hostcounter')))
    return response.reply({
      'identifier': identifier,
      'socket_token': channel.create(identifier)
    })
  
  
  # radius is in miles
  @classmethod
  @functools.validate
  def getNearbyDevices(self, Webapp2Instance, radius=None, model=None):
    output = []
    latlon = LatLon.getCurrentPosition(Webapp2Instance)
    devices = Mobile.all()
    if model:
      devices = devices.filter('model =', model)
    for device in devices:
      distance = LatLon.getDistance(latlon, {
        'lat': device.lat,
        'lon': device.lon
      })
      if radius==None or distance<=radius:
        output.append({
          'identifier': device.identifier,
          'distance': distance,
          'name': device.name,
          'model': device.model
        })
    return response.reply({
      'devices': output
    })
  
  
  @classmethod
  @functools.validate
  def disconnect(self, identifier):
    query = Mobile.all().filter('hosts =', identifier)
    for device in query:
      device.hosts.remove(identifier)
      device.put()


  @classmethod
  @functools.validate
  def disconnectDevice(self, identifier, device):
    device = Mobile.all().filter('identifier =', device).get()
    if device == None:
      return response.throw(3, identifier)
    device.hosts.remove(identifier)
    device.put()
  
  
  
  ### PURPOSE:
  # used in '__updateMobileConnections__' to write to a device's host list. Used to avert concurrent request problems
  @classmethod
  def __writeHostList__(self, identifier):
    device = Mobile.all().filter('identifier =', identifier).get()
    from json import loads
    hostids = memcache.get(device.identifier, namespace='hostidentifiers')
    hostids = loads(hostids) if hostids else []
    memcache.delete(device.identifier, namespace='hostidentifiers')
    if not device.hosts:
      device.hosts = []
    device.hosts = list(set(hostids+device.hosts))# removes duplicates
    if len(device.hosts) > 0:
      device.put()
  
  ### PURPOSE
  # updates the host list of a mobile database entry
  @classmethod
  def __updateMobileConnections__(self, mobileidentifier):
    hostids = memcache.get(mobileidentifier, namespace='hostidentifiers')
    from json import loads
    hostids = loads(hostids) if hostids else []
    if len(hostids) == 0:
      return
    
    interval_num = int(time.getCurrentTime() / 5)# the amount of times that the interval (5 seconds) has occured since the epoch
    task_name = '-'.join([self.__name__, mobileidentifier, str(interval_num)])
    
    try:
      deferred.defer(self.__writeHostList__, mobileidentifier, _name=task_name)
    except (taskqueue.TaskAlreadyExistsError, taskqueue.TombstonedTaskError):
      pass
  
  
  ### PURPOSE
  # connects a mobile device to a host
  @classmethod
  @functools.validate
  def connectTo(self, hostid, identifier, pin):
    device = Mobile.all().filter('identifier =', identifier).get()
    if device == None:
      return response.throw(3, identifier)
    if device.pin != pin:
      return response.throw(4)
      
    from json import loads, dumps
    identifiers = memcache.get(identifier, namespace='hostidentifiers')
    identifiers = loads(identifiers) if identifiers else []
    identifiers.append(hostid)
    memcache.set(identifier, dumps(identifiers), namespace='hostidentifiers')
    
    self.__updateMobileConnections__(identifier)










class Mobile(db.Model):
  lat = db.FloatProperty(indexed=False)
  lon = db.FloatProperty(indexed=False)
  name = db.StringProperty(indexed=False)
  model = db.StringProperty(indexed=True)
  pin = db.StringProperty(indexed=False)
  hosts = db.StringListProperty(indexed=True)# the computer this device controls
  identifier = db.StringProperty(indexed=True)
  
  
  
  @classmethod
  @functools.validate
  def sendDataTo(self, identifier, data):
    device = self.all().filter('identifier =', identifier).get()
    if device == None:
      return response.throw(3, identifier)
    if device.hosts == None:
      return response.reply({
        'sent': False
      })
    Host.__updateMobileConnections__(identifier)# makes sure that all mobile connections are accounted for
    for host in device.hosts:
      channel.send(host, {
        'identifier': identifier,
        'data': data
      })
    return response.reply({
      'sent': True
    })
      
  
  
  ### PURPOSE
  # Creates a new user
  ### RETURNS
  # a response object
  # or returns the user object created in a response "object" if called by a subclass
  @classmethod
  @functools.validate
  def create(self, Webapp2Instance, name, model, pin):
    user = self()
    
    latlon = LatLon.getCurrentPosition(Webapp2Instance)
    user.lat = latlon['lat']
    user.lon = latlon['lon']
    
    user.name = name
    user.model = model
    user.pin = pin
    
    Counter.increment('mobilecounter')
    user.identifier = Hash.sha256(str(Counter.getValue('mobilecounter')))
    
    user.put()
    
    return response.reply({
      'identifier': user.identifier
    })


  ### Purpose
  # Deletes a user
  ### RETURNS
  # a response "object"
  @classmethod
  @functools.validate
  def delete(self, identifier):
    user = self.all().filter('identifier =', identifier).get()
    if user == None:
      return response.throw(2, dataStruct=(identifier))
    user.delete()