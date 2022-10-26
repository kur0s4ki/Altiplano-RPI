#--- Importing required modules.
import sys
import time
from smartcard.scard import *
import smartcard.util
from smartcard.System import readers


#---This is the list of commands that we want to send device
cmds =[[0xFF,0x69,0x44,0x42,0x05,0x68,0x92,0x00,0x04,0x00]]


#--- Let's to make a connection to the card reader
r=readers()
print ("Available Readers :",r)
target_reader = input("--- Select Reader (0, 1 , ...): ")
print

while(True):
    try:
        print ("Using :",r[target_reader])
        reader = r[target_reader]
        connection=reader.createConnection()
        connection.connect()
        break
    except:
        print ("--- Exception occured! (Wrong reader or No card present)")
        ans = input("--- Try again? (0:Exit/1:Again/2:Change Reader)")
        if int(ans)==0:
            exit()
        elif int(ans)==2:
            target_reader = input("Select Reader (0, 1 , ...): ")

#--- An struct for APDU responses consist of Data, SW1 and SW2
class stru:
    def __init__(self):
        self.data = list()
        self.sw1 = 0
        self.sw2 = 0

resp = stru()

def send(cmds):
    for cmd in cmds:

        #--- Following 5 line added to have a good format of command in the output.
        temp = stru() ;
        temp.data[:]=cmd[:]
        temp.sw1=12
        temp.sw2=32
        modifyFormat(temp)
        print ("req: ", temp.data)

        resp.data,resp.sw1,resp.sw2 = connection.transmit(cmd)
        modifyFormat(resp)
        printResponse(resp)

def modifyFormat(resp):
    resp.sw1=hex(resp.sw1)
    resp.sw2=hex(resp.sw2)   
    if (len(resp.sw2)<4):
        resp.sw2=resp.sw2[0:2]+'0'+resp.sw2[2]
    for i in range(0,len(resp.data)):
        resp.data[i]=hex(resp.data[i])
        if (len(resp.data[i])<4):
            resp.data[i]=resp.data[i][0:2]+'0'+resp.data[i][2]

def printResponse(resp):
    print ("res: ", resp.data,resp.sw1,resp.sw2)


send(cmds)
connection.disconnect()