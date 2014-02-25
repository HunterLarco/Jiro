# common imports
import response
from .. import System


### within this file, each root class defines what API functions are accessible by POST or GET. that way permission may be changed by simply instruction the API engine to delegate to a different permission map. For example, 'admin' indicates that api url '/api/constants/add' allows one to add a constant to the database, because a user doesn't have this privilage, their permission map lacks this ability. Note that GET requests must use the get dictionary exclusively

# used by all users
class Global:
  
  class login:
    def host(self, payload):
      return System.User.Host.create()
    def mobile(self, payload):
      if not 'pin' in payload or not 'name' in payload or not 'model' in payload:
        return response.throw(24)
      return System.User.Mobile.create(payload['__Webapp2Instance__'], payload['name'], payload['model'], payload['pin'])
    def logout(self, payload):
      if not 'identifier' in payload:
        return response.throw(24)
      return System.User.Mobile.delete(payload['identifier'])
    def hostdisconnect(self, payload):
      if not 'identifier' in payload:
        return response.throw(24)
      return System.User.Host.disconnect(payload['identifier'])
  
  class devices:
    def nearby(self, payload):
      radius = payload['radius'] if 'radius' in payload else None
      model = payload['model'] if 'model' in payload else None
      return System.User.Host.getNearbyDevices(payload['__Webapp2Instance__'], radius=radius, model=model)
    def connect(self, payload):
      if not 'pin' in payload or not 'identifier' in payload or not 'host' in payload:
        return response.throw(24)
      return System.User.Host.connectTo(payload['host'], payload['identifier'], payload['pin'])
    def senddata(self, payload):
      if not 'data' in payload or not 'identifier' in payload:
        return response.throw(24)
      return System.User.Mobile.sendDataTo(payload['identifier'], payload['data'])
    def disconnect(self, payload):
      if not 'identifier' in payload or not 'device' in payload:
        return response.throw(24)
      return System.User.Host.disconnectDevice(payload['identifier'], payload['device'])