const WebSocket = require('ws')

class SmartWSS {
  constructor (httpServer) {
    this.wss = new WebSocket.Server(httpServer)
  }

  on (event, listener) {
    this.wss.on(event, sock => listener(new SmartSock(sock)))
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
      console.log('Message from server ', message)
      const { event, data } = JSON.parse(message)
      this.events[event](data)
    })
    this.ws.on('open', () => {
      console.log('connected')
      if (this.events.open) {
        this.events.open()
      }
    })
    this.ws.on('close', () => {
      console.log('disconnected')
      if (this.events.close) {
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

module.exports = SmartWSS
