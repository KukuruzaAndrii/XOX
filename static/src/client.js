import {
  addX,
  addO,
  stats,
  rayCaster,
  mouse,
  camera,
  placeX,
  placeO,
  renderer,
  scene,
  init,
  animateWin
} from './3D.js'

const plane = init()
const board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]
const first = 'x'
const second = 'o'
let playerOrder
const drowMy = order => order === first ? addX : addO
const drowOpp = order => order === second ? addX : addO
const place = order => order === first ? placeX : placeO
let isClick = false
window.addEventListener('mouseup', () => { isClick = false }, false)
window.addEventListener('mousedown', () => { isClick = true }, false)
const animate = () => {
  // eslint-disable-next-line no-undef
  requestAnimationFrame(animate)
  stats.update()
  rayCaster.setFromCamera(mouse, camera)
  if (playerOrder) {
    const intersects = rayCaster.intersectObjects([plane])
    if (intersects.length === 1) {
      const [{ point }] = intersects
      const cellX = convertGlobalToCell(point.x)
      const cellY = convertGlobalToCell(point.z)
      const p = place(playerOrder)
      if (p && board[cellX][cellY] === '') {
        p.position.x = 6 * (cellX - 1)
        p.position.z = 6 * (cellY - 1)
      }
      if (isClick) {
        move(cellX, cellY)
        isClick = false
      }
    }
  }
  renderer.render(scene, camera)
}
animate()

// eslint-disable-next-line no-undef
const sock = io()
let canMove = false
sock.on('message', text => setMessage('message', text))
sock.on('countOnline', number => setMessage('countOnline', number))
sock.on('start', order => {
  playerOrder = order
  if (playerOrder === first) {
    canMove = true
    setMessage('message', 'Let the game begin!Your turn!')
  } else if (playerOrder === second) {
    canMove = false
    setMessage('message', 'Let the game begin!Opponent turn!')
  }
})
sock.on('move', cmd => {
  const [x, y] = cmd.split('')
  board[x][y] = playerOrder === first ? second : first
  drowOpp(playerOrder)(x, y)
  canMove = true
  setMessage('message', 'Your turn!')
})

sock.on('status', ({ status, combination, winner }) => {
  switch (status) {
    case 'continue':
      return
    case 'draw':
      setMessage('message', 'You lose! Same as your opponent')
      break
    case 'victory':
      if (winner === playerOrder) {
        setMessage('message', 'You win! Congratulation!')
        canMove = false
        animateWin(combination)
      } else {
        setMessage('message', 'You lose! Maybe next time...')
        canMove = false
        animateWin(combination)
      }
  }
})

const move = (x, y) => {
  if (!canMove || board[x][y] !== '') return
  board[x][y] = playerOrder
  sock.emit('move', `${x}${y}`)
  drowMy(playerOrder)(x, y)
  canMove = false
  setMessage('message', 'Opponent turn!')
}
const setMessage = (id, message) => {
  document.querySelector(`#${id}`).innerHTML = message
}

// const logDebug = log => setMessage('debug', log)
const convertGlobalToCell = x => Math.min(Math.floor(Math.abs(x / 3)), 1) * Math.sign(x) + 1
