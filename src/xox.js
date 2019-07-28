module.exports = class XOXGame {
  constructor () {
    this.lastPlayer = undefined
    this.board = XOXGame.createBoard()
  }

  playerMove (player, x, y) {
    if (this.lastPlayer === player) {
      return {
        isSuccess: false,
        code: 'twoMovesInRow'
      }
    }
    if (this.board[x][y] !== ' ') {
      return {
        isSuccess: false,
        code: 'cellAlreadySet'
      }
    }
    if (x < 0 || x > 2 || y < 0 || y > 2) {
      return {
        isSuccess: false,
        code: 'outOfBounds'
      }
    }
    this.board[x][y] = player
    this.lastPlayer = player
    return {
      isSuccess: true,
    }
  }

  checkStatus () {
    const players = ['x', 'o']
    for (let i = 0; i < players.length; i++) {
      const pl = players[i]
      for (let x = 0; x < this.board.length; x++) {
        if (
          (this.board[x][0] === pl && this.board[x][1] === pl && this.board[x][2] === pl)
          || (this.board[0][x] === pl && this.board[1][x] === pl && this.board[2][x] === pl)
          || (this.board[0][0] === pl && this.board[1][1] === pl && this.board[2][2] === pl)
          || (this.board[2][0] === pl && this.board[1][1] === pl && this.board[0][2] === pl)) {
          return {
            status: 'victory',
            winner: pl
          }
        }
      }
    }

    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board.length; y++) {
        if (this.board[x][y] === ' ') {
          return { status: 'continue' }
        }
      }
    }
    return { status: 'draw' }
  }

  static createBoard () {
    return [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ]
  }
}
