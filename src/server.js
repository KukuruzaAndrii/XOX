const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const path = require('path')
const XOXGame = require('./xox')

const port = process.env.PORT || 8080

const app = express()

const clientPath = path.resolve(__dirname, '..', 'static')
app.use(express.static(clientPath))
app.use('/three', express.static(path.resolve(__dirname, '..', 'node_modules/three/build')))
app.use('/three/js', express.static(path.resolve(__dirname, '..', 'node_modules/three/examples/js')))

const server = http.createServer(app)

const io = socketio(server)

let waitingPlayer = null

io.on('connection', sock => {
  console.log('static connected')

  if (waitingPlayer) {
    [sock, waitingPlayer].forEach(s => s.emit('message', 'Let the game begin!'))
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
  const game = new XOXGame()
  const registerHandlers = (p1, p2, playerSign, game) => {
    p1.on('move', ([x, y]) => {
      const move = game.playerMove(playerSign, x, y)
      if (move.isSuccess) {
        console.log(game.move, x, y)
        p2.emit('move', [x, y])
        const { status } = game.checkStatus()
        switch (status) {
          case 'draw':
            console.log('Draw!')
            p1.emit('message', 'You lose! Same as your opponent')
            p2.emit('message', 'You lose! Same as your opponent')
            break
          case 'victory':
            p1.emit('message', 'You win! Congratulation!')
            p2.emit('message', 'You lose! Maybe next time...')
        }
      }
    })
  }
  registerHandlers(p1, p2, 'x', game)
  registerHandlers(p2, p1, 'o', game)
}
