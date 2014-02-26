import endpoints
from protorpc import messages
from protorpc import message_types





Void = message_types.VoidMessage



DeviceConnection = endpoints.ResourceContainer(
  pin=messages.StringField(1, required=True),
  name=messages.StringField(2, required=True),
  model=messages.StringField(3, required=True)
)