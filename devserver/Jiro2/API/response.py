# all error responses
__ERROR__RESPONSES__ = {
  0 : "API Method Formatting Error",
  1 : "API Method Does Not Exist",
  2 : "API Method Requires Argument '%s'"
}

# throw error response
def throw(code, dataStruct=(), compiled=False):# dataStruct is used to add data to the messages and compile determines if the response should be auto-compiled
  # format the response
  response = {
    'stat' : 'fail',
    'code' : code,
    'message' : __ERROR__RESPONSES__[code] % dataStruct
  }
  # return the response <compile if specicfied>
  if compiled:
    return compile(response)
  else:
    return response


# returns a successful response
def reply(data={}):
  data['stat'] = 'ok'
  return data


# decorator that compiles the response of a function
def compile(function):
  import json
  def wrapper(*args, **kwargs):
    return json.dumps(function(*args, **kwargs))
  return wrapper