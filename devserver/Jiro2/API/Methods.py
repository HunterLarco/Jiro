import response
import inspect
from ..System import *

def require(function):
  """
  
  PURPOSE: checks that an API request provides all arguments required by the function
  RETURNS: an error if the arguments aren't provided
  
  """
  def wrapper(self, payload):
    # enforce required arguments
    payload['self'] = self
    for arg in inspect.getargspec(function).args:
      if not arg in payload:
        return response.throw(2, arg)
    # remove extra, provided arguments
    for arg in payload.copy():
      if not arg in inspect.getargspec(function).args:
        del payload[arg]
    # call the function
    return function(**payload)
  return wrapper








class MethodsClass:
  """
  
  PURPOSE: Contains all the API methods
  
  """
  class connect:
    @classmethod
    @require
    def host(self):
      return Users.Host.create()
    
    
    @classmethod
    @require
    def device(self, name, model, pin):
      return Users.Device.create(name, model, pin)