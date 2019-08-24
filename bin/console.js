const readlineSync = require('readline-sync')
const XOXGame = require('../src/xox')

// readlineSync.setDefaultOptions({ limit: ['X', 'x', 'o', 'O'] })

const startConsole = () => {
  const game = new XOXGame()
  console.log('Hi in XOX')
  let player = 'o'
  while (game.checkStatus().status === 'continue') {
    player = player === 'x' ? 'o' : 'x'
    let move = { isSuccess: false }
    while (!move.isSuccess) {
      console.log(`Player ${player} move`)
      const cell = readlineSync.keyIn('Enter cell:', { limit: '$<1-9>' })
      const x = 2 - Math.floor((cell - 1) / 3)
      const y = (cell - 1) % 3
      move = game.playerMove(player, x, y)
      if (!move.isSuccess) {
        switch (move.code) {
          case 'twoMovesInRow':
            console.log(`${player} can't moved two times in a row`)
            break
          case 'cellAlreadySet':
            console.log(`cell ${cell} already set`)
            break
          case 'outOfBounds':
            console.log(`move ${cell} is not correct`)
            break
          default:
            console.log('unexpected error')
            break
        }
      }
    }
    console.log(stringBoard(game.board))
  }
  switch (game.checkStatus().status) {
    case 'draw':
      console.log('Draw!')
      break
    case 'victory':
      console.log(`Winner is ${game.checkStatus().winner}!
      Congratulation!`)
  }
}
const stringBoard = board => {
  const b = board
  return `
+---+---+---+
| ${b[0][0]} | ${b[0][1]} | ${b[0][2]} |
+---+---+---+
| ${b[1][0]} | ${b[1][1]} | ${b[1][2]} |
+---+---+---+
| ${b[2][0]} | ${b[2][1]} | ${b[2][2]} |
+---+---+---+`
}
module.exports = { stringBoard, startConsole }
