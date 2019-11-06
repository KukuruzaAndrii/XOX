/* global WebSocket */
export class SmartWS {
  events = {}

  constructor (url) {
    this.ws = new WebSocket(url)
    this.ws.addEventListener('message', message => {
      console.log('Message from server ', message)
      const { event, data } = JSON.parse(message.data)
      this.events[event](data)
    })
  }

  on (event, listener) {
    console.log(event)
    this.events[event] = listener
  }

  emit (event, data) {
    this.ws.send(JSON.stringify({ event, data }))
  }
}
