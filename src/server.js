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

  if (waitingForOpp) {
    wss.to(String(lastRoomID)).join(ws)
    startGame(String(lastRoomID))
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

const startGame = roomID => {
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
  const room = wss.to(roomID)
  registerHandlers(room.sockets[0], room.sockets[1], XOXGame.first, game)
  registerHandlers(room.sockets[1], room.sockets[0], XOXGame.second, game)
}

/*
class Room {
  constructor (socketRoom) {
    this.socketRoom = socketRoom
  }

  start () {
    startGame(this.socketRoom)
  }
} */
