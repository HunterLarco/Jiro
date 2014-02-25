from ..API import response
import inspect
import re


### PURPOSE
# A function decorator that verifies that all parameters are supplied and not None or empty strings
### Example Usage
# @validate
# def function(arg1, arg2, arg3):
#   ...
def validate(function):
  def success(*args, **kwargs):
    returned = function(*args, **kwargs)
    if not returned == None:
      return returned
    return response.reply()
  def wrapper(*args, **kwargs):
    # totalargs = len(inspect.getargspec(function).args)
    # givenargs = len(args)+len(kwargs)
    # if totalargs != givenargs:
    #   return response.throw(10, dataStruct=(function.__name__, totalargs, givenargs))
    i = 0
    for arg in args:
      if arg == None or arg == "":
        return response.throw(1, dataStruct=(function.__name__, inspect.getargspec(function).args[i]))
      i += 1
    return success(*args, **kwargs)
  return wrapper


### PURPOSE
# Insure correct parameter types
### RETURNS
# a response "object"
### EXAMPLE USAGE
# @strict(str, None, list)
# def function(must_be_string, doesnt_matter, must_be_list):
#   ...
### NOTES
#   1. None type is used as a bypass
#   2. Strings used as a parameter type will act as regex validators
def strict(*targets):
  def decorator(function):
    def success(*args, **kwargs):
      returned = function(*args, **kwargs)
      if not returned == None:
        return returned
      return response.reply()
    def wrapper(*args, **kwargs):
      if len(inspect.getargspec(function).args) != len(args)+len(kwargs):
        return response.throw(10, dataStruct=(function.__name__, len(inspect.getargspec(function).args), len(args)+len(kwargs)))
      for i in range(min([len(args), len(targets), len(inspect.getargspec(function).args)])):
        if targets[i] == None:
          continue
        if isinstance(targets[i], str):
          if re.match(re.compile(targets[i]), args[i]) == None:
            return response.throw(22, dataStruct=inspect.getargspec(function).args[i])
          continue
        if not isinstance(args[i], targets[i]):
          return response.throw(20, dataStruct=(inspect.getargspec(function).args[i], targets[i].__name__))
      return success(*args, **kwargs)
    return wrapper
  return decorator