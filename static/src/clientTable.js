const setMessage = message => {
  document.querySelector('#message').innerHTML = message
}

// eslint-disable-next-line no-undef
const sock = io()
let canMove = true
sock.on('message', setMessage)
sock.on('move', ([x, y]) => {
  document.querySelector(`[data-x='${x}'][data-y='${y}']`).innerHTML = 'O'
  canMove = true
})
sock.on('win')

const move = (x, y) => sock.emit('move', [x, y])

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    if (cell.innerHTML === '' && canMove) {
      cell.innerHTML = 'X'
      move(cell.dataset.x, cell.dataset.y)
      canMove = false
    }
  })
})
