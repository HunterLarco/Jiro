import hashlib
from ShardCounter import Counter



def salt(stem, size=5):
  """
  
  PURPOSE: adds salt (only lower case letters) to a given string
  RETURNS: the string with appended salt
  
  """
  import random
  import string
  msg = ''
  for i in range(size):
    msg += random.choice(string.ascii_lowercase)
  return stem+msg



def generate():
  """
  
  PURPOSE: Generates a unique private and public key combination for access tokens
           It does add some salt to the shard counter to make the keys less predictable
  
  """
  Counter.increment('keygen')
  counterValue = str(Counter.getValue('keygen'))
  privatekey = hashlib.sha256(salt(counterValue)).hexdigest()
  publickey = hashlib.sha256(privatekey).hexdigest()
  return {
    'public': publickey,
    'private': privatekey
  }