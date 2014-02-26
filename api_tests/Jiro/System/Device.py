import db
import Hash
from ShardCounter import Counter
import channel
from ..API import Responses


def create(name, model, pin):
  device = db.Device()
  device.name = name
  device.model = model
  device.pin = pin
  
  Counter.increment('channelcounter')
  privatekey = Hash.sha256(str(Counter.getValue('channelcounter')))
  publickey = Hash.sha224(privatekey)
  
  device.publickey = publickey
  device.privatekey = privatekey
  
  device.put()
  
  return Responses.AccessToken(
    access_token=privatekey,
    socket_token=channel.create(privatekey),
    stat='ok'
  )