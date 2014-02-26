from ShardCounter import Counter
import Hash
import channel
from ..API import Responses


def create():
  Counter.increment('channelcounter')
  privatekey = Hash.sha256(str(Counter.getValue('channelcounter')))
  return Responses.AccessToken(
    access_token=privatekey,
    socket_token=channel.create(privatekey),
    stat='ok'
  )