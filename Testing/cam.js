const fs = require('fs')
const camera = require('camera')
 
const webcam = camera.createStream()
 
webcam.on('error', (err) => {
  console.log('error reading data', err)
})
 
webcam.on('data', (buffer) => {
  fs.writeFileSync('cam.png', buffer)
  webcam.destroy()
})
 
webcam.snapshot((err, buffer) => {
  
})
 
webcam.record(1000, (buffers) => {
  
})