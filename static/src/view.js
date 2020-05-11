import gsap from '../gsap/index.js'

export default class View {
  camera
  center = {
    x: null,
    y: null
  }

  constructor ({ x, y }, camera) {
    this.center.x = x
    this.center.y = y
    this.camera = camera
  }

  setCamera ({ x, y }) {
    this.center.x = x
    this.center.y = y
    this.camera.position.x = x
    this.camera.position.z = y
  }

  init () {
    this.camera.position.y = 17
    this.camera.rotation.x = -Math.PI / 2
    this.setCamera({ x: 0, y: -30 })
  }

  update (mouse) {
    const { position, rotation } = setCameraPosition(this.center, mouse)
    this.camera.position.x = position.x
    this.camera.position.z = position.z
    this.camera.rotation.x = rotation.x
    this.camera.rotation.y = rotation.y
  }

  start () {
    const tl = gsap.timeline()
    tl.to(this.center, { y: 0, duration: 1.5, ease: 'power2.out' })
  }
}
const setCameraPosition = (center, mousePosition) => {
  const { x, y } = mousePosition
  return {
    position: {
      x: center.x + 1.5 * x,
      z: center.y - 1.5 * y
    },
    rotation: {
      x: -Math.PI / 2 - Math.PI * y / 20,
      y: Math.PI * x / 20
    }
  }
}
