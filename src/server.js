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
    waitingPlayer.emit('start', 'first')
    sock.emit('start', 'second')
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

const startGame = (p1, p2) => {
  console.log('game started')
  const game = new XOXGame()
  const registerHandlers = (p1, p2, playerSign, game) => {
    p1.on('move', ([x, y]) => {
      const move = game.playerMove(playerSign, x, y)
      if (move.isSuccess) {
        console.log(move, x, y)
        p2.emit('move', [x, y])
        const { status } = game.status()
        switch (status) {
          case 'draw':
            console.log('Draw!')
            p1.emit('message', 'You lose! Same as your opponent')
            p2.emit('message', 'You lose! Same as your opponent')
            break
          case 'victory':
            console.log('we have a winner!')
            p1.emit('message', 'You win! Congratulation!')
            p2.emit('message', 'You lose! Maybe next time...')
        }
      } else {
        // todo show error
      }
    })
  }
  registerHandlers(p1, p2, 'x', game)
  registerHandlers(p2, p1, 'o', game)
}
