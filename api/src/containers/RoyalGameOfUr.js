import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import * as userActions from '../actions/user'
import './RoyalGameOfUr.css'
import * as game from '../utils/game'

class RoyalGameOfUr extends Component {
  static propTypes = {
    onEvent: PropTypes.func.isRequired
  , defaultGame: PropTypes.object
  }
  generateId(){
    return Math.random().toString(36).substr(2)
  }
  constructor(props){
    super(props)
    // yourId, game
    const {yourId, defaultGame} = props
    if (defaultGame){
      const {board, firstPlayerPieces, secondPlayerPieces
      , firstPlayerId, firstPlayerName, secondPlayerId, secondPlayerName, playerTurn} = defaultGame
      const firstPlayer = {
        id: firstPlayerId
      , pieces: firstPlayerPieces
      , name: firstPlayerName
      }
      let secondPlayer = null
      if (secondPlayerId){
        secondPlayer = {
          id: secondPlayerId
        , pieces: secondPlayerPieces
        , name: secondPlayerName
        }
      } else if (!yourId) {
        secondPlayer = {
          id: this.generateId()
        , pieces: createPlayerPieces()
        , name: 'Player 2'
        }
        window.localStorage.setItem('yourId', secondPlayer.id)
      }
      this.props.rguActions.set({board, secondPlayer, hasStarted: playerTurn !== 0, playerTurn, yourId: yourId && !secondPlayerId ? yourId : secondPlayer.id})
    } else {
      this.initialiseBoard()
    }
  }
  initialiseBoard(){
    const board = game.createBoard()
    const firstPlayer = {
      id: this.generateId()
    , pieces: game.createPlayerPieces()
    , name: 'Player 1'
    }
    window.localStorage.setItem('yourId', secondPlayer.id)
    this.props.rguActions.set({board, firstPlayer, yourId: firstPlayer.id})
  }
  addSecondPlayer({id, name}){
    const secondPlayer = {
      id
    , name: name || 'Player 2'
    , pieces: game.createPlayerPieces()
    }
    this.props.rguActions.set({secondPlayer})
  }
  switchTurn(){
    const playerTurn = this.props.playerTurn === 1 ? 2 : 1
    this.props.rguActions.set({playerTurn})
    if (this.props.onEvent) this.props.onEvent({type: 'switch-turns', playerTurn})
  }
  // returns true if landed on a reroll
  makeMove(playerPieces, otherPlayerPieces, move, isOpponent=false){
    const {board} = this.props

    const oldCoord = game.posToCoords(playerPieces[move.id].pos, isOpponent)
    if (oldCoord[0] !== -1){
      board[oldCoord[0]][oldCoord[1]].player = null
    }
    playerPieces[move.id].pos = move.pos

    // remove other player's piece
    if (board[move.coord[0]][move.coord[1]].player){
      const op = board[move.coord[0]][move.coord[1]].player
      otherPlayerPieces[op.id].pos = 0
    }
    this.props.board[move.coord[0]][move.coord[1]].player = {
      id: move.id, playerId: move.playerId, pos: move.pos, isOpponent
    }
    _.flatten(board).forEach(b=>b.onClick = null)
    if (this.props.onEvent && !isOpponent) this.onEvent({type: 'make-move', move})

    this.props.rguActions.set({board})

    return !!this.props.board[move.coord[0]][move.coord[1]].reroll
    // board piece has {player:{id: 0, playerId: '', pos: 3, isOpponent: false}}
  }
  checkVictory(){
    //return false for no, 1 for player 1, 2 for player 2
    const firstPoints = game.checkPoints(this.props.firstPlayer.pieces)
    if (game.checkVictory(firstPoints)){
      return 1
    }
    const secondPoints = game.checkPoints(this.props.secondPlayer.pieces)
    if (game.checkVictory(secondPoints)){
      return 2
    }
    return false
  }
  opponentsMove(move){
    const opponentPieces = this.props.isFirstPlayer
      ? this.props.secondPlayer.pieces
      : this.props.firstPlayer.pieces
    const yourPieces = this.props.isFirstPlayer
      ? this.props.firstPlayer.pieces
      : this.props.secondPlayer.pieces
    // coords need to be flipped for the opponent's move
    if (move.coord[0] === 2){
      move.coord[0] = 0
    }
    const reroll = this.makeMove(opponentPieces, yourPieces, move, true)
    if (this.props.onEvent) this.props.onEvent({type: null})
    const isVictory = this.checkVictory()
    if (isVictory){
      return 'Congrats to player '+isVictory+'!'
    }
    if (!reroll){
      this.switchTurn()
    }
    return false
  }
  render() {
    return null
  }
}

export default connect(state=>({
  ...state.rgu
}), dispatch=>({
  rguActions: bindActionCreators(rguActions, dispatch)
}))(RoyalGameOfUr)

