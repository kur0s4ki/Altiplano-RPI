import asyncio
import websockets
import json
from time import sleep

async def hello():
    uri = "ws://localhost:8005"
    async with websockets.connect(uri) as websocket:
        while True:
            message = await websocket.recv()
            print("\n" + message)
            #sleep(2)
            name = input("\nCommand :  ")
            if(name=="1"):
                msg = {
                    'action':'boyardPicked',
                    'data':'50'
                }
                await websocket.send(json.dumps(msg))
                greeting = await websocket.recv()
                print("\n" + greeting)
            if(name=="2"):
                msg = {
                    'action':'ChronoEnd',
                }
                await websocket.send(json.dumps(msg))
            # else:
            #     await websocket.send(name)
            #     greeting = await websocket.recv()
            #     print("\n" + greeting)

asyncio.get_event_loop().run_until_complete(hello())