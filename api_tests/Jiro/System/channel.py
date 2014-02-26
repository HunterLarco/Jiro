from google.appengine.api import channel



def create(identifier):
  return channel.create_channel(identifier)



def send(identifier, data):
  channel.send_message(identifier, response.compile(data))