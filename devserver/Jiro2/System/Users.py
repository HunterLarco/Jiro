from google.appengine.ext import ndb
from ..API import response
import KeyGen
import channel




class Host(ndb.Model):
  private = ndb.StringProperty(indexed=True)
  public = ndb.StringProperty(indexed=True)
  
  @classmethod
  def create(self):
    """
    
    PURPOSE: creates a new host instance, just contains keys for lookup
    RETURNS: the private key and a socket token
    
    """
    host = Host()
    keys = KeyGen.generate()
    host.private = keys['private']
    host.public = keys['public']
    host.put()
    return {
      'private': keys['private'],
      'socket': channel.create(keys['public'])
    }













class Device(ndb.Model):
  private = ndb.StringProperty(indexed=True)
  public = ndb.StringProperty(indexed=True)
  name = ndb.StringProperty(indexed=False)
  model = ndb.StringProperty(indexed=True)
  pin = ndb.StringProperty(indexed=False)
  
  
  @classmethod
  def create(self, name, model, pin):
    """
    
    PURPOSE: creates a new host instance, just contains keys for lookup
    RETURNS: the private key and a socket token
    
    """
    device = Device()
    keys = KeyGen.generate()
    device.private = keys['private']
    device.public = keys['public']
    device.name = name
    device.model = model
    device.pin = pin
    device.put()
    return {
      'private': keys['private']
    }