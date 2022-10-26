from smartcard.CardType import AnyCardType
from smartcard.CardRequest import CardRequest
from smartcard.CardConnection import CardConnection
from smartcard.util import toHexString

import sys
getuid=[0xE0, 0x00, 0x00, 0x33, 0x00]
act = AnyCardType()
cr = CardRequest( timeout=10, cardType=act )
cs = cr.waitforcard()
cs.connection.connect()

print(toHexString( cs.connection.getATR() ))
print(cs.connection.getReader())
data, sw1, sw2 = cs.connection.transmit(getuid)

if (sw1, sw2) == (0x90, 0x0):
  print("Status: The operation completed successfully.")
elif (sw1, sw2) == (0x63, 0x0):
  print("Status: The operation failed.")

print("uid={}".format(toHexString(data)))
cs=None  #to prevent error message when calling sys.exit() below
sys.exit()