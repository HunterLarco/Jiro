from google.appengine.ext import ndb



class Device(ndb.Model):
  lat =         ndb.FloatProperty(indexed=False)
  lon =         ndb.FloatProperty(indexed=False)
  name =        ndb.StringProperty(indexed=False)
  model =       ndb.StringProperty(indexed=True)
  pin =         ndb.StringProperty(indexed=False)
  hosts =       ndb.StringProperty(indexed=True, repeated=True)# the computers that this device controls
  privatekey =  ndb.StringProperty(indexed=True)
  publickey =   ndb.StringProperty(indexed=True)