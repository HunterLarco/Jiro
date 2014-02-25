# all error responses
__ERROR__RESPONSES__ = {
  0 : "Access Denied",
  1 : "Parameter Missing: Function '%s'; Parameter '%s'",
  2: "User '%s' Does Not Exist",
  3: "Device '%s' Does Not Exist",
  4: "Incorrect Connection Pin",
  5: "Device Is Already Connected To A Host: Disconnect The Device And Try Connecting Again",
  10 : "Function '%s' requires '%s' arguments; Not '%s' arguments",
  21 : "Casting Error",
  22 : "Incorrect Parameter Type: Regex does not match parameter '%s'",
  14 : "API Handler Map Dictionary '%s' Does Not contain Method '%s'",
  15 : "API Handler Map Does Not Contain Dictionary '%s'",
  16 : "GET API Requests Must Use The 'get' Dictionary In The Permissions Map",
  17 : "A POST API Request May Not Use The 'get' Dictionary",
  24 : "API Post Payload is Missing a Required Field"
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


# compiles response for output
def compile(JSON):
  import json
  return json.dumps(JSON)