const http = require('http')
const express = require('express')
const path = require('path')

const XOXGame = require('./xox')
const SmartWSS = require('./smartSock')

const port = process.env.PORT || 8080
const app = express()
const clientPath = path.resolve(__dirname, '..', 'static')
app.use(express.static(clientPath))
app.use('/build', express.static(path.resolve(__dirname, '..', 'node_modules/three/build')))
app.use('/three', express.static(path.resolve(__dirname, '..', 'node_modules/three/examples')))
app.use('/gsap', express.static(path.resolve(__dirname, '..', 'node_modules/gsap')))

const server = http.createServer(app)

const wss = new SmartWSS({ server })
// const pool = []
// const rooms = []
let waitingForOpp = false
let countOnline = 0
let lastRoomID = 0
wss.on('connection', ws => {
  console.log('player connected')
  countOnline += 1
  wss.emit('countOnline', countOnline)
  // console.log(wss.rooms)
  // wss.emit('rooms', wss.rooms.map(room => room.sockets.length))
  // ws.on('createRoom', () => {
  //   rooms.push(wss.to(String(lastRoomID)).join(ws))
  //   lastRoomID += 1
  // })
  // ws.on('joinRoom', roomID => {
  //   wss.to(roomID).join(ws)
  //   startGame(roomID)
  // })

  ws.on('close', () => {
    console.log('close')
    countOnline -= 1
    wss.emit('countOnline', countOnline)
  })
  ws.on('start', () => {

  })
  if (waitingForOpp) {
    wss.to(String(lastRoomID)).join(ws)
    const game = new Game(String(lastRoomID))
    game.start()
    // startGame(String(lastRoomID))
    lastRoomID += 1
  } else {
    wss.to(String(lastRoomID)).join(ws)
    ws.emit('message', 'Waiting for an opponent')
    waitingForOpp = true
  }
})
server.on('error', err => {
  console.error('Server error', err)
})

server.listen(port, () => {
  console.log(`**XOX started on ${port}**`)
})

class Game {
  roomID
  status
  score
  socketRoom
  socket1
  socket2
  XOX

  constructor (roomID) {
    this.roomID = roomID
    this.socketRoom = wss.to(this.roomID)
    this.socket1 = this.socketRoom.sockets[0]
    this.socket2 = this.socketRoom.sockets[1]
    this.score = [0, 0]
    this.XOX = new XOXGame()
  }

  start () {
    console.log('game started')
    // const room = wss.to(this.roomID)
    // registerHandlers(room.sockets[0], room.sockets[1], XOXGame.first, game)
    // registerHandlers(room.sockets[1], room.sockets[0], XOXGame.second, game)
    this.handleMove(this.socket1, this.socket2, XOXGame.first, XOXGame.second)
    this.handleMove(this.socket2, this.socket1, XOXGame.second, XOXGame.first)
  }

  handleMove (playerSoc, opponentSocket, playerOrder, opponentOrder) {
    playerSoc.emit('start', playerOrder)
    playerSoc.emit('score', `${this.score[0]},${this.score[1]}`)
    playerSoc.on('move', cmd => {
      console.log(cmd)
      const [x, y] = cmd.split('')
      const move = this.XOX.playerMove(playerOrder, x, y)
      if (move.isSuccess) {
        console.log(move, x, y)
        opponentSocket.emit('move', `${x}${y}`)
        const status = this.XOX.status()
        console.log(status.code)
        playerSoc.emit('status', status)
        opponentSocket.emit('status', status)
        if (status.code === 'continue') return

        // restart
        if (status.code === 'victory') {
          const winnerCode = status.winner === XOXGame.first ? 0 : 1
          this.score[winnerCode] += 1
        } else if (status.code === 'draw') {
          // this.score[0] += 1
          // this.score[1] += 1
        }
        playerSoc.emit('score', `${this.score[0]},${this.score[1]}`)
        opponentSocket.emit('score', `${this.score[1]},${this.score[0]}`)
        this.XOX = new XOXGame()
        playerSoc.emit('restart', playerOrder)
        opponentSocket.emit('restart', opponentOrder)
      } else {
        console.error(playerOrder, move)
      }
    })
  }

  restart () {
    // this.XOX = new XOXGame()
  }
}
