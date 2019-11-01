const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const path = require('path')
const XOXGame = require('./xox')

const port = process.env.PORT || 8080

const app = express()

const clientPath = path.resolve(__dirname, '..', 'static')
app.use(express.static(clientPath))
app.use('/build', express.static(path.resolve(__dirname, '..', 'node_modules/three/build')))
app.use('/three', express.static(path.resolve(__dirname, '..', 'node_modules/three/examples')))
app.use('/gsap', express.static(path.resolve(__dirname, '..', 'node_modules/gsap')))

const server = http.createServer(app)

const io = socketio(server)

let waitingPlayer = null
let countOnline = 0
io.on('connection', sock => {
  console.log('player connected')
  countOnline += 1
  io.emit('countOnline', countOnline)
  sock.on('disconnect', () => {
    countOnline -= 1
    io.emit('countOnline', countOnline)
  })

  if (waitingPlayer) {
    startGame(sock, waitingPlayer)
    waitingPlayer = null
  } else {
    waitingPlayer = sock
    waitingPlayer.emit('message', 'Waiting for an opponent')
  }
})
server.on('error', err => {
  console.error('Server error', err)
})

server.listen(port, () => {
  console.log(`**XOX started on ${port}**`)
})

const startGame = (p1socket, p2socket) => {
  console.log('game started')
  const game = new XOXGame()
  const registerHandlers = (p1socket, p2socket, playerOrder, game) => {
    p1socket.emit('start', playerOrder)
    p1socket.on('move', cmd => {
      console.log(cmd)
      const [x, y] = cmd.split('')
      const move = game.playerMove(playerOrder, x, y)
      if (move.isSuccess) {
        console.log(move, x, y)
        p2socket.emit('move', `${x}${y}`)
        const status = game.status()
        console.log(status.status)
        p1socket.emit('status', status)
        p2socket.emit('status', status)
      } else {
        console.error(playerOrder, move)
      }
    })
  }

  registerHandlers(p1socket, p2socket, XOXGame.first, game)
  registerHandlers(p2socket, p1socket, XOXGame.second, game)
}
