import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import GameBlock from './GameBlock'
import GamePiece from './GamePiece'
import './GameBoard.css'
import {posToCoords} from '../utils/game'

class GameBoard extends Component {
  static propTypes = {
    board: PropTypes.array.isRequired
  , setGameBoard: PropTypes.func.isRequired
  , boardDims: PropTypes.array
  , containerDims: PropTypes.array
  , yourPieces: PropTypes.array
  , opponentPieces: PropTypes.array
  }
  componentWillMount(){
    this.poss = 0
  }
  render() {
    const {game, board, boardDims, containerDim, yourPieces, opponentPieces} = this.props
    const yourPlayerId = game._isFirstPlayer ? game.firstPlayer.id : game.secondPlayer.id
    const opponentPlayerId = game._isFirstPlayer ? game.secondPlayer.id : game.firstPlayer.id
    if (boardDims){
      var pieces = yourPieces.filter(p=>p.pos > 0 && p.pos < 15)
        .map(p=>({id: p.id, playerId: yourPlayerId, pos: posToCoords(p.pos)}))
        .concat(opponentPieces.filter(p=>p.pos > 0 && p.pos < 15)
          .map(p=>({id: p.id, playerId: opponentPlayerId, pos: posToCoords(p.pos, true)}))
        ).map(c=>({
          id: c.id
        , isOpponent: c.playerId !== yourPlayerId
        , playerId: c.playerId
        , left: boardDims[c.pos[0]][c.pos[1]].left + boardDims[c.pos[0]][c.pos[1]].width/2 - containerDim.left
        , top: boardDims[c.pos[0]][c.pos[1]].top + boardDims[c.pos[0]][c.pos[1]].height/2 - containerDim.top
        }))
      console.log('pieces', pieces)
    }
    // board piece has {player:{id: 0, playerId: '', pos: 3, isOpponent: false}}
    return (
      <div className='GameBoard'>
        <div className='mainBoard'>
          {board.map((row, i)=>(
          <div key={i} className='row'>
            {row.map((b, k)=>(
            <GameBlock key={k} {...b} onClick={b.onClick} />
            ))}
          </div>
          ))}
        </div>
        <div className='dice'>
          <h2>Dice roll</h2>
          {typeof this.props.dieResult === 'number'
          ? this.props.dieResult
          : '-'}
        </div>
        {!!boardDims && pieces.map(p=>(
        <GamePiece key={`${p.playerId}-${p.id}`} left={p.left} top={p.top} isOpponent={p.isOpponent}/>
        ))}
      </div>
    )
  }
}

export default GameBoard
