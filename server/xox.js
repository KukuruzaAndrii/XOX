class XOXGame {
  constructor(p1, p2, board) {
    this._p1 = p1;
    this._p2 = p2;
    this._board = board;
  }

  p1move(x, y) {
    this._board[x][y] = this._p1;
    this.checkStatus()
  }

  p2move(x, y) {
    this._board[x][y] = this._p2;
    this.checkStatus()
  }

  get getBoard() {
    return this._board;
  }

  checkStatus() {
    const board = this._board;
    for (let i = 0; i < board.length; i++) {

    }

    if (board)
      }

}
