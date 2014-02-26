import endpoints
from protorpc import remote

from Jiro import *






package = 'JiroAPI'








@endpoints.api(
  name='jiro',
  version='v0.0.0'
)
class JiroAPI(remote.Service):
    """Jiro API v0.0.0"""


    # @endpoints.method(params_object, returned_object, path, method, API_name)
    @endpoints.method(API.Requests.Void, API.Responses.AccessToken,
                      path='connect/host', http_method='GET',
                      name='connect.host')
    def ConnectHost(self, unused_request):
      return System.Host.create()



    @endpoints.method(API.Requests.DeviceConnection, API.Responses.AccessToken,
                      path='connect/device', http_method='POST',
                      name='connect.device')
    def DeviceConnection(self, request):
      return System.Device.create(request.name, request.model, request.pin)
    
        # 
    # 
    # @endpoints.method(API.Requests.LocateDevices, API.Responses.DeviceList,
    #                   path='devices/locate', http_method='POST',
    #                   name='devices.locate')
    # def LocateDevices(self, request):
    #   device = System.Device.create(request.name, request.model, request.pin)
    #   return API.Responses.Device(
    #     access_token=device.privatekey,
    #     stat='ok'
    #   )







APPLICATION = endpoints.api_server([JiroAPI])