import { addX, addO, stats, rayCaster, mouse, camera, places, renderer, scene, init } from './3D.js'

init()
const board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

let isClick = false
window.addEventListener('mouseup', () => { isClick = false }, false)
window.addEventListener('mousedown', () => { isClick = true }, false)
const animate = () => {
  // eslint-disable-next-line no-undef
  requestAnimationFrame(animate)
  stats.update()
  // gltfO.rotation.x += 0.01;
  // logDebug(mouse.x + ' ' + mouse.y)
  rayCaster.setFromCamera(mouse, camera)
  // debugger
  const intersects = rayCaster.intersectObjects(places)
  // some wrong with first check intersect after grid and places is loaded, and intersectObjects return all objects
  if (intersects.length === places.length) return
  if (intersects.length === 1) {
    const [{ object }] = intersects
    object.material.opacity = 0.1
    places.filter(pl => pl !== object).forEach(pl => {
      pl.material.opacity = 0
    })
    if (isClick) {
      const { x, y } = object
      move(x, y)
      isClick = false
    }
  }
  // console.log(intersects)
  for (let i = 0; i < intersects.length; i++) {
    // intersects[i].object.material.color.set(0xff0000);
    // intersects[i].object.visible = false
  }

  renderer.render(scene, camera)
}
animate()

const sock = io()
let canMove = false
sock.on('message', text => setMessage('message', text))
sock.on('countOnline', number => setMessage('countOnline', number))
sock.on('start', status => {
  if (status === 'first') {
    canMove = true
    setMessage('message', 'Let the game begin!Your turn!')
  }
  if (status === 'second') {
    canMove = false
    setMessage('message', 'Let the game begin!Opponent turn!')
  }
})
sock.on('move', ([x, y]) => {
  board[x][y] = 'o'
  addO(x, y)
  canMove = true
  // console.log('canMove', canMove)

  setMessage('message', 'Your turn!')
})
sock.on('win')

const move = (x, y) => {

  if (!canMove || board[x][y] !== '') return
  board[x][y] = 'x'
  sock.emit('move', [x, y])
  addX(x, y)
  canMove = false
  setMessage('message', 'Opponent turn!')
}
const setMessage = (id, message) => {
  document.querySelector(`#${id}`).innerHTML = message
}

const logDebug = log => setMessage('debug', log)
