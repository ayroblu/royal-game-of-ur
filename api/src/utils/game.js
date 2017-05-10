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
export function getAvailableMoves(board, playerPieces, diceResult, currentPlayerId = null){
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
        y(m)
      }
    })
  })
}
//function gameMoves(){
//  //Decide who starts
//  //loop
//  //  roll dice
//  //  move piece
//  //  check points
//  //  check victory
//  //  if (piece lands on reroll) continue
//  //  switch turns
//  //endloop
//}
export class GameEngine{
  constructor(yourId, game){
    this._playerTurn = 0 //1 is player 1, 2 is player 2
    this._victor = null
    if (game){
      const {board, firstPlayerPieces, secondPlayerPieces
      , firstPlayerId, firstPlayerName, secondPlayerId, secondPlayerName, playerTurn} = game
      this.board = board
      this.firstPlayer = {
        id: firstPlayerId
      , pieces: firstPlayerPieces
      , name: firstPlayerName
      }
      if (secondPlayerId){
        this.secondPlayer = {
          id: secondPlayerId
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
      this._initialiseBoard(yourId)
    }
    this._yourId = yourId
    this.game = this.gameplay()
  }
  static generateId(){
    return Math.random().toString(36).substr(2)
  }
  _initialiseBoard(yourId){
    this.board = createBoard()
    this.firstPlayer = {
      id: yourId
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
  _switchTurn(){
    this._playerTurn = this._playerTurn === 1 ? 2 : 1
  }
  // returns true if landed on a reroll
  _makeMove(playerPieces, move, isOpponent=false){
    const oldCoord = posToCoords(playerPieces[move.id].pos)
    if (oldCoord[0] !== -1){
      this.board[oldCoord[0]][oldCoord[1]].player = null
    }
    playerPieces[move.id].pos = move.pos
    this.board[move.coord[0]][move.coord[1]].player = {
      id: move.id, playerId: move.playerId, pos: move.pos, isOpponent
    }
    _.flatten(this.board).forEach(b=>b.onClick = null)
    return !!this.board[move.coord[0]][move.coord[1]].reroll
    // board piece has {player:{id: 0, playerId: '', pos: 3, isOpponent: false}}
  }
  _checkVictory(){
    //return false for no, 1 for player 1, 2 for player 2
    const firstPoints = checkPoints(this.firstPlayer.pieces)
    if (checkVictory(firstPoints)){
      return 1
    }
    const secondPoints = checkPoints(this.secondPlayer.pieces)
    if (checkVictory(secondPoints)){
      return 2
    }
    return false
  }
  opponentsMove(move){
    const pieces = this._isFirstPlayer
      ? this.secondPlayer.pieces
      : this.firstPlayer.pieces
    const reroll = this._makeMove(pieces, move, true)
    const isVictory = this._checkVictory()
    if (isVictory){
      return 'Congrats to player '+isVictory+'!'
    }
    if (!reroll){
      this._switchTurn()
    }
    return false
  }
  *gameplay(){
    while(!this.secondPlayer){
      yield 'Need second player'
    }
    while (!this._hasStarted){
      if (this._yourId === this.firstPlayer.id){
        yield 'Decide who starts'
        this._playerTurn = decideStart() ? 1 : 2
        this._hasStarted = true
      } else {
        yield 'Waiting for deciding who starts'
      }
    }
    if (this._yourId === this.firstPlayer.id){
      this._isFirstPlayer = true
    }
    // just in case returning to completed game
    const isVictory = this._checkVictory()
    if (isVictory){
      yield 'Congrats to player '+isVictory+'!'
      return
    }

    while(!this._victor){
      while(this._playerTurn !== (this._isFirstPlayer ? 1 : 2)){
        yield 'Not your turn'
      }
      yield 'Your turn, roll the dice'
      const die = rollDie()
      const diceResult = die.reduce((a,n)=>a+n, 0)
      this.lastDie = die
      // highlight available moves
      
      const yourPieces = this._isFirstPlayer
        ? this.firstPlayer.pieces
        : this.secondPlayer.pieces
      const availableMoves = getAvailableMoves(this.board, yourPieces, diceResult, this._yourId)
      if (!availableMoves.length){
        yield 'No moves, switch turn'
        this._switchTurn()
        continue
        
        // tell server to opponent's turn
        // this.props.gameActions.set({isYourTurn: false})
        // continue
      }
      const highlightPromise = highlightAvailableMoves(this.board, availableMoves)
      this.availableMoves = availableMoves

      if (this.onBoardChange) this.onBoardChange()
      yield availableMoves.length + ' moves highlighted'

      highlightPromise.then(move=>{
        const reroll = this._makeMove(yourPieces, move)
        const isVictory = this._checkVictory()
        if (isVictory){
          console.log('Congrats to player '+isVictory+'!')
          this._victor = isVictory
        }
        if (reroll){
          //yield 'Reroll!'
        } else {
          //yield 'Move made, end turn'
          this._switchTurn()
        }
        if (this.onBoardChange) this.onBoardChange()
        this.availableMoves = null
      })

      while(this.availableMoves){
        yield 'Waiting for player to make a move'
      }
    }
    // so a player's move causes a game state save
  }
  next(){
    return this.game.next()
  }
}
