import os
from google.appengine.api import memcache
import re
from google.appengine.ext.webapp import template




def serve(entrypoint):
  """
  
  PURPOSE: returns the JiroJS client file
  RETURNS: String
  
  """
  cacheVersion = readCache();
  data = cacheVersion if cacheVersion else cache()
  data = re.sub(r'\{\{entrypoint\}\}', entrypoint, data)
  return data




def readCache():
  """
  
  PURPOSE: Reads the JiroJS file from the memcache
  RETURNS: String or None
  
  """
  return memcache.get('JiroJS', namespace='JiroJSCache')




def cache():
  """
  
  PURPOSE: Caches the JiroJS file
  RETURNS: String
  
  """
  data = read()
  memcache.set('JiroJS', data, namespace='JiroJSCache')
  return data




def read():
  """
  
  PURPOSE: Reads the JiroJS file from the file system. It also minifies it slightly
  RETURNS: String
  
  """
  currentDirectory = os.path.dirname(os.path.realpath(__file__))
  filePath = os.path.join(currentDirectory, 'JiroJS.js')
  data = open(filePath, 'rb').read()
  # remove comments like so: "/* comment */"
  data = re.sub(r'\/\*((.|\n)(?!\*\/))*(.|\n)\*\/', '', data)
  # remove comments like so: "// comment"
  data = re.sub(r'\/\/.*', '', data)
  # remove tabs, white space, and new line characters
  # data = re.sub(r'(\s|\t|\n)', '', data)
  return data