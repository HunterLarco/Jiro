import re
import response
import json
from Methods import MethodsClass



@response.compile
def delegate(request):
  # the json body
  params = json.loads(request.body)
  # get api method
  method = params['method']
  del params['method']
  # regex pattern for the method
  formatting = r'^(?:([a-z][a-z0-9]*)\.)*([a-z][a-z0-9]*)$'
  # the method applied to the regex pattern
  match = re.search(formatting, method)
  # if the method is poorly formatted throw an error
  if not match:
    return response.throw(0)
  # parse the different parts of the method (separated by a '.')
  groups = [group for group in match.groups() if group]
  # get for the api method
  api = MethodsClass
  for part in groups:
    if not hasattr(api, part):
      # the api method does not exist
      return response.throw(1)
    api = getattr(api, part)
  # run the method
  output = api(params)
  # check for a good response
  if 'stat' in output and output['stat'] == 'fail':
    # return failure
    return output
  # return a success
  return response.reply(output)