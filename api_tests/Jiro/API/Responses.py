import endpoints
from protorpc import messages
from protorpc import message_types







class AccessToken(messages.Message):
  stat = messages.StringField(1, required=True)
  access_token = messages.StringField(2, required=True)
  socket_token = messages.StringField(3, required=True)