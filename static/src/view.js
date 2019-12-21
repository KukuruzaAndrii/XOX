export default class View {
  center = {
    x: null,
    y: null
  }

  constructor ({ x, y }) {
    this.center.x = x
    this.center.y = y
  }

  setCenter ({ x, y }) {
    this.center.x = x
    this.center.y = y
  }

  getCameraPosition (mousePosition) {
    const { x, y } = mousePosition
    return {
      position: {
        x: this.center.x + 1.5 * x,
        z: this.center.y - 1.5 * y
      },
      rotation: {
        x: -Math.PI / 2 - Math.PI * y / 20,
        y: Math.PI * x / 20
      }
    }
  }
}
