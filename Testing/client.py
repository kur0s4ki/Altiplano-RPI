import asyncio
import websockets
import json
from time import sleep

async def hello():
    uri = "ws://localhost:8000"
    async with websockets.connect(uri) as websocket:
        while True:
            #sleep(2)
            name = input("\nCommand :  ")
            if(name=="1"):
                await websocket.send("badge_in_status")
                greeting = await websocket.recv()
                print("\n" + greeting)
                # message = {
                #     'cardUID':'xxxxxxxxxxx',
                # }
                # await websocket.send(json.dumps(message))

            elif(name =="info" or name =="is_won" or name == "is_lost" or name =="debug"):
                await websocket.send(name)
                greeting = await websocket.recv()
                print("\n" + greeting)
            elif(name=="go"):
                message = {
                    'action':'go',
                    'data': 3
                }
                await websocket.send(json.dumps(message))
                greeting = await websocket.recv()
                print("\n" + greeting)
            elif(name=="start_animation_simulation"):
                message = {
                    'action':'start_animation_simulation',
                }
                await websocket.send(json.dumps(message))
                greeting = await websocket.recv()
                print("\n" + greeting)

            elif(name=="game_status"):
                message = {
                    'action':'game_status',
                    'data': "win"
                }
                await websocket.send(json.dumps(message))
                greeting = await websocket.recv()
                print("\n" + greeting)
                
            elif(name=="exit"):
                await websocket.send(name)
                greeting = await websocket.recv()
                print("\n" + greeting)

            else:
                await websocket.send(name)

asyncio.get_event_loop().run_until_complete(hello())