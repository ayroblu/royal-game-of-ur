import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import GameBlock from './GameBlock'
import GamePiece from './GamePiece'
import './GameBoard.css'
import {posToCoords} from '../utils/game'

class GameBoard extends Component {
  static propTypes = {
    boardDims: PropTypes.array
  , containerDims: PropTypes.array
  , game: PropTypes.object
  }
  componentWillMount(){
    this.poss = 0
  }
  render() {
    const {game, boardDims, containerDim} = this.props
    if (boardDims && game.secondPlayer){
      const you = game.isFirstPlayer ? game.firstPlayer : game.secondPlayer
      const opponent = game.isFirstPlayer ? game.secondPlayer : game.firstPlayer

      var pieces = you.pieces.filter(p=>p.pos > 0 && p.pos < 15)
        .map(p=>({id: p.id, playerId: you.id, pos: posToCoords(p.pos)}))
        .concat(opponent.pieces.filter(p=>p.pos > 0 && p.pos < 15)
          .map(p=>({id: p.id, playerId: opponent.id, pos: posToCoords(p.pos, true)}))
        ).map(c=>({
          id: c.id
        , isOpponent: c.playerId !== you.id
        , playerId: c.playerId
        , left: boardDims[c.pos[0]][c.pos[1]].left + boardDims[c.pos[0]][c.pos[1]].width/2 - containerDim.left
        , top: boardDims[c.pos[0]][c.pos[1]].top + boardDims[c.pos[0]][c.pos[1]].height/2 - containerDim.top
        }))
    }
    // board piece has {player:{id: 0, playerId: '', pos: 3, isOpponent: false}}
    return (
      <div className='GameBoard'>
        <div className='mainBoard'>
          {game.board && game.board.map((row, i)=>(
          <div key={i} className='row'>
            {row.map((b, k)=>(
            <GameBlock key={k} {...b} onClick={b.onClick} />
            ))}
          </div>
          ))}
        </div>
        <div className='dice'>
          <h2>Dice roll</h2>
          {typeof game.dieResult === 'number'
          ? game.dieResult
          : '-'}
        </div>
        {!!boardDims && pieces && pieces.map(p=>(
        <GamePiece key={`${p.playerId}-${p.id}`} left={p.left} top={p.top} isOpponent={p.isOpponent}/>
        ))}
      </div>
    )
  }
}

export default GameBoard
