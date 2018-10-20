const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const clientPath = `${__dirname}/../client`

app.use(express.static(clientPath))
const server = http.createServer(app)

const io = socketio(server)

let waitingPlayer = null;

io.on('connection', sock => {
  console.log('client connected')

  if (waitingPlayer) {
    [sock, waitingPlayer].forEach(s => s.emit('message', 'Let the game begin!'))
    startGame(sock, waitingPlayer)
    waitingPlayer = null
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit('message', 'Waiting for an opponent')
  }

})
server.on('error', err => {
  console.error('Server error', err)
})

server.listen(8080, () => {
  console.log('**XOX started on 8080**')
})


const startGame = (p1, p2) => {
  p1.on('move', ([x,y]) => {
    console.log(x,y)
    p2.emit('move', [x,y])
  })

  p2.on('move', ([x,y]) => {
    console.log(x,y)
    p1.emit('move', [x,y])
  })
}