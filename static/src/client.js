/* global requestAnimationFrame */
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
import { SmartWS } from './smartWS.js'

const plane = init()
const board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]
const first = 'x'
const second = 'o'
let playerOrder = null
const drawMy = order => order === first ? addX : addO
const drawOpp = order => order === second ? addX : addO
const place = order => order === first ? placeX : placeO
let isClick = false
let gameOver = false
let canMove = false
window.addEventListener('mouseup', () => { isClick = false }, false)
window.addEventListener('touchend', () => { isClick = false }, false)
window.addEventListener('click', () => { isClick = true }, false)
const animate = () => {
  requestAnimationFrame(animate)
  stats.update()
  logDebug(`${mouse.x} ${mouse.y}`)
  rayCaster.setFromCamera(mouse, camera)
  if (playerOrder && !gameOver) {
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
      if (isClick && canMove && board[cellX][cellY] === '') {
        move(cellX, cellY)
        isClick = false
      }
    }
  }
  renderer.render(scene, camera)
}

// eslint-disable-next-line no-undef
const sock = new SmartWS(location.origin.replace(/^http/, 'ws'))
// sock.addEventListener('open', () => {
//   console.log('open')
// })
// sock.on('rooms', rooms => renderRooms(rooms))
// document.querySelector('#createRoom').addEventListener('click', e => {
//   sock.emit('createRoom')
// })

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
  drawOpp(playerOrder)(x, y)
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
      } else {
        setMessage('message', 'You lose! Maybe next time...')
      }
      gameOver = true
      animateWin(combination)
  }
})

const move = (x, y) => {
  // if (!canMove || board[x][y] !== '') return
  board[x][y] = playerOrder
  sock.emit('move', `${x}${y}`)
  drawMy(playerOrder)(x, y)
  canMove = false
  setMessage('message', 'Opponent turn!')
}
const setMessage = (id, message) => {
  document.querySelector(`#${id}`).innerHTML = message
}
const logDebug = log => setMessage('debug', log)

const convertGlobalToCell = x => Math.min(Math.floor(Math.abs(x / 3)), 1) * Math.sign(x) + 1

// const renderRooms = (rooms) => {
//   rooms.forEach(room => {
//     const div = document.createElement('div')
//     const p = document.createElement('p')
//     // 👨‍💻
//     const text = document.createTextNode(`[${'👩‍💻'.repeat(room)}]`)
//     p.appendChild(text)
//     div.appendChild(p)
//     if (room === 1) {
//       const but = document.createElement('button')
//       const text = document.createTextNode('join')
//       but.appendChild(text)
//       but.addEventListener('click', e => {
//         sock.emit('joinRoom', '0')
//       })
//       div.appendChild(but)
//     }
//     document.querySelector('#rooms').appendChild(div)
//   })
// }
animate()
