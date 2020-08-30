/* eslint-env jest */
const XOXGame = require('../src/xox')
const first = XOXGame.first
const second = XOXGame.second

const game1 = new XOXGame()
test('first move', () => {
  const move = game1.playerMove(first, 0, 0)
  expect(move).toMatchObject({ isSuccess: true })
  expect(game1.board).toMatchObject([
    ['x', '', ''],
    ['', '', ''],
    ['', '', '']
  ])
})
test('twoMovesInRow', () => {
  const move = game1.playerMove(first, 0, 0)
  expect(move).toMatchObject({ isSuccess: false, code: 'twoMovesInRow' })
  expect(game1.board).toMatchObject([
    ['x', '', ''],
    ['', '', ''],
    ['', '', '']
  ])
})

test('continue', () => {
  expect(game1.status()).toMatchObject({ code: 'continue' })
})

test('win-horisontal', () => {
  const game2 = new XOXGame()
  expect(game2.playerMove(first, 0, 0)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', '', ''],
    ['', '', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(second, 1, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', '', ''],
    ['', 'o', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(first, 0, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'x', ''],
    ['', 'o', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(second, 1, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'x', ''],
    ['', 'o', 'o'],
    ['', '', '']
  ])
  expect(game2.playerMove(first, 0, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'x', 'x'],
    ['', 'o', 'o'],
    ['', '', '']
  ])
  expect(game2.status()).toMatchObject({
    code: 'victory',
    combination: [[0, 0], [0, 1], [0, 2]],
    winner: first
  })
})

test('win-vertical', () => {
  const game2 = new XOXGame()
  expect(game2.playerMove(first, 0, 0)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', '', ''],
    ['', '', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(second, 1, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', '', ''],
    ['', 'o', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(first, 2, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', '', ''],
    ['', 'o', ''],
    ['', '', 'x']
  ])

  expect(game2.playerMove(second, 0, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', ''],
    ['', 'o', ''],
    ['', '', 'x']
  ])
  expect(game2.playerMove(first, 0, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', 'x'],
    ['', 'o', ''],
    ['', '', 'x']
  ])
  expect(game2.playerMove(second, 2, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', 'x'],
    ['', 'o', ''],
    ['', 'o', 'x']
  ])
  expect(game2.status()).toMatchObject({
    code: 'victory',
    combination: [[0, 1], [1, 1], [2, 1]],
    winner: second
  })
})
test('win-diagonal', () => {
  const game2 = new XOXGame()
  expect(game2.playerMove(first, 0, 0)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', '', ''],
    ['', '', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(second, 0, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', ''],
    ['', '', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(first, 1, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', ''],
    ['', 'x', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(second, 1, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', ''],
    ['', 'x', 'o'],
    ['', '', '']
  ])
  expect(game2.playerMove(first, 2, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', ''],
    ['', 'x', 'o'],
    ['', '', 'x']
  ])
  expect(game2.status()).toMatchObject({
    code: 'victory',
    combination: [[0, 0], [1, 1], [2, 2]],
    winner: first
  })
})

test('draw', () => {
  const game2 = new XOXGame()
  expect(game2.playerMove(first, 0, 0)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', '', ''],
    ['', '', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(second, 0, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', ''],
    ['', '', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(first, 1, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', ''],
    ['', 'x', ''],
    ['', '', '']
  ])

  expect(game2.playerMove(second, 1, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', ''],
    ['', 'x', 'o'],
    ['', '', '']
  ])
  expect(game2.playerMove(first, 0, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', 'x'],
    ['', 'x', 'o'],
    ['', '', '']
  ])

  expect(game2.playerMove(second, 2, 0)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', 'x'],
    ['', 'x', 'o'],
    ['o', '', '']
  ])

  expect(game2.playerMove(first, 2, 1)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', 'x'],
    ['', 'x', 'o'],
    ['o', 'x', '']
  ])

  expect(game2.playerMove(second, 2, 2)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', 'x'],
    ['', 'x', 'o'],
    ['o', 'x', 'o']
  ])

  expect(game2.playerMove(first, 1, 0)).toMatchObject({ isSuccess: true })
  expect(game2.board).toMatchObject([
    ['x', 'o', 'x'],
    ['x', 'x', 'o'],
    ['o', 'x', 'o']
  ])
  expect(game2.status()).toMatchObject({
    code: 'draw'
  })
})
