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
  const pieces = Array(numPieces).fill().map(()=>({pos: 0}))
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
export function availableMoves(board, playerPieces, diceResult, currentPlayerId = null){
  if (diceResult === 0) return []
  const history = []
  const moves = playerPieces.map((p, i)=>{
    const endPos = p.pos + diceResult
    if (endPos > 15) {
      return null
    }
    const c = posToCoords(endPos)
    if (board[c[0]][c[1]].player && board[c[0]][c[1]].player.id !== currentPlayerId){
      return null
    }
    if (history.includes(endPos)){
      return null
    }
    history.push(endPos)
    return {coord: c, pos: endPos, id: i}
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
function gameMoves(){
  //Decide who starts
  //loop
  //  roll dice
  //  move piece
  //  check points
  //  check victory
  //  if (piece lands on reroll) continue
  //  switch turns
  //endloop
}
class GameEngine{
  constructor(yourId, game){
    this._playerTurn = 0 //1 is player 1, 2 is player 2
    if (game){
      const {board, firstPlayerPieces, secondPlayerPieces
      , firstPlayerId, firstPlayerName, secondPlayerId, secondPlayerName, playerTurn} = game
      this.board = board
      this.firstPlayer = {
        id: firstPlayerid
      , pieces: firstPlayerPieces
      , name: firstPlayerName
      }
      if (secondPlayerId){
        this.secondPlayer = {
          id: secondPlayerid
        , pieces: secondPlayerPieces
        , name: secondPlayerName
        }
      } else {
        this.secondPlayer = {
          id: yourId
        , pieces: createPlayerPieces()
        , name: 'Player 2'
        }
      }
      this._playerTurn = playerTurn
      this._hasStarted = true
    } else {
      this._hasStarted = false
      this._initialiseBoard()
    }
    this._yourId = yourId
    this.game = this.gameplay()
  }
  _generateId(){
    return Math.random().toString(36).substr(2)
  }
  _initialiseBoard(){
    this.board = createBoard()
    this.firstPlayer = {
      id: Math.random().toString(36).substr(2)
    , pieces: createPlayerPieces()
    , name: 'Player 1'
    }
  }
  addSecondPlayer({id, name}){
    this.secondPlayer = {
      id
    , name: name || 'Player 2'
    , pieces: createPlayerPieces()
    }
  }
  *gameplay(){
    while(!this.secondPlayer){
      yield 'Need second player'
    }
    while (!this._hasStarted){
      if (this._yourId === this.firstPlayer.id){
        yield ()=>{
          this._playerTurn = decideStart() ? 1 : 2
          this._hasStarted = true
        }
      } else {
        yield 'Waiting for deciding who starts'
      }
    }
    if (this._yourId === this.firstPlayer.id){
      this._isFirstPlayer = true
    }
    while(true){
      while(this._playerTurn !== (this._isFirstPlayer ? 1 : 2)){
        yield 'Not your turn'
      }
      yield 'Your turn'
    }
    // so a player's move causes a game state save
  }
  next(){
    return this.game.next()
  }
}
