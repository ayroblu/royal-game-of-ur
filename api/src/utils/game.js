const numDie = 4
export function createBoard(){
  const boardDef = [
    [{reroll: true}, {}, {}, {}, {empty: true}, {empty: true}, {reroll: true}, {}]
  , [{}, {}, {}, {reroll: true, invulnerable: true}, {}, {}, {}, {}]
  , [{reroll: true}, {}, {}, {}, {empty: true}, {empty: true}, {reroll: true}, {}]
  ]
  return boardDef
}
export function createPlayerPieces(){
  const pieces = Array(7).fill().map(()=>({}))
  return pieces
}
export function rollDie(){
  const die = Array(numDie).fill().map(()=>Math.random()>0.5)
  return die
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
