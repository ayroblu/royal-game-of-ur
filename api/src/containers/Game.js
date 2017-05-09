import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GameBoard from '../components/GameBoard'
import * as userActions from '../actions/user'
import * as gameActions from '../actions/game'
import './Game.css'
import {createBoard, createPlayerPieces} from '../utils/game'

class Game extends Component {
  componentWillMount(){
    const board = createBoard()
    const yourPieces = createPlayerPieces()
    const opponentPieces = createPlayerPieces()
    this.props.gameActions.set({board})
  }
  render() {
    const {board} = this.props.game
    return (
      <div className='Game'>
        <h1>Game Page</h1>
        <GameBoard
          board={board}
        />
      </div>
    )
  }
}

export default connect(state=>({
  user: state.user
, game: state.game
}), dispatch=>({
  userActions: bindActionCreators(userActions, dispatch)
, gameActions: bindActionCreators(gameActions, dispatch)
}))(Game)
