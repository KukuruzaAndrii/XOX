const { stringBoard } = require('../bin/console')
const XOXGame = require('../src/xox')

const board = XOXGame.createBoard()
test('stringBoard', () => {
  expect(stringBoard(board)).toBe(
    `
+---+---+---+
|   |   |   |
+---+---+---+
|   |   |   |
+---+---+---+
|   |   |   |
+---+---+---+`
  )
})