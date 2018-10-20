const setMessage = message => {
  document.querySelector('#message').innerHTML = message
}

const sock = io();

sock.on('message', setMessage);
sock.on('move', ([x, y]) => {
  document.querySelector(`[data-x='${x}'][data-y='${y}']`).innerHTML = 'O'
});


const move = (x, y) => sock.emit('move', [x, y])

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    cell.innerHTML = 'X'
    move(cell.dataset.x, cell.dataset.y)
  })
})
