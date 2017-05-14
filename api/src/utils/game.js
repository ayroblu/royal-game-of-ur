import _ from 'lodash'

export const numDie = 4
export const numPieces = 7

export function createBoard(){
  const boardDef = [
    [{reroll: true}, {}, {}, {}, {empty: true}, {empty: true}, {reroll: true}, {}]
  , [{}, {}, {}, {reroll: true, invulnerable: true}, {}, {}, {}, {}]
  , [{reroll: true}, {}, {}, {}, {empty: true}, {empty: true}, {reroll: true}, {}]
  ]
  return boardDef
}
export function createPlayerPieces(){
  const pieces = Array(numPieces).fill().map((a,i)=>({pos: 0, id: i}))
  return pieces
}
// convention: path is linear, so pos is just a number from 0 to 15
export function movePiecePos(pos=0, num=0){
  if (pos >= 15 || pos < 0){
    console.error('Invalid pos')
    return pos
  }
  if (num > numDie || num < 0){
    console.error('Invalid num steps, steps greater than die')
    return pos
  }
  if (pos + num > 15) {
    return pos
  }
  return pos + num
}
// top player is the opponent
export function posToCoords(pos=0, isTop=false){
  // 0 is off the board
  if (pos === 0){
    return [-1, -1]
    //return [isTop? 0 : 2, 4]
  }
  if (pos > 0 && pos <= 4){
    return [isTop ? 0 : 2, 4-pos]
  }
  if (pos >= 5 && pos <= 12){
    return [1, pos - 5]
  }
  // 15 is off the board in the points pile
  if (pos >= 13 && pos <= 15){
    return [isTop ? 0 : 2, 20-pos]
  }
  // Shouldn't really reach this
  return [-1, -1]
}
export function decideStart(){
  return Math.random()>0.5
}
export function rollDie(){
  const die = Array(numDie).fill().map(()=>Math.random()>0.5)
  return die
}
// will never be opponent
export function getAvailableMoves(board, playerPieces, diceResult, currentPlayerId = null){
  console.log('getAvailMoves', board, playerPieces, diceResult, currentPlayerId)
  if (diceResult === 0) return []
  const history = []
  const moves = playerPieces.map((p, i)=>{
    let endPos = p.pos + diceResult
    if (endPos > 15) {
      return null
    }
    const bb = getBoardBlock(board, posToCoords(endPos))
    if (bb.player && bb.player.id !== currentPlayerId && bb.invulnerable){
      ++endPos
    }
    const c = posToCoords(endPos)
    if (board[c[0]][c[1]].player && board[c[0]][c[1]].player.playerId === currentPlayerId){
      return null
    }
    if (history.includes(endPos)){
      return null
    }
    history.push(endPos)
    return {coord: c, pos: endPos, id: i, playerId: currentPlayerId}
  }).filter(p=>p)
  return moves
}
export function checkPoints(playerPieces){
  return playerPieces.reduce((a, n)=>a+(n.pos === 15 ? 1 : 0), 0)
}
export function checkVictory(points){
  return points === numPieces
}
export function checkReroll(board, coords){
  return !!board[coords[0]][coords[1]].reroll
}
export function getBoardBlock(board, coord){
  return board[coord[0]][coord[1]]
}
export function highlightAvailableMoves(board, availableMoves){
  _.flatten(board).forEach(b=>b.onClick = null)
  return new Promise(y=>{
    availableMoves.forEach(m=>{
      const c = m.coord
      board[c[0]][c[1]].onClick = ()=>{
        console.log('click')
        y(m)
      }
    })
  })
}
