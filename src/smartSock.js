const WebSocket = require('ws')

class SmartWSS {
  rooms = []

  constructor (httpServer) {
    this.wss = new WebSocket.Server(httpServer)
  }

  on (event, listener) {
    this.wss.on(event, sock => listener(new SmartSock(sock)))
  }

  to (roomID) {
    const roomIndex = this.rooms.findIndex(({ name }) => name === roomID)
    if (roomIndex === -1) {
      console.log('create room ', roomID)
      const room = new Room(roomID)
      this.rooms.push(room)
      return room
    }
    console.log('use room ', roomID)
    return this.rooms[roomIndex]
  }

  emit (event, data) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event, data }))
      }
    })
  }
}

class SmartSock {
  events = {}

  constructor (ws) {
    this.ws = ws
    this.ws.on('message', message => {
      console.log('Message from client ', message)
      const { event, data } = JSON.parse(message)
      if (this.events[event] === undefined) {
        throw new Error(`Dont find event with name ${event}`)
      }
      this.events[event](data)
    })
    this.ws.on('open', () => {
      console.log('connected')
      if (this.events.open !== undefined) {
        this.events.open()
      }
    })
    this.ws.on('close', () => {
      console.log('disconnected')
      if (this.events.close !== undefined) {
        this.events.close()
      }
    })
  }

  on (event, listener) {
    this.events[event] = listener
  }

  emit (event, data) {
    console.log(event, data)
    this.ws.send(JSON.stringify({ event, data }))
  }
}

class Room {
  constructor (name, sockets = []) {
    this.name = name
    this.sockets = sockets
  }

  on (event, listener) {
    this.sockets.forEach(s => s.on(event, listener))
  }

  emit (event, data) {
    this.sockets.forEach(s => s.emit(event, data))
  }

  join (socket) {
    // console.log('join to ', this.sockets, '-', socket)
    this.sockets.push(socket)
    console.log('now ', this.sockets)
  }
}

module.exports = SmartWSS
