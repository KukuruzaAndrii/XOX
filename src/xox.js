module.exports = class XOXGame {
  static first = 'x'
  static second = 'o'
  #lastPlayer = null
  #lastStatus = null

  constructor () {
    this.board = XOXGame.createBoard()
  }

  playerMove (player, x, y) {
    if (player !== XOXGame.first && player !== XOXGame.second) {
      return {
        isSuccess: false,
        code: 'wrongPlayer'
      }
    }
    if (this.lastPlayer === player) {
      return {
        isSuccess: false,
        code: 'twoMovesInRow'
      }
    }
    if (this.board[x][y] !== '') {
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
      isSuccess: true
    }
  }

  status () {
    const checkStatus = () => {
      const testWin = player => combination => combination.every(([x, y]) => this.board[x][y] === player)
      const combinations = [
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]],
        ...[0, 1, 2].map(x => [[x, 0], [x, 1], [x, 2]]),
        ...[0, 1, 2].map(x => [[0, x], [1, x], [2, x]])
      ]
      for (const player of [XOXGame.first, XOXGame.second]) {
        const winCombination = combinations.find(testWin(player))
        if (winCombination) {
          return {
            status: 'victory',
            combination: winCombination,
            winner: player
          }
        }
      }

      for (let x = 0; x < this.board.length; x++) {
        for (let y = 0; y < this.board.length; y++) {
          if (this.board[x][y] === '') {
            return { status: 'continue' }
          }
        }
      }
      return { status: 'draw' }
    }
    this.lastStatus = checkStatus()
    return this.lastStatus
  }

  static createBoard () {
    return [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
  }
}
